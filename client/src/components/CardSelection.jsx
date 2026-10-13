import { useState } from 'react';

export default function CardSelection({
  roomState,
  secretWord,
  wordCards = [],
  selectedCard,
  answerLocked,
  isHost,
  onSelectCard,
  onLockAnswer,
  onRequestCards,
  onForceNextPhase,
  onKickPlayer,
}) {
  const [showKickModal, setShowKickModal] = useState(false);
  const storyteller = roomState?.players?.find((p) => p.id === roomState.storytellerId);

  return (
    <div className="game-screen-wrapper">
      <div className="game-screen-content animate-in">
        {/* Compact Header Bar */}
        <div className="compact-top-bar">
          <div className="compact-badges">
            <span className="badge badge-purple" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
              Round {roomState?.roundNumber || 1}/{roomState?.maxRounds || 5}
            </span>
            {storyteller && (
              <span className="badge badge-cyan" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
                🎭 {storyteller.name}
              </span>
            )}
          </div>

          {/* Prominent Glowing Secret Word Banner */}
          <div className="compact-secret-pill">
            <span className="compact-secret-tag">YOUR SECRET WORD:</span>
            <span className="compact-secret-word">{secretWord || '...'}</span>
          </div>

          {/* Host Controls Quick Toggle */}
          {isHost && (
            <div className="compact-host-controls">
              <button
                className="btn btn-sm btn-outline"
                style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px' }}
                onClick={() => setShowKickModal(!showKickModal)}
                title="Kick inactive player"
              >
                🔴 Kick
              </button>
              <button
                className="btn btn-sm btn-primary"
                style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--accent-rose)' }}
                onClick={onForceNextPhase}
                title="Force skip to next phase"
              >
                ⚡ Force Next
              </button>
            </div>
          )}
        </div>

        {/* Kick Modal dropdown if opened */}
        {isHost && showKickModal && (
          <div className="glass-card" style={{ padding: '8px 12px', margin: '4px 0', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Kick Inactive Player: </span>
            {roomState?.players?.filter((p) => p.id !== roomState.hostId).map((p) => (
              <button
                key={p.id}
                className="btn btn-sm"
                style={{ background: 'var(--accent-rose)', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', margin: '2px' }}
                onClick={() => {
                  onKickPlayer(p.id);
                  setShowKickModal(false);
                }}
              >
                {p.name} ✕
              </button>
            ))}
          </div>
        )}

        {/* Ultra-slim Instruction bar */}
        <div className="compact-instruction-bar">
          <span className="instruction-text">
            Pick 1 card relating to <strong>&ldquo;{secretWord}&rdquo;</strong> ({wordCards.length}/30 cards):
          </span>
          {wordCards.length < 30 && onRequestCards && (
            <button
              className="btn btn-sm btn-secondary"
              onClick={onRequestCards}
              style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '1rem', marginLeft: '6px' }}
            >
              🔄 Refresh 30 Cards
            </button>
          )}
        </div>

        {/* 30 Cards Grid (6x5 on desktop, 5x6 on mobile - all 30 visible at once) */}
        {(!wordCards || wordCards.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div className="waiting-spinner" style={{ margin: '0 auto 8px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Loading your 30 cards...</p>
            {onRequestCards && (
              <button className="btn btn-sm btn-secondary" onClick={onRequestCards} style={{ marginTop: 8 }}>
                🔄 Load Cards
              </button>
            )}
          </div>
        ) : (
          <div className="grid-30-cards">
            {wordCards.slice(0, 30).map((card, idx) => (
              <button
                key={`${card}-${idx}`}
                type="button"
                className={`grid-word-card ${selectedCard === card ? 'selected' : ''} ${answerLocked ? 'card-locked' : ''}`}
                onClick={() => !answerLocked && onSelectCard(card)}
                disabled={answerLocked}
                title={card}
              >
                {card}
              </button>
            ))}
          </div>
        )}

        {/* Lock Answer Action Bar right below grid */}
        <div className="compact-action-bar">
          {answerLocked ? (
            <div className="locked-status-pill">
              <span className="badge badge-emerald" style={{ fontSize: '0.82rem', padding: '6px 16px' }}>
                ✓ Locked: <strong>{selectedCard}</strong>
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginLeft: '10px' }}>
                Waiting for other players to lock in...
              </span>
            </div>
          ) : (
            <button
              id="lock-answer-btn"
              className={`btn btn-primary compact-lock-btn ${selectedCard ? 'pulse-glow' : ''}`}
              onClick={onLockAnswer}
              disabled={!selectedCard}
            >
              {selectedCard ? `🔒 Lock Answer: "${selectedCard}"` : 'Select a word from your 30 cards above'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
