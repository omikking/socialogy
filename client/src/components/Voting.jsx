import { useState, useEffect } from 'react';
import PhaseHeader from './PhaseHeader';

export default function Voting({
  roomState,
  playerId,
  isHost,
  isStoryteller,
  commonWord,
  votedFor,
  voteLocked,
  onVote,
  onForceNextPhase,
  onKickPlayer,
}) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedTarget, setSelectedTarget] = useState(votedFor || null);
  const [showKickModal, setShowKickModal] = useState(false);
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

  // Players who can be voted for (not storyteller, not self, not spectating)
  const votablePlayers = roomState.players.filter(
    (p) => p.id !== roomState.storytellerId && p.id !== playerId && !p.isSpectating
  );

  const totalVoters = roomState.players.filter(
    (p) => p.id !== roomState.storytellerId && !p.isSpectating
  ).length;

  const votedCount = roomState.players.filter(
    (p) => p.id !== roomState.storytellerId && p.voteLocked && !p.isSpectating
  ).length;

  const handleSubmitVote = () => {
    if (selectedTarget && !voteLocked) {
      onVote(selectedTarget);
    }
  };

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

        {/* Host Control Action Bar */}
        {isHost && (
          <div className="glass-card" style={{ padding: '12px 16px', marginBottom: 16, display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fde047' }}>👑 Host Controls:</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-sm btn-outline" style={{ fontSize: '0.8rem', padding: '4px 10px' }} onClick={() => setShowKickModal(!showKickModal)}>
                🔴 Kick Players
              </button>
              <button className="btn btn-sm btn-primary" style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'var(--accent-rose)' }} onClick={onForceNextPhase}>
                ⚡ Force Tally Votes Now
              </button>
            </div>
          </div>
        )}

        {/* Kick Modal */}
        {isHost && showKickModal && (
          <div className="glass-card" style={{ padding: '16px', marginBottom: 16, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
            <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: '0.9rem' }}>Select Inactive Player to Kick:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {roomState.players.filter(p => p.id !== playerId).map(p => (
                <button
                  key={p.id}
                  className="btn btn-sm"
                  style={{ background: 'var(--accent-rose)', color: '#fff', fontSize: '0.8rem' }}
                  onClick={() => {
                    onKickPlayer(p.id);
                    setShowKickModal(false);
                  }}
                >
                  Kick {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {isStoryteller ? (
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
        ) : (
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
            <div className="vote-progress" style={{ marginBottom: 16 }}>
              {votedCount} / {totalVoters} players have voted
            </div>

            <div className="vote-list stagger">
              {votablePlayers.map((p) => {
                const isSelected = selectedTarget === p.id;
                const isLocked = voteLocked && votedFor === p.id;
                return (
                  <div
                    key={p.id}
                    className={`vote-option ${isSelected || isLocked ? 'vote-selected' : ''} ${voteLocked ? 'vote-disabled' : ''}`}
                    onClick={() => !voteLocked && setSelectedTarget(p.id)}
                    style={{ cursor: voteLocked ? 'default' : 'pointer' }}
                  >
                    <div className="vote-radio" style={{
                      background: isSelected || isLocked ? 'var(--accent-rose)' : 'transparent',
                      borderColor: isSelected || isLocked ? 'var(--accent-rose)' : 'var(--text-muted)'
                    }} />
                    <span className="vote-name">{p.name}</span>
                    {isSelected && !voteLocked && (
                      <span className="badge badge-rose" style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>Selected</span>
                    )}
                  </div>
                );
              })}
            </div>

            {!voteLocked ? (
              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleSubmitVote}
                  disabled={!selectedTarget}
                  style={{ width: '100%', background: selectedTarget ? 'linear-gradient(135deg, #f43f5e, #e11d48)' : undefined }}
                >
                  Submit Vote
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <span className="badge badge-emerald" style={{ fontSize: '0.85rem', padding: '8px 20px' }}>
                  ✓ Vote Locked & Submitted
                </span>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 8 }}>
                  Waiting for other players to submit their votes...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
