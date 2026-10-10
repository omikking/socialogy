import { useState } from 'react';
import PhaseHeader from './PhaseHeader';

export default function CategoryWordReveal({ roomState, secretWord, isHost, onStartDiscussion }) {
  const [revealed, setRevealed] = useState(false);
  const categoryName = roomState.categoryName || roomState.selectedCategory || 'General';

  return (
    <div className="page">
      <div className="container animate-in">
        <PhaseHeader roomState={roomState} />

        <div className="glass-card-glow secret-word-display" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
          <div style={{
            fontSize: '0.9rem',
            color: 'var(--accent-rose, #f43f5e)',
            fontWeight: 'bold',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem'
          }}>
            Category
          </div>
          <h2 style={{ fontSize: '2rem', margin: '0 0 1.5rem 0', color: '#fff', fontWeight: '800' }}>
            🏷️ {categoryName}
          </h2>

          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '1.5rem',
            borderRadius: '1.25rem',
            border: '1px dashed rgba(255, 255, 255, 0.2)',
            marginBottom: '1.5rem',
            position: 'relative'
          }}>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem' }}>
              Your Secret Word
            </div>

            {revealed ? (
              <div className="animate-in" style={{
                fontSize: '2.2rem',
                fontWeight: '900',
                color: 'var(--accent-cyan, #06b6d4)',
                letterSpacing: '0.05em',
                margin: '0.5rem 0'
              }}>
                {secretWord || 'Loading...'}
              </div>
            ) : (
              <div style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: 'rgba(255, 255, 255, 0.3)',
                letterSpacing: '0.2em',
                margin: '0.5rem 0'
              }}>
                ••••••••••
              </div>
            )}

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setRevealed(!revealed)}
              style={{
                marginTop: '0.75rem',
                padding: '0.4rem 1rem',
                fontSize: '0.85rem',
                borderRadius: '0.75rem'
              }}
            >
              {revealed ? '🙈 Hide Word' : '👁️ Reveal Word'}
            </button>
          </div>

          <div style={{
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.75)',
            lineHeight: 1.5,
            maxWidth: '400px',
            margin: '0 auto 1.5rem auto'
          }}>
            💡 {roomState.skipTyping
              ? "In-person discussion mode: Everyone will take turns saying a hint out loud!"
              : "Give a subtle clue about your word without giving it completely away to the Imposter!"}
          </div>

          {isHost && (
            <button
              className="btn btn-primary btn-lg"
              onClick={onStartDiscussion}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              💬 Start Discussion Phase
            </button>
          )}

          {!isHost && (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Waiting for host to begin discussion...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
