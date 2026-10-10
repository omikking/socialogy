import { useState, useEffect } from 'react';
import PhaseHeader from './PhaseHeader';

export default function Voting({
  roomState,
  playerId,
  isStoryteller,
  commonWord,
  votedFor,
  voteLocked,
  onVote,
}) {
  const [timeLeft, setTimeLeft] = useState(60);
  const displayedWord = commonWord || roomState?.commonWord;

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

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // Players who can be voted for (not storyteller, not self)
  const votablePlayers = roomState.players.filter(
    (p) => p.id !== roomState.storytellerId && p.id !== playerId
  );

  const totalVoters = roomState.players.filter(
    (p) => p.id !== roomState.storytellerId
  ).length;

  const votedCount = roomState.players.filter(
    (p) => p.id !== roomState.storytellerId && p.voteLocked
  ).length;

  if (isStoryteller) {
    return (
      <div className="page">
        <div className="container animate-in">
          <PhaseHeader roomState={roomState} />
          <div className="timer-display">
            <div className={`timer-value ${timeLeft <= 10 ? 'warning' : ''}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="timer-label">Voting Time</div>
          </div>
          <div className="glass-card" style={{ padding: '32px 20px', textAlign: 'center' }}>
            <span className="badge badge-purple" style={{ fontSize: '0.9rem', padding: '8px 20px', marginBottom: 16, display: 'inline-block' }}>
              🎭 Storyteller
            </span>
            <p style={{ color: 'var(--text-secondary)', marginTop: 12 }}>
              You do not vote. Watch the drama unfold...
            </p>
            <div className="vote-progress" style={{ marginTop: 20 }}>
              {votedCount} / {totalVoters} players have voted
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container animate-in">
        <PhaseHeader roomState={roomState} />

        <div className="timer-display">
          <div className={`timer-value ${timeLeft <= 10 ? 'warning' : ''}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="timer-label">Voting Time</div>
        </div>

        <div className="glass-card" style={{ padding: '24px 20px' }}>
          {displayedWord && (
            <div style={{ textAlign: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Normal Players' Word
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: 2 }}>
                {displayedWord}
              </div>
            </div>
          )}

          <h3 style={{ textAlign: 'center', marginBottom: 4, fontSize: '1.1rem' }}>
            Who is the Imposter?
          </h3>
          <div className="vote-progress">
            {votedCount} / {totalVoters} players have voted
          </div>

          <div className="vote-list stagger">
            {votablePlayers.map((p) => {
              const isSelected = votedFor === p.id;
              return (
                <div
                  key={p.id}
                  className={`vote-option ${isSelected ? 'vote-selected' : ''} ${voteLocked && !isSelected ? 'vote-disabled' : ''}`}
                  onClick={() => !voteLocked && onVote(p.id)}
                >
                  <div className="vote-radio" />
                  <span className="vote-name">{p.name}</span>
                </div>
              );
            })}
          </div>

          {voteLocked && (
            <div style={{ textAlign: 'center' }}>
              <span className="badge badge-emerald" style={{ fontSize: '0.85rem', padding: '8px 20px' }}>
                ✓ Vote Locked
              </span>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 8 }}>
                Waiting for other players...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
