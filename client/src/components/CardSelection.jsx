import { useState } from 'react';
import PhaseHeader from './PhaseHeader';

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

  return (
    <div className="page">
      <div className="container-wide animate-in" style={{ maxWidth: 720 }}>
        <PhaseHeader roomState={roomState} />

        {/* Host Control Action Bar */}
        {isHost && (
          <div className="glass-card" style={{ padding: '12px 16px', marginBottom: 16, display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fde047' }}>👑 Host Controls:</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-sm btn-outline" style={{ fontSize: '0.8rem', padding: '4px 10px' }} onClick={() => setShowKickModal(!showKickModal)}>
                🔴 Kick Players
              </button>
              <button className="btn btn-sm btn-primary" style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'var(--accent-rose)' }} onClick={onForceNextPhase}>
                ⚡ Force Next Phase
              </button>
            </div>
          </div>
        )}

        {/* Kick Modal */}
        {isHost && showKickModal && (
          <div className="glass-card" style={{ padding: '16px', marginBottom: 16, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
            <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: '0.9rem' }}>Select Inactive Player to Kick:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {roomState.players.filter(p => p.id !== roomState.hostId).map(p => (
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

        {/* Secret word display */}
        <div className="glass-card-glow secret-word-display" style={{ marginBottom: 16 }}>
          <div className="secret-word-label">Your Secret Word</div>
          <div className="secret-word">{secretWord}</div>
        </div>

        {/* Word cards grid instruction */}
        <div style={{ marginBottom: 12 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', margin: 0 }}>
            Pick a word from your 30-word grid that relates to your secret word:
          </p>
        </div>

        {(!wordCards || wordCards.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '36px 16px' }}>
            <div className="waiting-spinner" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Loading your 30 word cards...
            </p>
            {onRequestCards && (
              <button
                className="btn btn-secondary"
                onClick={onRequestCards}
                style={{ marginTop: 16 }}
              >
                🔄 Load Word Cards
              </button>
            )}
          </div>
        ) : (
          <div className="word-cards-grid">
            {wordCards.map((card) => (
              <div
                key={card}
                className={`word-card ${selectedCard === card ? 'selected' : ''} ${answerLocked ? 'word-card-locked' : ''}`}
                onClick={() => !answerLocked && onSelectCard(card)}
              >
                {card}
              </div>
            ))}
          </div>
        )}

        {/* Lock button */}
        <div className="lock-answer-section" style={{ marginTop: 16 }}>
          {answerLocked ? (
            <div style={{ textAlign: 'center' }}>
              <span className="badge badge-emerald" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>
                ✓ Answer Locked
              </span>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 8 }}>
                Waiting for other players...
              </p>
            </div>
          ) : (
            <button
              id="lock-answer-btn"
              className="btn btn-primary"
              onClick={onLockAnswer}
              disabled={!selectedCard}
              style={{ width: '100%' }}
            >
              🔒 Lock Answer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
