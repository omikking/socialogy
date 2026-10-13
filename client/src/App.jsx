import { useState, useEffect, useCallback } from 'react';
import { socket } from './socket';

import HomePage from './components/HomePage';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import Lobby from './components/Lobby';
import StorytellerPick from './components/StorytellerPick';
import WaitingScreen from './components/WaitingScreen';
import CardSelection from './components/CardSelection';
import AnswerReveal from './components/AnswerReveal';
import CategoryWordReveal from './components/CategoryWordReveal';
import Discussion from './components/Discussion';
import Voting from './components/Voting';
import Results from './components/Results';
import Scoreboard from './components/Scoreboard';
import FinalResult from './components/FinalResult';
import PhaseHeader from './components/PhaseHeader';
import Navbar from './components/Navbar';
import HelpModal from './components/HelpModal';

function App() {
  // Navigation / view
  const [view, setView] = useState('home'); // home, create, join, game
  const [selectedMode, setSelectedMode] = useState('SOCIAL_DEDUCTION');
  const [showHelp, setShowHelp] = useState(false);

  // Player info
  const [playerId, setPlayerId] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  // Room state from server
  const [roomState, setRoomState] = useState(null);

  // Player-specific secrets
  const [role, setRole] = useState(null);
  const [secretWord, setSecretWord] = useState(null);
  const [commonWord, setCommonWord] = useState(null);
  const [imposterWord, setImposterWord] = useState(null);

  // Word cards
  const [wordCards, setWordCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [answerLocked, setAnswerLocked] = useState(false);
  const [isWaitingForStoryteller, setIsWaitingForStoryteller] = useState(false);

  // Answers
  const [revealedAnswers, setRevealedAnswers] = useState([]);

  // Chat
  const [chatMessages, setChatMessages] = useState([]);

  // Voting
  const [votedFor, setVotedFor] = useState(null);
  const [voteLocked, setVoteLocked] = useState(false);

  // Results
  const [roundResult, setRoundResult] = useState(null);

  // Scores
  const [scores, setScores] = useState([]);

  // Final
  const [finalScores, setFinalScores] = useState([]);

  // Error
  const [error, setError] = useState('');

  // Save session when in game
  useEffect(() => {
    if (playerId && roomCode) {
      localStorage.setItem('socialogy_session', JSON.stringify({ playerId, roomCode, playerName }));
    }
  }, [playerId, roomCode, playerName]);

  // Connect socket and try auto-rejoining on mount
  useEffect(() => {
    socket.connect();

    const saved = localStorage.getItem('socialogy_session');
    if (saved) {
      try {
        const { playerId: savedId, roomCode: savedCode, playerName: savedName } = JSON.parse(saved);
        if (savedId && savedCode) {
          socket.emit('REJOIN_ROOM', { roomCode: savedCode, playerId: savedId, playerName: savedName }, (res) => {
            if (res && res.ok) {
              setPlayerId(res.playerId);
              setRoomCode(res.roomCode);
              if (res.playerName) setPlayerName(res.playerName);
              setView('game');
            } else {
              localStorage.removeItem('socialogy_session');
            }
          });
        }
      } catch (e) {
        localStorage.removeItem('socialogy_session');
      }
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  // Socket event listeners
  useEffect(() => {
    function onRoomState(state) {
      setRoomState(state);
      if (state.commonWord) {
        setCommonWord(state.commonWord);
      }
    }

    function onRoleAssigned(data) {
      setRole(data.role);
      if (data.role === 'STORYTELLER') {
        setCommonWord(data.commonWord || null);
        setImposterWord(data.imposterWord || null);
        setSecretWord(null);
        setIsWaitingForStoryteller(false);
        if (data.wordCards) {
          setWordCards(data.wordCards);
        }
      } else {
        setSecretWord(data.secretWord);
        setCommonWord(null);
        setImposterWord(null);
        if (data.wordCards && data.wordCards.length > 0) {
          setWordCards(data.wordCards);
        }
      }
    }

    function onWaitingForStoryteller() {
      setIsWaitingForStoryteller(true);
      setRole('PLAYER');
    }

    function onWordCards(data) {
      setWordCards(data.cards);
      setSelectedCard(null);
      setAnswerLocked(false);
      setIsWaitingForStoryteller(false);
    }

    function onAnswersRevealed(data) {
      setRevealedAnswers(data.answers);
      if (data.commonWord) {
        setCommonWord(data.commonWord);
      }
    }

    function onChatMessage(msg) {
      setChatMessages((prev) => [...prev, msg]);
    }

    function onVotingStarted() {
      setVotedFor(null);
      setVoteLocked(false);
    }

    function onVoteError(data) {
      setError(data.error);
      setTimeout(() => setError(''), 3000);
    }

    function onRoundResult(data) {
      setRoundResult(data);
    }

    function onScoreUpdate(data) {
      setScores(data.scores);
    }

    function onGameFinished(data) {
      setFinalScores(data.scores);
    }

    function onKicked() {
      localStorage.removeItem('socialogy_session');
      setView('home');
      setRoomState(null);
      setPlayerId(null);
      setRoomCode('');
      setError('You were removed from the game.');
      setTimeout(() => setError(''), 3000);
    }

    socket.on('ROOM_STATE', onRoomState);
    socket.on('ROLE_ASSIGNED', onRoleAssigned);
    socket.on('WAITING_FOR_STORYTELLER', onWaitingForStoryteller);
    socket.on('WORD_CARDS', onWordCards);
    socket.on('ANSWERS_REVEALED', onAnswersRevealed);
    socket.on('CHAT_MESSAGE', onChatMessage);
    socket.on('VOTING_STARTED', onVotingStarted);
    socket.on('VOTE_ERROR', onVoteError);
    socket.on('ROUND_RESULT', onRoundResult);
    socket.on('SCORE_UPDATE', onScoreUpdate);
    socket.on('GAME_FINISHED', onGameFinished);
    socket.on('KICKED', onKicked);

    return () => {
      socket.off('ROOM_STATE', onRoomState);
      socket.off('ROLE_ASSIGNED', onRoleAssigned);
      socket.off('WAITING_FOR_STORYTELLER', onWaitingForStoryteller);
      socket.off('WORD_CARDS', onWordCards);
      socket.off('ANSWERS_REVEALED', onAnswersRevealed);
      socket.off('CHAT_MESSAGE', onChatMessage);
      socket.off('VOTING_STARTED', onVotingStarted);
      socket.off('VOTE_ERROR', onVoteError);
      socket.off('ROUND_RESULT', onRoundResult);
      socket.off('SCORE_UPDATE', onScoreUpdate);
      socket.off('GAME_FINISHED', onGameFinished);
      socket.off('KICKED', onKicked);
    };
  }, []);

  // ─── Handlers ───────────────────────────────────
  const handleCreateRoom = useCallback((name, mode) => {
    setPlayerName(name);
    const gameMode = mode || selectedMode;
    socket.emit('CREATE_ROOM', { playerName: name, gameMode }, (res) => {
      if (res.ok) {
        setPlayerId(res.playerId);
        setRoomCode(res.roomCode);
        setView('game');
      } else {
        setError(res.error || 'Failed to create room');
      }
    });
  }, [selectedMode]);

  const handleJoinRoom = useCallback((code, name) => {
    setPlayerName(name);
    socket.emit('JOIN_ROOM', { roomCode: code, playerName: name }, (res) => {
      if (res.ok) {
        setPlayerId(res.playerId);
        setRoomCode(res.roomCode);
        setView('game');
      } else {
        setError(res.error || 'Failed to join room');
      }
    });
  }, []);

  const handleStartGame = useCallback(() => {
    socket.emit('START_GAME', { roomCode });
    setChatMessages([]);
    setRoundResult(null);
    setRevealedAnswers([]);
  }, [roomCode]);

  const handleUpdateSettings = useCallback((settings) => {
    socket.emit('UPDATE_SETTINGS', { roomCode, ...settings });
  }, [roomCode]);

  const handleStorytellerSelect = useCallback((cw, iw) => {
    socket.emit('STORYTELLER_SELECT', {
      roomCode,
      commonWord: cw,
      imposterWord: iw,
    });
  }, [roomCode]);

  const handleSelectCard = useCallback((card) => {
    setSelectedCard(card);
    socket.emit('SELECT_CARD', { roomCode, card });
  }, [roomCode]);

  const handleLockAnswer = useCallback(() => {
    setAnswerLocked(true);
    socket.emit('LOCK_ANSWER', { roomCode });
  }, [roomCode]);

  const handleStartDiscussion = useCallback(() => {
    socket.emit('START_DISCUSSION', { roomCode });
    setChatMessages([]);
  }, [roomCode]);

  const handleSkipToVoting = useCallback(() => {
    socket.emit('SKIP_TO_VOTING', { roomCode });
  }, [roomCode]);

  const handleForceNextPhase = useCallback(() => {
    socket.emit('FORCE_NEXT_PHASE', { roomCode });
  }, [roomCode]);

  const handleSendChat = useCallback((message) => {
    socket.emit('CHAT_MESSAGE', { roomCode, message });
  }, [roomCode]);

  const handleCastVote = useCallback((targetId) => {
    setVotedFor(targetId);
    setVoteLocked(true);
    socket.emit('CAST_VOTE', { roomCode, targetId });
  }, [roomCode]);

  const handleShowScoreboard = useCallback(() => {
    socket.emit('SHOW_SCOREBOARD', { roomCode });
  }, [roomCode]);

  const handleNextRound = useCallback(() => {
    setChatMessages([]);
    setRoundResult(null);
    setRevealedAnswers([]);
    setSelectedCard(null);
    setAnswerLocked(false);
    setVotedFor(null);
    setVoteLocked(false);
    setWordCards([]);
    setRole(null);
    setSecretWord(null);
    setCommonWord(null);
    setImposterWord(null);
    socket.emit('NEXT_ROUND', { roomCode });
  }, [roomCode]);

  const handlePlayAgain = useCallback(() => {
    setFinalScores([]);
    setScores([]);
    setChatMessages([]);
    setRoundResult(null);
    setRevealedAnswers([]);
    setSelectedCard(null);
    setAnswerLocked(false);
    setVotedFor(null);
    setVoteLocked(false);
    setWordCards([]);
    setRole(null);
    setSecretWord(null);
    setCommonWord(null);
    setImposterWord(null);
    socket.emit('PLAY_AGAIN', { roomCode });
  }, [roomCode]);

  const handleKickPlayer = useCallback((targetId) => {
    socket.emit('KICK_PLAYER', { roomCode, targetId });
  }, [roomCode]);

  const handleRequestCards = useCallback(() => {
    if (!roomCode) return;
    socket.emit('GET_MY_CARDS', { roomCode }, (res) => {
      if (res?.ok && res.wordCards?.length) {
        setWordCards(res.wordCards);
        if (res.secretWord) setSecretWord(res.secretWord);
        if (res.commonWord) setCommonWord(res.commonWord);
        if (res.imposterWord) setImposterWord(res.imposterWord);
      }
    });
  }, [roomCode]);

  const handleBack = useCallback(() => {
    setView('home');
    setError('');
  }, []);

  const handleGoHome = useCallback(() => {
    localStorage.removeItem('socialogy_session');
    setView('home');
    setRoomState(null);
    setPlayerId(null);
    setRoomCode('');
    setWordCards([]);
    setSelectedCard(null);
    setAnswerLocked(false);
    setRole(null);
    setSecretWord(null);
    setCommonWord(null);
    setImposterWord(null);
    setRoundResult(null);
    setRevealedAnswers([]);
    setChatMessages([]);
    setScores([]);
    setFinalScores([]);
    setError('');
  }, []);

  // Auto-recover complete 30-card hand if fewer cards were received
  useEffect(() => {
    if (
      (roomState?.gameState === 'CARD_SELECTION' || roomState?.gameState === 'STORYTELLER_PICK') &&
      roomState?.gameMode !== 'CATEGORY_IMPOSTER' &&
      wordCards.length > 0 &&
      wordCards.length < 30
    ) {
      handleRequestCards();
    }
  }, [roomState?.gameState, roomState?.gameMode, wordCards.length, handleRequestCards]);

  // ─── Render View Content ─────────────────────────
  const renderContent = () => {
    if (view === 'home') {
      return (
        <HomePage
          onCreateGame={(mode) => {
            setSelectedMode(mode);
            setView('create');
          }}
          onJoinGame={(mode) => {
            setSelectedMode(mode);
            setView('join');
          }}
        />
      );
    }

  if (view === 'create') {
    return (
      <CreateGame
        onBack={handleBack}
        onCreate={(name, mode) => handleCreateRoom(name, mode)}
        gameMode={selectedMode}
        error={error}
      />
    );
  }

  if (view === 'join') {
    return (
      <JoinGame
        onBack={handleBack}
        onJoin={handleJoinRoom}
        error={error}
      />
    );
  }

  // ─── In-Game View ───────────────────────────────
  if (!roomState) {
    return (
      <div className="page">
        <div className="waiting-screen">
          <div className="waiting-spinner" />
          <p className="waiting-text">Connecting to server...</p>
        </div>
      </div>
    );
  }

  const gameState = roomState.gameState;
  const isHost = roomState.hostId === playerId;
  const isStoryteller = roomState.storytellerId === playerId;
  const isCategoryMode = roomState.gameMode === 'CATEGORY_IMPOSTER';
  const me = roomState.players.find(p => p.id === playerId);
  const isSpectating = Boolean(me?.isSpectating);

  // LOBBY
  if (gameState === 'LOBBY') {
    return (
      <Lobby
        roomState={roomState}
        playerId={playerId}
        isHost={isHost}
        onStartGame={handleStartGame}
        onUpdateSettings={handleUpdateSettings}
        onKickPlayer={handleKickPlayer}
      />
    );
  }

  // Mid-game spectator banner view
  if (isSpectating) {
    return (
      <div className="page">
        <div className="container animate-in">
          <PhaseHeader roomState={roomState} />
          <div className="glass-card" style={{ padding: '32px 20px', textAlign: 'center' }}>
            <span className="badge badge-amber" style={{ fontSize: '0.9rem', padding: '8px 20px', marginBottom: 16, display: 'inline-block' }}>
              🍿 Spectating Current Round
            </span>
            <h3 style={{ marginTop: 12 }}>Game is currently in progress!</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
              You joined mid-game. You will automatically enter the match when the next round starts!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // CATEGORY SECRET WORD REVEAL (Category Imposter Mode)
  if (isCategoryMode && (gameState === 'SECRET_WORD' || gameState === 'ROLE_ASSIGNMENT')) {
    return (
      <CategoryWordReveal
        roomState={roomState}
        secretWord={secretWord}
        isHost={isHost}
        onStartDiscussion={handleStartDiscussion}
      />
    );
  }

  // STORYTELLER PICK (Social Deduction Mode)
  if (gameState === 'STORYTELLER_PICK') {
    if (isStoryteller) {
      return (
        <StorytellerPick
          roomState={roomState}
          wordCards={wordCards}
          isHost={isHost}
          onSelect={handleStorytellerSelect}
          onRequestCards={handleRequestCards}
          onForceNextPhase={handleForceNextPhase}
          onKickPlayer={handleKickPlayer}
        />
      );
    }
    return (
      <div className="page">
        <div className="container">
          <PhaseHeader roomState={roomState} />
          <WaitingScreen
            text={`${roomState.players.find(p => p.id === roomState.storytellerId)?.name || 'Storyteller'} is choosing the secret words...`}
          />
        </div>
      </div>
    );
  }

  // CARD SELECTION (Social Deduction Mode)
  if (gameState === 'CARD_SELECTION') {
    if (isStoryteller) {
      return (
        <div className="page">
          <div className="container" style={{ maxWidth: 640 }}>
            <PhaseHeader roomState={roomState} />
            <div className="glass-card-glow secret-word-display">
              <div className="secret-word-label">You are the Storyteller</div>
              <div className="storyteller-words">
                <div className="word-pair">
                  <span className="word-pair-label">Common:</span>
                  <span className="word-pair-value" style={{ color: 'var(--accent-cyan)' }}>{commonWord}</span>
                </div>
                <div className="word-pair">
                  <span className="word-pair-label">Imposter:</span>
                  <span className="word-pair-value" style={{ color: 'var(--accent-rose)' }}>{imposterWord}</span>
                </div>
              </div>
            </div>

            {/* Host Controls */}
            {isHost && (
              <div style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button className="btn btn-sm btn-primary" style={{ background: 'var(--accent-rose)' }} onClick={handleForceNextPhase}>
                  ⚡ Force Next Phase
                </button>
              </div>
            )}

            <WaitingScreen text="Waiting for players to choose their cards..." />
            <div className="answers-list stagger">
              {roomState.players
                .filter(p => p.id !== roomState.storytellerId && !p.isSpectating)
                .map(p => (
                  <div className="answer-item" key={p.id}>
                    <span className="answer-player">{p.name}</span>
                    <span className="answer-word">
                      {p.answerLocked ? '✓ Locked' : '⏳ Choosing...'}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      );
    }
    return (
      <CardSelection
        roomState={roomState}
        secretWord={secretWord}
        wordCards={wordCards}
        selectedCard={selectedCard}
        answerLocked={answerLocked}
        isHost={isHost}
        onSelectCard={handleSelectCard}
        onLockAnswer={handleLockAnswer}
        onRequestCards={handleRequestCards}
        onForceNextPhase={handleForceNextPhase}
        onKickPlayer={handleKickPlayer}
      />
    );
  }

  // REVEAL
  if (gameState === 'REVEAL') {
    return (
      <AnswerReveal
        roomState={roomState}
        answers={revealedAnswers}
        commonWord={commonWord || roomState.commonWord}
        isHost={isHost}
        onStartDiscussion={handleStartDiscussion}
      />
    );
  }

  // DISCUSSION
  if (gameState === 'DISCUSSION') {
    return (
      <Discussion
        roomState={roomState}
        playerId={playerId}
        isHost={isHost}
        isStoryteller={isStoryteller}
        answers={revealedAnswers}
        commonWord={commonWord || secretWord || roomState.commonWord}
        chatMessages={chatMessages}
        onSendChat={handleSendChat}
        onSkipToVoting={handleSkipToVoting}
      />
    );
  }

  // VOTING
  if (gameState === 'VOTING') {
    return (
      <Voting
        roomState={roomState}
        playerId={playerId}
        isHost={isHost}
        isStoryteller={isStoryteller}
        commonWord={commonWord || roomState.commonWord}
        votedFor={votedFor}
        voteLocked={voteLocked}
        onVote={handleCastVote}
        onForceNextPhase={handleForceNextPhase}
        onKickPlayer={handleKickPlayer}
      />
    );
  }

  // RESULTS
  if (gameState === 'RESULTS') {
    return (
      <Results
        roomState={roomState}
        roundResult={roundResult}
        isHost={isHost}
        onShowScoreboard={handleShowScoreboard}
      />
    );
  }

  // SCOREBOARD
  if (gameState === 'SCOREBOARD') {
    return (
      <Scoreboard
        roomState={roomState}
        scores={scores.length ? scores : roomState.players.map(p => ({ id: p.id, name: p.name, score: p.score }))}
        isHost={isHost}
        onNextRound={handleNextRound}
      />
    );
  }

  // FINISHED
  if (gameState === 'FINISHED') {
    return (
      <FinalResult
        scores={finalScores.length ? finalScores : roomState.players.map(p => ({ id: p.id, name: p.name, score: p.score })).sort((a, b) => b.score - a.score)}
        isHost={isHost}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

    return (
      <div className="page">
        <div className="container">
          <p>Unknown game state: {gameState}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="app-layout">
      <Navbar
        view={view}
        roomCode={roomCode}
        gameMode={roomState?.gameMode || selectedMode}
        onGoHome={handleGoHome}
        onOpenHelp={() => setShowHelp(true)}
      />
      {renderContent()}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        initialMode={roomState?.gameMode || selectedMode}
      />
    </div>
  );
}

export default App;
