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
} from "./gameManager.js";

import { getAllCategories } from "./categories.js";

const app = express();
app.use(cors());

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

  room.players.forEach((p) => {
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
    const room = createRoom(playerId, playerName, gameMode);

    socketPlayerMap.set(socket.id, { playerId, roomCode: room.code });
    socket.join(room.code);

    callback({ ok: true, roomCode: room.code, playerId });
    broadcastRoomState(room);
  });

  // ── JOIN ROOM ──
  socket.on("JOIN_ROOM", ({ roomCode, playerName }, callback) => {
    const code = roomCode?.toUpperCase();
    const room = getRoom(code);

    if (!room) return callback({ ok: false, error: "Room not found" });
    if (room.gameState !== GameState.LOBBY)
      return callback({ ok: false, error: "Game already in progress" });
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
  socket.on("UPDATE_SETTINGS", ({ roomCode, maxRounds, selectedCategory, skipTyping, gameMode }) => {
    const room = getRoom(roomCode);
    if (!room || room.gameState !== GameState.LOBBY) return;
    if (socket.id !== room.hostId) return;

    if (maxRounds) room.maxRounds = Math.max(1, Math.min(10, maxRounds));
    if (selectedCategory !== undefined) room.selectedCategory = selectedCategory;
    if (skipTyping !== undefined) room.skipTyping = Boolean(skipTyping);
    if (gameMode && (gameMode === "SOCIAL_DEDUCTION" || gameMode === "CATEGORY_IMPOSTER")) {
      room.gameMode = gameMode;
    }

    broadcastRoomState(room);
  });

  // ── START GAME ──
  socket.on("START_GAME", ({ roomCode }) => {
    const room = getRoom(roomCode);
    if (!room) return;
    if (socket.id !== room.hostId) return;

    const minPlayers = room.gameMode === "CATEGORY_IMPOSTER" ? 3 : 4;
    if (room.players.length < minPlayers) return;

    startRound(room);
    broadcastRoomState(room);
    sendRoundStartData(room);
  });

  // ── STORYTELLER SELECTS 2 WORDS FROM THEIR 12 CARDS ──
  socket.on("STORYTELLER_SELECT", ({ roomCode, commonWord, imposterWord }) => {
    const room = getRoom(roomCode);
    if (!room) return;
    if (socket.id !== room.storytellerId) return;
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

    selectCard(room, socket.id, card);
    broadcastRoomState(room);
  });

  // ── LOCK ANSWER ──
  socket.on("LOCK_ANSWER", ({ roomCode }) => {
    const room = getRoom(roomCode);
    if (!room || room.gameState !== GameState.CARD_SELECTION) return;

    const allLocked = lockAnswer(room, socket.id);
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
    if (!room || room.gameState !== GameState.REVEAL) return;

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
    if (socket.id !== room.hostId) return;

    startVoting(room);
    broadcastRoomState(room);
    io.to(roomCode).emit("VOTING_STARTED", {});
  });

  // ── CHAT MESSAGE ──
  socket.on("CHAT_MESSAGE", ({ roomCode, message }) => {
    const room = getRoom(roomCode);
    if (!room) return;
    if (room.gameState !== GameState.DISCUSSION) return;
    // Storyteller cannot chat during discussion
    if (socket.id === room.storytellerId) return;

    const player = room.players.find((p) => p.id === socket.id);
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

    const result = castVote(room, socket.id, targetId);
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
    if (socket.id !== room.hostId) return;

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
    if (socket.id !== room.hostId) return;

    resetGame(room);
    broadcastRoomState(room);
  });

  // ── KICK PLAYER ──
  socket.on("KICK_PLAYER", ({ roomCode, targetId }) => {
    const room = getRoom(roomCode);
    if (!room || room.gameState !== GameState.LOBBY) return;
    if (socket.id !== room.hostId) return;
    if (targetId === room.hostId) return;

    removePlayer(room, targetId);
    const targetSocket = findSocketForPlayer(targetId);
    if (targetSocket) {
      targetSocket.emit("KICKED", {});
      targetSocket.leave(roomCode);
      socketPlayerMap.delete(targetSocket.id);
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

      if (room.gameState === GameState.LOBBY) {
        removePlayer(room, mapping.playerId);
      }
    }

    socketPlayerMap.delete(socket.id);
    broadcastRoomState(room);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Secret Word Imposter server running on port ${PORT}`);
});
