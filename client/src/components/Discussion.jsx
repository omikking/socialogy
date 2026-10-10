import { useState, useEffect, useRef } from 'react';
import PhaseHeader from './PhaseHeader';

export default function Discussion({
  roomState,
  playerId,
  isHost,
  isStoryteller,
  answers,
  commonWord,
  chatMessages,
  onSendChat,
  onSkipToVoting,
}) {
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(90);
  const chatEndRef = useRef(null);
  const displayedWord = commonWord || roomState?.commonWord;
  const isSkipTyping = Boolean(roomState?.skipTyping);

  // Countdown timer
  useEffect(() => {
    if (!roomState.phaseEndsAt) return;

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((roomState.phaseEndsAt - Date.now()) / 1000));
      setTimeLeft(remaining);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [roomState.phaseEndsAt]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendChat(message.trim());
    setMessage('');
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // If host enabled "Skip Typing (In-Person Discussion Mode)"
  if (isSkipTyping) {
    return (
      <div className="page">
        <div className="container animate-in" style={{ maxWidth: 560 }}>
          <PhaseHeader roomState={roomState} />

          <div className="glass-card-glow" style={{ padding: '2rem 1.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🗣️</div>
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0', color: '#fff', fontWeight: '800' }}>
              In-Person Discussion Mode
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 1.5rem 0' }}>
              Speak your clues out loud to each other in person! Discuss together and figure out who the Imposter is.
            </p>

            {/* Timer */}
            <div className="timer-display" style={{ margin: '1rem 0 1.5rem 0' }}>
              <div className={`timer-value ${timeLeft <= 15 ? 'warning' : ''}`}>
                {formatTime(timeLeft)}
              </div>
              <div className="timer-label">Discussion Time Remaining</div>
            </div>

            {/* Player Turn List */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '1rem',
              borderRadius: '1rem',
              textAlign: 'left',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                Player Order
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {roomState.players.map((p, idx) => (
                  <span key={p.id} className="badge" style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '0.6rem',
                    background: p.id === playerId ? 'var(--accent-rose, #f43f5e)' : 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '0.85rem'
                  }}>
                    {idx + 1}. {p.name} {p.id === playerId ? '(You)' : ''}
                  </span>
                ))}
              </div>
            </div>

            {isHost ? (
              <button
                className="btn btn-primary btn-lg"
                onClick={onSkipToVoting}
                style={{ width: '100%' }}
              >
                🗳️ Go to Voting Now
              </button>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                When finished talking, Host will initiate voting...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container animate-in" style={{ maxWidth: 560 }}>
        <PhaseHeader roomState={roomState} />

        {/* Timer */}
        <div className="timer-display">
          <div className={`timer-value ${timeLeft <= 15 ? 'warning' : ''}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="timer-label">Discussion Time</div>
        </div>

        {/* Normal Player's Word Reference */}
        {displayedWord && (
          <div className="glass-card" style={{ padding: '12px 16px', marginBottom: 12, textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Secret Word
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: 2 }}>
              {displayedWord}
            </div>
          </div>
        )}

        {/* Answers reference if available */}
        {answers && answers.length > 0 && (
          <div className="glass-card" style={{ padding: '16px', marginBottom: 16 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Player Answers
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {answers.map(a => (
                <span key={a.id} className="badge badge-purple" style={{ fontSize: '0.8rem' }}>
                  {a.name}: {a.selectedCard}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Chat */}
        <div className="glass-card chat-container">
          <div className="chat-messages">
            {chatMessages.length === 0 && (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.85rem', margin: 'auto' }}>
                {isStoryteller
                  ? 'You are the Storyteller — you cannot participate in the discussion.'
                  : 'Discuss who you think is the imposter!'}
              </p>
            )}
            {chatMessages.map(msg => (
              <div className="chat-msg" key={msg.id}>
                <span className="chat-msg-name">{msg.playerName}</span>
                <p className="chat-msg-text">{msg.message}</p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {!isStoryteller && (
            <form className="chat-input-row" onSubmit={handleSend}>
              <input
                className="chat-input"
                type="text"
                placeholder="Type your clue or message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={200}
              />
              <button className="chat-send" type="submit" disabled={!message.trim()}>
                Send
              </button>
            </form>
          )}
        </div>

        {/* Skip button (host only) */}
        {isHost && (
          <button
            className="btn btn-secondary"
            onClick={onSkipToVoting}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            Skip to Voting →
          </button>
        )}
      </div>
    </div>
  );
}
