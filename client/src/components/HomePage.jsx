import { useState } from 'react';

export default function HomePage({ onCreateGame, onJoinGame }) {
  const [selectedMode, setSelectedMode] = useState('SOCIAL_DEDUCTION');

  return (
    <div className="page">
      <div className="container animate-in">
        <div className="home-logo-wrapper">
          <div className="home-logo">🎭</div>
        </div>
        <h1 className="home-title">Social Deduction Hub</h1>
        <p className="home-subtitle">
          Choose a game mode below to play with your friends using room code!
        </p>

        {/* Game Mode Selection Buttons */}
        <div className="game-mode-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          margin: '1.5rem 0 2rem 0',
          width: '100%'
        }}>
          {/* Social Deduction Card */}
          <div
            className={`glass-card game-mode-card ${selectedMode === 'SOCIAL_DEDUCTION' ? 'active-mode' : ''}`}
            onClick={() => setSelectedMode('SOCIAL_DEDUCTION')}
            style={{
              padding: '1.5rem',
              borderRadius: '1.25rem',
              border: selectedMode === 'SOCIAL_DEDUCTION'
                ? '2px solid var(--accent-cyan, #06b6d4)'
                : '1px solid rgba(255, 255, 255, 0.12)',
              background: selectedMode === 'SOCIAL_DEDUCTION'
                ? 'rgba(6, 182, 212, 0.12)'
                : 'rgba(255, 255, 255, 0.04)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.25s ease',
              position: 'relative'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🕵️</div>
            <h3 style={{ fontSize: '1.3rem', margin: '0 0 0.5rem 0', color: '#fff', fontWeight: '700' }}>
              Social Deduction
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', margin: 0, lineHeight: 1.4 }}>
              Classic Secret Word Imposter with 30 word cards, Storyteller picks, and clue submission.
            </p>
            {selectedMode === 'SOCIAL_DEDUCTION' && (
              <span className="badge" style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'var(--accent-cyan, #06b6d4)',
                color: '#000',
                fontWeight: 'bold',
                padding: '0.2rem 0.6rem',
                borderRadius: '1rem',
                fontSize: '0.75rem'
              }}>Selected</span>
            )}
          </div>

          {/* Category Imposter Card */}
          <div
            className={`glass-card game-mode-card ${selectedMode === 'CATEGORY_IMPOSTER' ? 'active-mode' : ''}`}
            onClick={() => setSelectedMode('CATEGORY_IMPOSTER')}
            style={{
              padding: '1.5rem',
              borderRadius: '1.25rem',
              border: selectedMode === 'CATEGORY_IMPOSTER'
                ? '2px solid var(--accent-rose, #f43f5e)'
                : '1px solid rgba(255, 255, 255, 0.12)',
              background: selectedMode === 'CATEGORY_IMPOSTER'
                ? 'rgba(244, 63, 94, 0.12)'
                : 'rgba(255, 255, 255, 0.04)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.25s ease',
              position: 'relative'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏷️</div>
            <h3 style={{ fontSize: '1.3rem', margin: '0 0 0.5rem 0', color: '#fff', fontWeight: '700' }}>
              Category Imposter
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', margin: 0, lineHeight: 1.4 }}>
              Category word game! Everyone gets a secret category word, Imposter gets a different word. Includes in-person skip typing option.
            </p>
            {selectedMode === 'CATEGORY_IMPOSTER' && (
              <span className="badge" style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'var(--accent-rose, #f43f5e)',
                color: '#fff',
                fontWeight: 'bold',
                padding: '0.2rem 0.6rem',
                borderRadius: '1rem',
                fontSize: '0.75rem'
              }}>Selected</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="home-actions" style={{ marginTop: '1rem' }}>
          <button
            id="create-game-btn"
            className="btn btn-primary btn-lg"
            onClick={() => onCreateGame(selectedMode)}
          >
            ✦ Create {selectedMode === 'CATEGORY_IMPOSTER' ? 'Category Game' : 'Social Deduction'}
          </button>
          <button
            id="join-game-btn"
            className="btn btn-secondary btn-lg"
            onClick={() => onJoinGame(selectedMode)}
          >
            → Join Game with Code
          </button>
        </div>
      </div>
    </div>
  );
}
