import { useState } from 'react';

export default function CreateGame({ onBack, onCreate, error, gameMode = 'CATEGORY_IMPOSTER' }) {
  const [name, setName] = useState('');
  const [mode, setMode] = useState(gameMode);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) return;
    onCreate(name.trim(), mode);
  };

  return (
    <div className="page">
      <div className="container animate-in">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <div className="glass-card form-card">
          <div className="form-header">
            <h2>Create Game</h2>
            <p>Start a new room and invite your friends</p>
          </div>

          {/* Game Mode Selector */}
          <div className="mode-selector-tabs" style={{
            display: 'flex',
            gap: '0.5rem',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '0.35rem',
            borderRadius: '0.75rem',
            marginBottom: '1.25rem'
          }}>
            <button
              type="button"
              className={`mode-tab ${mode === 'CATEGORY_IMPOSTER' ? 'active' : ''}`}
              onClick={() => setMode('CATEGORY_IMPOSTER')}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: mode === 'CATEGORY_IMPOSTER' ? 'var(--accent-rose, #f43f5e)' : 'transparent',
                color: '#fff',
                fontWeight: mode === 'CATEGORY_IMPOSTER' ? 'bold' : 'normal',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              🏷️ Category Imposter
            </button>
            <button
              type="button"
              className={`mode-tab ${mode === 'SOCIAL_DEDUCTION' ? 'active' : ''}`}
              onClick={() => setMode('SOCIAL_DEDUCTION')}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: mode === 'SOCIAL_DEDUCTION' ? 'var(--accent-cyan, #06b6d4)' : 'transparent',
                color: mode === 'SOCIAL_DEDUCTION' ? '#000' : '#fff',
                fontWeight: mode === 'SOCIAL_DEDUCTION' ? 'bold' : 'normal',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              🕵️ Social Deduction
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="create-name">Your Name</label>
              <input
                id="create-name"
                className="input"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                autoFocus
              />
            </div>
            {error && <p style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', marginBottom: 16 }}>{error}</p>}
            <button
              id="create-room-btn"
              className="btn btn-primary btn-lg"
              type="submit"
              disabled={name.trim().length < 2}
              style={{ width: '100%' }}
            >
              Create {mode === 'CATEGORY_IMPOSTER' ? 'Category Game' : 'Social Deduction Room'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
