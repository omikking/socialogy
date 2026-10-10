import PhaseHeader from './PhaseHeader';

export default function AnswerReveal({ roomState, answers, commonWord, isHost, onStartDiscussion }) {
  const displayedWord = commonWord || roomState?.commonWord;

  return (
    <div className="page">
      <div className="container animate-in">
        <PhaseHeader roomState={roomState} />

        {/* Revealed Normal Player Word */}
        {displayedWord && (
          <div className="glass-card-glow secret-word-display" style={{ marginBottom: 20 }}>
            <div className="secret-word-label">Word Given to Normal Players</div>
            <div className="secret-word" style={{ color: 'var(--accent-cyan)' }}>
              {displayedWord}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 8 }}>
              Everyone except the Imposter was trying to relate to this word!
            </p>
          </div>
        )}

        <div className="glass-card" style={{ padding: '24px 20px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: 20, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Everyone's chosen words:
          </h3>

          <div className="answers-list stagger">
            {answers.map((a, i) => (
              <div className="answer-item" key={a.id} style={{ animationDelay: `${i * 100}ms` }}>
                <span className="answer-player">{a.name}</span>
                <span className="answer-word">{a.selectedCard}</span>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 16 }}>
            Look carefully — which word seems out of place?
          </p>

          {isHost && (
            <button
              id="start-discussion-btn"
              className="btn btn-primary"
              onClick={onStartDiscussion}
              style={{ width: '100%' }}
            >
              💬 Start Discussion
            </button>
          )}
          {!isHost && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Waiting for host to start discussion...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
