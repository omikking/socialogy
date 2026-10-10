import { useState } from 'react';

export default function JoinGame({ onBack, onJoin, error }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim().length !== 6 || name.trim().length < 2) return;
    onJoin(code.trim().toUpperCase(), name.trim());
  };

  return (
    <div className="page">
      <div className="container animate-in">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <div className="glass-card form-card">
          <div className="form-header">
            <h2>Join Game</h2>
            <p>Enter the room code shared by your friend</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="join-code">Game Code</label>
              <input
                id="join-code"
                className="input"
                type="text"
                placeholder="e.g. K7P4QX"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={6}
                style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', letterSpacing: '0.15em', textAlign: 'center' }}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="join-name">Your Name</label>
              <input
                id="join-name"
                className="input"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
              />
            </div>
            {error && <p style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', marginBottom: 16 }}>{error}</p>}
            <button
              id="join-room-btn"
              className="btn btn-primary btn-lg"
              type="submit"
              disabled={code.trim().length !== 6 || name.trim().length < 2}
              style={{ width: '100%' }}
            >
              Join Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
