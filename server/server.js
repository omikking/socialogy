import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import {
  GameState,
  createRoom,
  getRoom,
  addPlayer,
  removePlayer,
  getPublicPlayers,
  startRound,
  storytellerSelectWords,
  selectCard,
  lockAnswer,
  startDiscussion,
  startVoting,
  castVote,
  tallyVotes,
  showScoreboard,
  isGameFinished,
  finishGame,
  resetGame,
  forceNextPhase,
} from "./gameManager.js";

import { getAllCategories } from "./categories.js";
import { getUniquePool, shuffle } from "./wordDatabase.js";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("🚀 Secret Word Imposter server is running!");
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Track socket → player mapping
const socketPlayerMap = new Map(); // socketId → { playerId, roomCode }

function broadcastRoomState(room) {
  const revealPhases = [
    GameState.REVEAL,
    GameState.DISCUSSION,
    GameState.VOTING,
    GameState.RESULTS,
    GameState.SCOREBOARD,
    GameState.FINISHED,
  ];
  const publicCommonWord = revealPhases.includes(room.gameState)
    ? room.commonWord
    : null;

  io.to(room.code).emit("ROOM_STATE", {
    code: room.code,
    hostId: room.hostId,
    gameMode: room.gameMode,
    cardDistribution: room.cardDistribution || "SAME_30",
    selectedCategory: room.selectedCategory,
    categoryName: room.categoryName,
    skipTyping: room.skipTyping,
    categories: getAllCategories(),
    players: getPublicPlayers(room),
    roundNumber: room.roundNumber,
    maxRounds: room.maxRounds,
    gameState: room.gameState,
    storytellerId: room.storytellerId,
    phaseEndsAt: room.phaseEndsAt,
    commonWord: publicCommonWord,
  });
}

function getAnswersForReveal(room) {
  return room.players
    .filter((p) => p.id !== room.storytellerId)
    .map((p) => ({
      id: p.id,
      name: p.name,
      selectedCard: p.selectedCard,
    }));
}

function findSocketForPlayer(playerId) {
  const direct = io.sockets.sockets.get(playerId);
  if (direct) return direct;

  for (const [socketId, mapping] of socketPlayerMap.entries()) {
    if (mapping.playerId === playerId) {
      return io.sockets.sockets.get(socketId) || null;
    }
  }
  return null;
}

function getPlayerId(socket) {
  const mapping = socketPlayerMap.get(socket.id);
  return mapping ? mapping.playerId : socket.id;
}

function isHostSocket(socket, room) {
  if (!room) return false;
  const pid = getPlayerId(socket);
  return pid === room.hostId || socket.id === room.hostId;
}

function ensurePlayerHas30Cards(room, player) {
  if (!room || room.gameMode === "CATEGORY_IMPOSTER") return;
  const isSame = (room.cardDistribution || "SAME_30") === "SAME_30";
  if (isSame) {
    if (!room.sharedWordCards || room.sharedWordCards.length < 30) {
      const pool = shuffle(getUniquePool());
      room.sharedWordCards = pool.slice(0, 30);
    }
    player.wordCards = [...room.sharedWordCards];
    return;
  }

  if (!player.wordCards) player.wordCards = [];
  if (player.wordCards.length < 30) {
    const uniquePool = getUniquePool();
    const existing = new Set(player.wordCards);
    const available = shuffle(uniquePool.filter((w) => !existing.has(w)));
    while (player.wordCards.length < 30 && available.length > 0) {
      player.wordCards.push(available.pop());
    }
  }
}

/**
 * Send each player their role + word cards after round starts.
 */
function sendRoundStartData(room) {
  if (room.gameMode === "CATEGORY_IMPOSTER") {
    room.players.forEach((p) => {
      const s = findSocketForPlayer(p.id);
      if (!s) return;

      const isImposter = p.id === room.imposterId;
      s.emit("ROLE_ASSIGNED", {
        role: isImposter ? "IMPOSTER" : "CIVILIAN",
        gameMode: room.gameMode,
        categoryName: room.categoryName,
        secretWord: isImposter ? room.imposterWord : room.commonWord,
      });
    });
    return;
  }

  room.players.forEach((p) => {
    ensurePlayerHas30Cards(room, p);
    const s = findSocketForPlayer(p.id);
    if (!s) return;

    if (p.id === room.storytellerId) {
      s.emit("ROLE_ASSIGNED", {
        role: "STORYTELLER",
        wordCards: p.wordCards,
      });
      s.emit("WORD_CARDS", { cards: p.wordCards });
    } else {
      s.emit("WAITING_FOR_STORYTELLER", {});
    }
  });
}

/**
 * After storyteller picks 2 words, send each player their secret word + cards.
 */
function sendSecretWordsAndCards(room) {
  if (room.gameMode === "CATEGORY_IMPOSTER") {
    sendRoundStartData(room);
    return;
  }

  // Ensure SAME_30 distribution synchronizes identical cards for everyone
  const isSame = (room.cardDistribution || "SAME_30") === "SAME_30";
  if (isSame) {
    if (!room.sharedWordCards || room.sharedWordCards.length < 30) {
      const pool = shuffle(getUniquePool());
      room.sharedWordCards = pool.slice(0, 30);
    }
    room.players.forEach((p) => {
      p.wordCards = [...room.sharedWordCards];
    });
  }

  room.players.forEach((p) => {
    ensurePlayerHas30Cards(room, p);
    const s = findSocketForPlayer(p.id);
    if (!s) return;

    if (p.id === room.storytellerId) {
      s.emit("ROLE_ASSIGNED", {
        role: "STORYTELLER",
        commonWord: room.commonWord,
        imposterWord: room.imposterWord,
        wordCards: p.wordCards,
      });
      s.emit("WORD_CARDS", { cards: p.wordCards });
    } else {
      const secretWord =
        p.id === room.imposterId ? room.imposterWord : room.commonWord;
      s.emit("ROLE_ASSIGNED", {
        role: "PLAYER",
        secretWord,
        wordCards: p.wordCards,
      });
      s.emit("WORD_CARDS", { cards: p.wordCards });
    }
  });
}

// ─── Socket.IO event handlers ─────────────────────────────────
io.on("connection", (socket) => {
  console.log(`[Connect] ${socket.id}`);

  // ── CREATE ROOM ──
  socket.on("CREATE_ROOM", ({ playerName, gameMode }, callback) => {
    const playerId = socket.id;
    const mode = gameMode === "CATEGORY_IMPOSTER" ? "CATEGORY_IMPOSTER" : "SOCIAL_DEDUCTION";
    const room = createRoom(playerId, playerName, mode);

    socketPlayerMap.set(socket.id, { playerId, roomCode: room.code });
    socket.join(room.code);

    callback({ ok: true, roomCode: room.code, playerId });
    broadcastRoomState(room);
  });

  // ── REJOIN ROOM ──
  socket.on("REJOIN_ROOM", ({ roomCode, playerId, playerName }, callback) => {
    const code = roomCode?.toUpperCase();
    const room = getRoom(code);

    if (!room) return callback && callback({ ok: false, error: "Room not found" });

    let player = room.players.find((p) => p.id === playerId);
    if (!player && playerName) {
      player = addPlayer(room, playerId, playerName);
    }

    if (!player) return callback && callback({ ok: false, error: "Could not rejoin" });

    player.connected = true;
    socketPlayerMap.set(socket.id, { playerId: player.id, roomCode: code });
    socket.join(code);

    if (player.isHost) {
      room.hostId = player.id;
    }

    if (callback) callback({ ok: true, roomCode: code, playerId: player.id, playerName: player.name });

    broadcastRoomState(room);

    // If game in progress, send secret role/cards data
    if (room.gameState !== GameState.LOBBY) {
      ensurePlayerHas30Cards(room, player);
      const isStoryteller = player.id === room.storytellerId;
      const isImposter = player.id === room.imposterId;
      const cards = player.wordCards || [];

      socket.emit("ROLE_ASSIGNED", {
        role: isStoryteller ? "STORYTELLER" : isImposter ? "IMPOSTER" : "PLAYER",
        secretWord: isStoryteller ? null : isImposter ? room.imposterWord : room.commonWord,
        commonWord: isStoryteller ? room.commonWord : null,
        imposterWord: isStoryteller ? room.imposterWord : null,
        wordCards: cards,
      });
      if (cards.length > 0) {
        socket.emit("WORD_CARDS", { cards });
      }
    }
  });

  // ── JOIN ROOM ──
  socket.on("JOIN_ROOM", ({ roomCode, playerName }, callback) => {
    const code = roomCode?.toUpperCase();
    const room = getRoom(code);

    if (!room) return callback({ ok: false, error: "Room not found" });
    if (room.players.length >= 10)
      return callback({ ok: false, error: "Room is full" });

    const playerId = socket.id;
    const player = addPlayer(room, playerId, playerName);
    if (!player) return callback({ ok: false, error: "Could not join" });

    socketPlayerMap.set(socket.id, { playerId, roomCode: code });
    socket.join(code);

    callback({ ok: true, roomCode: code, playerId });
    broadcastRoomState(room);
  });

  // ── UPDATE SETTINGS ──
  socket.on("UPDATE_SETTINGS", ({ roomCode, maxRounds, selectedCategory, skipTyping, gameMode, cardDistribution }) => {
    const room = getRoom(roomCode);
    if (!room || room.gameState !== GameState.LOBBY) return;
    if (!isHostSocket(socket, room)) return;

    if (maxRounds) room.maxRounds = Math.max(1, Math.min(10, maxRounds));
    if (selectedCategory !== undefined) room.selectedCategory = selectedCategory;
    if (skipTyping !== undefined) room.skipTyping = Boolean(skipTyping);
    if (gameMode && (gameMode === "SOCIAL_DEDUCTION" || gameMode === "CATEGORY_IMPOSTER")) {
      room.gameMode = gameMode;
    }
    if (cardDistribution && (cardDistribution === "SAME_30" || cardDistribution === "DIFFERENT_30")) {
      room.cardDistribution = cardDistribution;
    }

    broadcastRoomState(room);
  });

  // ── START GAME ──
  socket.on("START_GAME", ({ roomCode }) => {
    const room = getRoom(roomCode);
    if (!room) return;
    if (!isHostSocket(socket, room)) return;

    const minPlayers = room.gameMode === "CATEGORY_IMPOSTER" ? 3 : 4;
    if (room.players.length < minPlayers) return;

    startRound(room);
    broadcastRoomState(room);
    sendRoundStartData(room);
  });

  // ── STORYTELLER SELECTS 2 WORDS FROM THEIR 30 CARDS ──
  socket.on("STORYTELLER_SELECT", ({ roomCode, commonWord, imposterWord }) => {
    const room = getRoom(roomCode);
    if (!room) return;
    const pid = getPlayerId(socket);
    if (pid !== room.storytellerId && socket.id !== room.storytellerId) return;
    if (room.gameState !== GameState.STORYTELLER_PICK) return;

    const ok = storytellerSelectWords(room, commonWord, imposterWord);
    if (!ok) return;

    broadcastRoomState(room);
    sendSecretWordsAndCards(room);
  });

  // ── GET MY CARDS / RESYNC ──
  socket.on("GET_MY_CARDS", ({ roomCode }, callback) => {
    const room = getRoom(roomCode);
    if (!room) return callback && callback({ ok: false, error: "Room not found" });

    const mapping = socketPlayerMap.get(socket.id);
    const pid = mapping?.playerId || socket.id;
    const player = room.players.find((p) => p.id === pid || p.id === socket.id);
    if (!player) return callback && callback({ ok: false, error: "Player not found" });

    const isStoryteller = player.id === room.storytellerId;
    const isImposter = player.id === room.imposterId;

    ensurePlayerHas30Cards(room, player);
    const cards = player.wordCards && player.wordCards.length > 0 ? player.wordCards : [];
    const data = {
      ok: true,
      wordCards: cards,
      isStoryteller,
      role: isStoryteller ? "STORYTELLER" : "PLAYER",
      secretWord: isStoryteller
        ? null
        : isImposter
        ? room.imposterWord
        : room.commonWord,
      commonWord: isStoryteller ? room.commonWord : null,
      imposterWord: isStoryteller ? room.imposterWord : null,
    };

    if (callback) callback(data);
    socket.emit("ROLE_ASSIGNED", data);
    socket.emit("WORD_CARDS", { cards });
  });

  // ── SELECT CARD ──
  socket.on("SELECT_CARD", ({ roomCode, card }) => {
    const room = getRoom(roomCode);
    if (!room || room.gameState !== GameState.CARD_SELECTION) return;

    const pid = getPlayerId(socket);
    selectCard(room, pid, card);
    broadcastRoomState(room);
  });

  // ── LOCK ANSWER ──
  socket.on("LOCK_ANSWER", ({ roomCode }) => {
    const room = getRoom(roomCode);
    if (!room || room.gameState !== GameState.CARD_SELECTION) return;

    const pid = getPlayerId(socket);
    const allLocked = lockAnswer(room, pid);
    broadcastRoomState(room);

    if (allLocked) {
      io.to(roomCode).emit("ANSWERS_REVEALED", {
        answers: getAnswersForReveal(room),
        commonWord: room.commonWord,
      });
    }
  });

  // ── START DISCUSSION ──
  socket.on("START_DISCUSSION", ({ roomCode }) => {
    const room = getRoom(roomCode);
    if (!room) return;
    if (
      room.gameState !== GameState.REVEAL &&
      room.gameState !== GameState.SECRET_WORD &&
      room.gameState !== GameState.ROLE_ASSIGNMENT
    ) return;

    startDiscussion(room);
    broadcastRoomState(room);

    // Auto-transition to voting after 90s
    setTimeout(() => {
      if (room.gameState === GameState.DISCUSSION) {
        startVoting(room);
        broadcastRoomState(room);
        io.to(roomCode).emit("VOTING_STARTED", {});
      }
    }, 90000);
  });

  // ── SKIP TO VOTING ──
  socket.on("SKIP_TO_VOTING", ({ roomCode }) => {
    const room = getRoom(roomCode);
    if (!room || room.gameState !== GameState.DISCUSSION) return;
    if (!isHostSocket(socket, room)) return;

    startVoting(room);
    broadcastRoomState(room);
    io.to(roomCode).emit("VOTING_STARTED", {});
  });

  // ── CHAT MESSAGE ──
  socket.on("CHAT_MESSAGE", ({ roomCode, message }) => {
    const room = getRoom(roomCode);
    if (!room) return;
    if (room.gameState !== GameState.DISCUSSION) return;
    const pid = getPlayerId(socket);
    // Storyteller cannot chat during discussion
    if (pid === room.storytellerId || socket.id === room.storytellerId) return;

    const player = room.players.find((p) => p.id === pid || p.id === socket.id);
    if (!player) return;

    const chatMsg = {
      id: Date.now().toString(),
      playerId: player.id,
      playerName: player.name,
      message: message.slice(0, 200),
      timestamp: Date.now(),
    };
    room.chatMessages.push(chatMsg);
    io.to(roomCode).emit("CHAT_MESSAGE", chatMsg);
  });

  // ── CAST VOTE ──
  socket.on("CAST_VOTE", ({ roomCode, targetId }) => {
    const room = getRoom(roomCode);
    if (!room || room.gameState !== GameState.VOTING) return;

    const pid = getPlayerId(socket);
    const result = castVote(room, pid, targetId);
    if (!result.ok) return socket.emit("VOTE_ERROR", { error: result.reason });

    broadcastRoomState(room);

    if (result.allVoted) {
      const roundResult = tallyVotes(room);
      broadcastRoomState(room);
      io.to(roomCode).emit("ROUND_RESULT", roundResult);
    }
  });

  // ── SHOW SCOREBOARD ──
  socket.on("SHOW_SCOREBOARD", ({ roomCode }) => {
    const room = getRoom(roomCode);
    if (!room || room.gameState !== GameState.RESULTS) return;

    showScoreboard(room);
    broadcastRoomState(room);

    io.to(roomCode).emit("SCORE_UPDATE", {
      scores: room.players.map((p) => ({ id: p.id, name: p.name, score: p.score })),
    });
  });

  // ── NEXT ROUND ──
  socket.on("NEXT_ROUND", ({ roomCode }) => {
    const room = getRoom(roomCode);
    if (!room) return;
    if (!isHostSocket(socket, room)) return;

    if (isGameFinished(room)) {
      finishGame(room);
      broadcastRoomState(room);
      io.to(roomCode).emit("GAME_FINISHED", {
        scores: room.players
          .map((p) => ({ id: p.id, name: p.name, score: p.score }))
          .sort((a, b) => b.score - a.score),
      });
    } else {
      startRound(room);
      broadcastRoomState(room);
      sendRoundStartData(room);
    }
  });

  // ── PLAY AGAIN ──
  socket.on("PLAY_AGAIN", ({ roomCode }) => {
    const room = getRoom(roomCode);
    if (!room) return;
    if (!isHostSocket(socket, room)) return;

    resetGame(room);
    broadcastRoomState(room);
  });

  // ── FORCE NEXT PHASE (HOST ACTION) ──
  socket.on("FORCE_NEXT_PHASE", ({ roomCode }) => {
    const room = getRoom(roomCode);
    if (!room) return;
    if (!isHostSocket(socket, room)) return;

    const res = forceNextPhase(room);
    if (res && res.tally) {
      const roundResult = tallyVotes(room);
      broadcastRoomState(room);
      io.to(roomCode).emit("ROUND_RESULT", roundResult);
    } else {
      broadcastRoomState(room);
      if (room.gameState === GameState.CARD_SELECTION) {
        sendSecretWordsAndCards(room);
      } else if (room.gameState === GameState.REVEAL) {
        io.to(roomCode).emit("ANSWERS_REVEALED", {
          answers: getAnswersForReveal(room),
          commonWord: room.commonWord,
        });
      } else if (room.gameState === GameState.VOTING) {
        io.to(roomCode).emit("VOTING_STARTED", {});
      }
    }
  });

  // ── KICK PLAYER (ANY PHASE) ──
  socket.on("KICK_PLAYER", ({ roomCode, targetId }) => {
    const room = getRoom(roomCode);
    if (!room) return;
    if (!isHostSocket(socket, room)) return;
    if (targetId === room.hostId) return;

    removePlayer(room, targetId);
    const targetSocket = findSocketForPlayer(targetId);
    if (targetSocket) {
      targetSocket.emit("KICKED", {});
      targetSocket.leave(roomCode);
      socketPlayerMap.delete(targetSocket.id);
    }

    // Auto-advance if remaining players finished phase
    if (room.gameState === GameState.CARD_SELECTION) {
      const activeEligible = room.players.filter(
        (p) => p.id !== room.storytellerId && !p.isSpectating
      );
      if (activeEligible.length > 0 && activeEligible.every((p) => p.answerLocked)) {
        room.gameState = GameState.REVEAL;
        io.to(roomCode).emit("ANSWERS_REVEALED", {
          answers: getAnswersForReveal(room),
          commonWord: room.commonWord,
        });
      }
    } else if (room.gameState === GameState.VOTING) {
      const eligibleVoters = room.players.filter(
        (p) => p.id !== room.storytellerId && !p.isSpectating
      );
      if (eligibleVoters.length > 0 && eligibleVoters.every((p) => p.voteLocked)) {
        const roundResult = tallyVotes(room);
        broadcastRoomState(room);
        io.to(roomCode).emit("ROUND_RESULT", roundResult);
        return;
      }
    }

    broadcastRoomState(room);
  });

  // ── DISCONNECT ──
  socket.on("disconnect", () => {
    console.log(`[Disconnect] ${socket.id}`);
    const mapping = socketPlayerMap.get(socket.id);
    if (!mapping) return;

    const room = getRoom(mapping.roomCode);
    if (!room) return;

    const player = room.players.find((p) => p.id === mapping.playerId);
    if (player) {
      player.connected = false;
    }

    socketPlayerMap.delete(socket.id);
    broadcastRoomState(room);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Secret Word Imposter server running on port ${PORT}`);
});
