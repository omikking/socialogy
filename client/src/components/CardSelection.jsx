import PhaseHeader from './PhaseHeader';

export default function CardSelection({
  roomState,
  secretWord,
  wordCards = [],
  selectedCard,
  answerLocked,
  onSelectCard,
  onLockAnswer,
  onRequestCards,
}) {
  return (
    <div className="page">
      <div className="container animate-in" style={{ maxWidth: 560 }}>
        <PhaseHeader roomState={roomState} />

        {/* Secret word display */}
        <div className="glass-card-glow secret-word-display">
          <div className="secret-word-label">Your Secret Word</div>
          <div className="secret-word">{secretWord}</div>
        </div>

        {/* Word cards grid */}
        <div style={{ marginBottom: 12 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', marginBottom: 16 }}>
            Choose a word that relates to your secret word
          </p>
        </div>

        {(!wordCards || wordCards.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '36px 16px' }}>
            <div className="waiting-spinner" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Loading your 12 word cards...
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
          <div className="word-cards-grid stagger">
            {wordCards.map((card, i) => (
              <div
                key={card}
                className={`word-card ${selectedCard === card ? 'selected' : ''} ${answerLocked ? 'word-card-locked' : ''}`}
                onClick={() => !answerLocked && onSelectCard(card)}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {card}
              </div>
            ))}
          </div>
        )}

        {/* Lock button */}
        <div className="lock-answer-section">
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
