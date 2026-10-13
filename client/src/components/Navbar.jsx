import { useState } from 'react';

export default function Navbar({
  view,
  roomCode,
  gameMode,
  onGoHome,
  onOpenHelp
}) {
  const [copied, setCopied] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);

  const handleCopyCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHomeClick = () => {
    if (view === 'game' || roomCode) {
      setShowConfirmLeave(true);
    } else {
      onGoHome();
    }
  };

  const confirmLeaveRoom = () => {
    setShowConfirmLeave(false);
    onGoHome();
  };

  return (
    <>
      <header
        className="app-navbar"
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          background: 'rgba(10, 10, 26, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '56px',
          boxSizing: 'border-box'
        }}
      >
        {/* Left: Brand & Room Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            onClick={handleHomeClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              userSelect: 'none'
            }}
            title="Go to Home"
          >
            <span style={{ fontSize: '1.35rem' }}>🎭</span>
            <span
              style={{
                fontFamily: 'var(--font-display, sans-serif)',
                fontWeight: '700',
                fontSize: '1.05rem',
                letterSpacing: '-0.01em',
                background: 'linear-gradient(135deg, #f0f0ff 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Socialogy
            </span>
          </div>

          {/* Active Room Code Badge */}
          {roomCode && (
            <div
              onClick={handleCopyCode}
              title="Click to copy room code"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '3px 8px',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.78rem',
                color: '#fff',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ color: 'var(--text-muted)' }}>Room:</span>
              <span style={{ color: 'var(--accent-cyan, #06b6d4)', letterSpacing: '0.04em' }}>
                {roomCode}
              </span>
              <span style={{ fontSize: '0.7rem', color: copied ? '#10b981' : 'var(--text-muted)' }}>
                {copied ? '✓' : '📋'}
              </span>
            </div>
          )}
        </div>

        {/* Right: Actions (Go to Home, Help) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Help Button */}
          <button
            type="button"
            className="navbar-btn"
            onClick={onOpenHelp}
            title="How to Play"
            aria-label="How to Play"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#f0f0ff',
              padding: '6px 12px',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              minHeight: '36px'
            }}
          >
            <span style={{ fontSize: '1rem' }}>❓</span>
            <span className="navbar-btn-text" style={{ fontSize: '0.82rem' }}>Help</span>
          </button>

          {/* Go to Home Button */}
          <button
            type="button"
            className="navbar-btn"
            onClick={handleHomeClick}
            title="Go to Home"
            aria-label="Go to Home"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: view === 'home' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(139, 92, 246, 0.15)',
              border: view === 'home' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(139, 92, 246, 0.35)',
              color: '#f0f0ff',
              padding: '6px 12px',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              minHeight: '36px'
            }}
          >
            <span style={{ fontSize: '1rem' }}>🏠</span>
            <span className="navbar-btn-text" style={{ fontSize: '0.82rem' }}>Home</span>
          </button>
        </div>
      </header>

      {/* Confirmation Modal when Leaving Room */}
      {showConfirmLeave && (
        <div
          className="help-modal-overlay animate-in"
          onClick={() => setShowConfirmLeave(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 5, 15, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
        >
          <div
            className="glass-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '380px',
              width: '100%',
              padding: '24px',
              borderRadius: '1rem',
              textAlign: 'center',
              background: '#161630',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🚪</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#fff' }}>Leave Current Game?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0 0 20px 0', lineHeight: 1.4 }}>
              Are you sure you want to return to the home screen? You can rejoin later using your room code.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowConfirmLeave(false)}
                style={{ flex: 1, padding: '8px 16px' }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={confirmLeaveRoom}
                style={{ flex: 1, padding: '8px 16px', background: 'var(--accent-rose, #f43f5e)' }}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
