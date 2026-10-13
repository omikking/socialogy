import { useState } from 'react';

export default function HelpModal({ isOpen, onClose, initialMode = 'SOCIAL_DEDUCTION' }) {
  const [activeTab, setActiveTab] = useState(initialMode || 'SOCIAL_DEDUCTION');

  if (!isOpen) return null;

  return (
    <div
      className="help-modal-overlay animate-in"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 5, 15, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
        boxSizing: 'border-box'
      }}
    >
      <div
        className="glass-card help-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '1.25rem',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'linear-gradient(145deg, #161630 0%, #0d0d1f 100%)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>📖</span>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>
              How to Play
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#fff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              transition: 'background 0.2s ease'
            }}
          >
            ✕
          </button>
        </div>

        {/* Game Mode Tabs */}
        <div style={{
          display: 'flex',
          padding: '12px 16px 4px 16px',
          gap: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('SOCIAL_DEDUCTION')}
            style={{
              flex: 1,
              padding: '10px 8px',
              borderRadius: '0.6rem',
              border: 'none',
              background: activeTab === 'SOCIAL_DEDUCTION' ? 'var(--accent-cyan, #06b6d4)' : 'rgba(255, 255, 255, 0.06)',
              color: activeTab === 'SOCIAL_DEDUCTION' ? '#000' : '#fff',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: 'all 0.2s ease'
            }}
          >
            🕵️ Social Deduction
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('CATEGORY_IMPOSTER')}
            style={{
              flex: 1,
              padding: '10px 8px',
              borderRadius: '0.6rem',
              border: 'none',
              background: activeTab === 'CATEGORY_IMPOSTER' ? 'var(--accent-rose, #f43f5e)' : 'rgba(255, 255, 255, 0.06)',
              color: '#fff',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: 'all 0.2s ease'
            }}
          >
            🏷️ Category Imposter
          </button>
        </div>

        {/* Modal Body / Rules Content */}
        <div style={{
          padding: '16px 20px',
          overflowY: 'auto',
          fontSize: '0.88rem',
          lineHeight: '1.5',
          color: 'rgba(255, 255, 255, 0.85)'
        }}>
          {activeTab === 'SOCIAL_DEDUCTION' ? (
            <div className="help-section">
              <div style={{
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                borderRadius: '0.75rem',
                padding: '12px 14px',
                marginBottom: '14px'
              }}>
                <div style={{ fontWeight: '700', color: 'var(--accent-cyan, #06b6d4)', marginBottom: '4px' }}>
                  🎯 The Core Concept (30 Word Grid)
                </div>
                <div>
                  Players receive a personalized grid of <strong>30 word cards</strong>. One player is the Storyteller; the others are Civilians, except <strong>one secret Imposter</strong>!
                </div>
              </div>

              <h4 style={{ color: '#fff', margin: '14px 0 8px 0', fontSize: '0.95rem' }}>Step-by-Step Gameplay:</h4>
              <ol style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>
                  <strong>🎭 Storyteller Word Selection:</strong> The Storyteller inspects their 30 cards and selects <strong>2 words</strong>:
                  <ul style={{ paddingLeft: '1rem', marginTop: '4px' }}>
                    <li><strong>Common Word</strong>: Sent to all innocent Civilians.</li>
                    <li><strong>Imposter Word</strong>: Sent only to the secret Imposter.</li>
                  </ul>
                </li>
                <li>
                  <strong>🃏 30-Word Card Selection:</strong> Each player views their secret word, searches their personal <strong>30-card grid</strong>, and chooses 1 card that best relates to or hints at their secret word.
                </li>
                <li>
                  <strong>🔍 Answer Reveal:</strong> Everyone’s chosen clue cards are revealed simultaneously.
                </li>
                <li>
                  <strong>🗣️ Discussion:</strong> Players discuss, question each other, and analyze clues to catch who is bluffing or holding the Imposter word!
                </li>
                <li>
                  <strong>🗳️ Voting & Scoring:</strong> Vote for the suspected Imposter. Civilians score points for finding the Imposter; the Imposter scores points if they fool the room!
                </li>
              </ol>
            </div>
          ) : (
            <div className="help-section">
              <div style={{
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                borderRadius: '0.75rem',
                padding: '12px 14px',
                marginBottom: '14px'
              }}>
                <div style={{ fontWeight: '700', color: 'var(--accent-rose, #f43f5e)', marginBottom: '4px' }}>
                  🎯 Fast-Paced Category Party Game
                </div>
                <div>
                  Pick a theme (Animals, Food, Movies, etc.). Civilians see the <strong>real category word</strong>, while the Imposter sees a different decoy word or has to bluff!
                </div>
              </div>

              <h4 style={{ color: '#fff', margin: '14px 0 8px 0', fontSize: '0.95rem' }}>How It Works:</h4>
              <ol style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>
                  <strong>🏷️ Category Revealed:</strong> Everyone sees the active category (e.g. <em>Food & Dishes</em>).
                </li>
                <li>
                  <strong>🤫 Secret Roles:</strong> Civilians receive the secret word (e.g. <em>Pizza</em>). The Imposter receives a slightly different word (e.g. <em>Burger</em>).
                </li>
                <li>
                  <strong>🗣️ Clue Round:</strong> Players give subtle clues without giving the secret away to the Imposter!
                </li>
                <li>
                  <strong>💬 Skip Typing Mode:</strong> In person? Enable <em>Skip Typing</em> in the lobby to discuss out loud face-to-face!
                </li>
                <li>
                  <strong>🗳️ Vote:</strong> Spot the odd clue and vote out the Imposter!
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.02)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            className="btn btn-primary"
            onClick={onClose}
            style={{
              padding: '8px 24px',
              fontSize: '0.88rem',
              borderRadius: '0.6rem'
            }}
          >
            ✓ Got It!
          </button>
        </div>
      </div>
    </div>
  );
}
