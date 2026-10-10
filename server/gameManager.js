import { v4 as uuidv4 } from "uuid";
import { assignWordsToPlayers } from "./wordDatabase.js";
import { getAllCategories, pickCategoryWords } from "./categories.js";

// ─── Game State Enum ──────────────────────────────────────────
const GameState = {
  LOBBY: "LOBBY",
  ROLE_ASSIGNMENT: "ROLE_ASSIGNMENT",
  STORYTELLER_PICK: "STORYTELLER_PICK",
  SECRET_WORD: "SECRET_WORD",
  CARD_SELECTION: "CARD_SELECTION",
  REVEAL: "REVEAL",
  DISCUSSION: "DISCUSSION",
  VOTING: "VOTING",
  RESULTS: "RESULTS",
  SCOREBOARD: "SCOREBOARD",
  FINISHED: "FINISHED",
};

// ─── In-memory store ──────────────────────────────────────────
const rooms = new Map();

// ─── Helpers ──────────────────────────────────────────────────
function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function createRoom(hostId, hostName, gameMode = "SOCIAL_DEDUCTION") {
  let code;
  do {
    code = generateRoomCode();
  } while (rooms.has(code));

  const room = {
    id: uuidv4(),
    code,
    hostId,
    gameMode: gameMode === "CATEGORY_IMPOSTER" ? "CATEGORY_IMPOSTER" : "SOCIAL_DEDUCTION",
    selectedCategory: "Random",
    categoryName: null,
    skipTyping: false,
    players: [
      {
        id: hostId,
        name: hostName,
        isHost: true,
        score: 0,
        connected: true,
        selectedCard: null,
        answerLocked: false,
        votedFor: null,
        voteLocked: false,
        wordCards: [],
      },
    ],
    roundNumber: 0,
    maxRounds: 5,
    gameState: GameState.LOBBY,
    storytellerId: null,
    imposterId: null,
    commonWord: null,
    imposterWord: null,
    storytellerOrder: [],
    phaseTimer: null,
    phaseEndsAt: null,
    chatMessages: [],
  };

  rooms.set(code, room);
  return room;
}

function getRoom(code) {
  return rooms.get(code?.toUpperCase()) || null;
}

function addPlayer(room, playerId, playerName) {
  if (room.players.length >= 10) return null;
  if (room.gameState !== GameState.LOBBY) return null;

  const existing = room.players.find((p) => p.id === playerId);
  if (existing) {
    existing.connected = true;
    return existing;
  }

  const player = {
    id: playerId,
    name: playerName,
    isHost: false,
    score: 0,
    connected: true,
    selectedCard: null,
    answerLocked: false,
    votedFor: null,
    voteLocked: false,
    wordCards: [],
  };
  room.players.push(player);
  return player;
}

function removePlayer(room, playerId) {
  room.players = room.players.filter((p) => p.id !== playerId);
  if (room.players.length > 0 && room.hostId === playerId) {
    room.hostId = room.players[0].id;
    room.players[0].isHost = true;
  }
}

// ─── Public player data (no secrets) ──────────────────────────
function getPublicPlayers(room) {
  return room.players.map((p) => ({
    id: p.id,
    name: p.name,
    isHost: p.isHost,
    score: p.score,
    connected: p.connected,
    answerLocked: p.answerLocked,
    voteLocked: p.voteLocked,
  }));
}

// ─── Role Assignment ──────────────────────────────────────────
function assignRoles(room) {
  const playerIds = room.players.map((p) => p.id);

  if (room.gameMode === "CATEGORY_IMPOSTER") {
    room.storytellerId = null;
    const eligible = playerIds;
    room.imposterId = eligible[Math.floor(Math.random() * eligible.length)];
    return;
  }

  // Rotate storyteller for Social Deduction mode
  if (room.storytellerOrder.length === 0) {
    room.storytellerOrder = [...playerIds].sort(() => Math.random() - 0.5);
  }

  const stIdx = (room.roundNumber - 1) % room.storytellerOrder.length;
  room.storytellerId = room.storytellerOrder[stIdx];

  // If storyteller left, pick next
  if (!room.players.find((p) => p.id === room.storytellerId)) {
    room.storytellerId = room.players[0].id;
  }

  // Pick imposter from non-storyteller players
  const eligible = playerIds.filter((id) => id !== room.storytellerId);
  room.imposterId = eligible[Math.floor(Math.random() * eligible.length)];
}

// ─── Start a new round ────────────────────────────────────────
function startRound(room) {
  room.roundNumber += 1;
  room.commonWord = null;
  room.imposterWord = null;
  room.chatMessages = [];

  // Reset player state
  room.players.forEach((p) => {
    p.selectedCard = null;
    p.answerLocked = false;
    p.votedFor = null;
    p.voteLocked = false;
    p.wordCards = [];
  });

  assignRoles(room);

  if (room.gameMode === "CATEGORY_IMPOSTER") {
    // Pick category and words
    const picked = pickCategoryWords(room.selectedCategory);
    room.categoryName = picked.categoryName;
    room.commonWord = picked.mainWord;
    room.imposterWord = picked.imposterWord;

    if (room.skipTyping) {
      room.gameState = GameState.DISCUSSION;
      room.phaseEndsAt = Date.now() + 120000;
    } else {
      room.gameState = GameState.SECRET_WORD;
    }
    return;
  }

  // Assign 12 unique words to every player in Social Deduction mode
  const playerIds = room.players.map((p) => p.id);
  const assignments = assignWordsToPlayers(playerIds);
  for (const [pid, words] of assignments.entries()) {
    const player = room.players.find((p) => p.id === pid);
    if (player) player.wordCards = words;
  }

  room.gameState = GameState.STORYTELLER_PICK;
}

// ─── Storyteller picks 2 words from their 12 cards ────────────
function storytellerSelectWords(room, commonWord, imposterWord) {
  const storyteller = room.players.find((p) => p.id === room.storytellerId);
  if (!storyteller) return false;

  // Validate both words are in the storyteller's 12 cards
  if (!storyteller.wordCards.includes(commonWord)) return false;
  if (!storyteller.wordCards.includes(imposterWord)) return false;
  if (commonWord === imposterWord) return false;

  room.commonWord = commonWord;
  room.imposterWord = imposterWord;
  room.gameState = GameState.CARD_SELECTION;
  return true;
}

// ─── Card selection ───────────────────────────────────────────
function selectCard(room, playerId, card) {
  const player = room.players.find((p) => p.id === playerId);
  if (!player || player.answerLocked) return false;
  if (playerId === room.storytellerId) return false;

  // Validate card is in the player's hand
  if (!player.wordCards.includes(card)) return false;

  player.selectedCard = card;
  return true;
}

function lockAnswer(room, playerId) {
  const player = room.players.find((p) => p.id === playerId);
  if (!player || !player.selectedCard || player.answerLocked) return false;
  if (playerId === room.storytellerId) return false;

  player.answerLocked = true;

  // Check if all non-storyteller players have locked
  const allLocked = room.players
    .filter((p) => p.id !== room.storytellerId)
    .every((p) => p.answerLocked);

  if (allLocked) {
    room.gameState = GameState.REVEAL;
  }
  return allLocked;
}

// ─── Reveal → Discussion transition ──────────────────────────
function startDiscussion(room) {
  room.gameState = GameState.DISCUSSION;
  room.phaseEndsAt = Date.now() + 90000; // 90 seconds
}

// ─── Voting ───────────────────────────────────────────────────
function startVoting(room) {
  room.gameState = GameState.VOTING;
  room.phaseEndsAt = Date.now() + 60000; // 60 seconds
}

function castVote(room, voterId, targetId) {
  const voter = room.players.find((p) => p.id === voterId);
  if (!voter || voter.voteLocked) return { ok: false, reason: "Already voted" };
  if (room.storytellerId && voterId === room.storytellerId) return { ok: false, reason: "Storyteller cannot vote" };
  if (voterId === targetId) return { ok: false, reason: "Cannot vote for yourself" };
  if (!room.players.find((p) => p.id === targetId)) return { ok: false, reason: "Invalid target" };

  voter.votedFor = targetId;
  voter.voteLocked = true;

  const eligibleVoters = room.players.filter(
    (p) => p.id !== room.storytellerId
  );
  const allVoted = eligibleVoters.every((p) => p.voteLocked);

  return { ok: true, allVoted };
}

// ─── Tally votes & compute results ───────────────────────────
function tallyVotes(room) {
  const voteCounts = {};
  room.players.forEach((p) => (voteCounts[p.id] = 0));

  const voters = room.players.filter((p) => p.id !== room.storytellerId);
  voters.forEach((p) => {
    if (p.votedFor) voteCounts[p.votedFor] = (voteCounts[p.votedFor] || 0) + 1;
  });

  // Find the player with the most votes
  let maxVotes = 0;
  let maxIds = [];
  for (const [id, count] of Object.entries(voteCounts)) {
    if (count > maxVotes) {
      maxVotes = count;
      maxIds = [id];
    } else if (count === maxVotes && count > 0) {
      maxIds.push(id);
    }
  }

  // Tie = imposter survives
  const imposterCaught = maxIds.length === 1 && maxIds[0] === room.imposterId;
  const imposterVotes = voteCounts[room.imposterId] || 0;
  const scoringSummary = [];

  if (room.gameMode === "CATEGORY_IMPOSTER") {
    const totalPlayers = room.players.length;

    if (imposterCaught) {
      voters.forEach((p) => {
        if (p.id !== room.imposterId) {
          p.score += 1;
          scoringSummary.push({
            playerId: p.id,
            playerName: p.name,
            points: 1,
            reason: "Caught Imposter (+1)",
          });
        }
      });
    } else {
      const imposter = room.players.find((p) => p.id === room.imposterId);
      const imposterPoints = Math.max(1, Math.floor(totalPlayers / 2));
      if (imposter) {
        imposter.score += imposterPoints;
        scoringSummary.push({
          playerId: imposter.id,
          playerName: imposter.name,
          points: imposterPoints,
          reason: `Imposter Survived (+${imposterPoints})`,
        });
      }
    }

    room.gameState = GameState.RESULTS;

    return {
      gameMode: room.gameMode,
      categoryName: room.categoryName,
      voteCounts,
      imposterCaught,
      imposterId: room.imposterId,
      imposterName: room.players.find((p) => p.id === room.imposterId)?.name,
      imposterVotes,
      scoringSummary,
      commonWord: room.commonWord,
      imposterWord: room.imposterWord,
      scores: room.players.map((p) => ({ id: p.id, name: p.name, score: p.score })),
      voteDetails: voters.map((p) => ({
        voterId: p.id,
        voterName: p.name,
        targetId: p.votedFor,
        targetName: room.players.find((pl) => pl.id === p.votedFor)?.name,
      })),
    };
  }

  // ── Difficulty & Close-Game Bonus Scoring for Social Deduction Mode ──
  let storytellerPoints = 0;
  let imposterPoints = 0;

  if (imposterCaught) {
    voters.forEach((p) => {
      if (p.votedFor === room.imposterId) {
        p.score += 3;
        scoringSummary.push({
          playerId: p.id,
          playerName: p.name,
          points: 3,
          reason: "Found Imposter (+3)",
        });
      }
    });
  } else {
    const imposter = room.players.find((p) => p.id === room.imposterId);
    const storyteller = room.players.find((p) => p.id === room.storytellerId);

    if (imposterVotes >= 2) {
      storytellerPoints = 5;
      imposterPoints = 5;
    } else if (imposterVotes === 1) {
      storytellerPoints = 3;
      imposterPoints = 4;
    } else {
      storytellerPoints = 2;
      imposterPoints = 4;
    }

    if (imposter) {
      imposter.score += imposterPoints;
      scoringSummary.push({
        playerId: imposter.id,
        playerName: imposter.name,
        points: imposterPoints,
        reason: `Imposter Survived (${imposterVotes} vote${imposterVotes === 1 ? '' : 's'}) (+${imposterPoints})`,
      });
    }

    if (storyteller) {
      storyteller.score += storytellerPoints;
      scoringSummary.push({
        playerId: storyteller.id,
        playerName: storyteller.name,
        points: storytellerPoints,
        reason: `Storyteller Close Game (${imposterVotes} vote${imposterVotes === 1 ? '' : 's'}) (+${storytellerPoints})`,
      });
    }
  }

  room.gameState = GameState.RESULTS;

  return {
    gameMode: room.gameMode,
    voteCounts,
    imposterCaught,
    imposterId: room.imposterId,
    imposterName: room.players.find((p) => p.id === room.imposterId)?.name,
    imposterVotes,
    storytellerPoints,
    imposterPoints,
    scoringSummary,
    commonWord: room.commonWord,
    imposterWord: room.imposterWord,
    scores: room.players.map((p) => ({ id: p.id, name: p.name, score: p.score })),
    voteDetails: voters.map((p) => ({
      voterId: p.id,
      voterName: p.name,
      targetId: p.votedFor,
      targetName: room.players.find((pl) => pl.id === p.votedFor)?.name,
    })),
  };
}

function showScoreboard(room) {
  room.gameState = GameState.SCOREBOARD;
}

function isGameFinished(room) {
  return room.roundNumber >= room.maxRounds;
}

function finishGame(room) {
  room.gameState = GameState.FINISHED;
}

function resetGame(room) {
  room.roundNumber = 0;
  room.gameState = GameState.LOBBY;
  room.storytellerId = null;
  room.imposterId = null;
  room.commonWord = null;
  room.imposterWord = null;
  room.storytellerOrder = [];
  room.chatMessages = [];
  room.players.forEach((p) => {
    p.score = 0;
    p.selectedCard = null;
    p.answerLocked = false;
    p.votedFor = null;
    p.voteLocked = false;
    p.wordCards = [];
  });
}

export {
  GameState,
  rooms,
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
};
