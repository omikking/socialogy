import { useState } from 'react';

const AVATAR_COLORS = [
  'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  'linear-gradient(135deg, #3b82f6, #2563eb)',
  'linear-gradient(135deg, #06b6d4, #0891b2)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #f43f5e, #e11d48)',
  'linear-gradient(135deg, #ec4899, #db2777)',
  'linear-gradient(135deg, #f97316, #ea580c)',
  'linear-gradient(135deg, #14b8a6, #0d9488)',
  'linear-gradient(135deg, #6366f1, #4f46e5)',
];

export default function Lobby({ roomState, playerId, isHost, onStartGame, onUpdateSettings, onKickPlayer }) {
  const [copied, setCopied] = useState(false);
  const minPlayers = roomState.gameMode === 'CATEGORY_IMPOSTER' ? 3 : 4;
  const canStart = roomState.players.length >= minPlayers;
  const categories = roomState.categories || [];

  const copyCode = () => {
    navigator.clipboard.writeText(roomState.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page">
      <div className="container animate-in">
        <div className="glass-card" style={{ padding: '28px 24px' }}>
          {/* Header & Mode Badge */}
          <div className="lobby-header">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <span className={`badge ${roomState.gameMode === 'CATEGORY_IMPOSTER' ? 'badge-rose' : 'badge-cyan'}`} style={{
                fontSize: '0.85rem',
                padding: '0.3rem 0.8rem',
                borderRadius: '1rem',
                background: roomState.gameMode === 'CATEGORY_IMPOSTER' ? 'var(--accent-rose, #f43f5e)' : 'var(--accent-cyan, #06b6d4)',
                color: roomState.gameMode === 'CATEGORY_IMPOSTER' ? '#fff' : '#000',
                fontWeight: 'bold'
              }}>
                {roomState.gameMode === 'CATEGORY_IMPOSTER' ? '🏷️ Category Imposter' : '🕵️ Social Deduction'}
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              Room Code
            </div>
            <div className="lobby-code" onClick={copyCode} title="Click to copy">
              {roomState.code}
            </div>
            <div className="lobby-code-hint">
              {copied ? '✓ Copied!' : 'Click to copy'}
            </div>
          </div>

          {/* Players */}
          <div className="lobby-section-title" style={{ marginTop: 16 }}>
            Players ({roomState.players.length}/10)
          </div>
          <ul className="player-list stagger">
            {roomState.players.map((p, i) => (
              <li className="player-item" key={p.id}>
                <div className="player-info">
                  <div
                    className="player-avatar"
                    style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                  >
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="player-name">
                    {p.name}
                    {p.id === playerId && <span className="player-you">(you)</span>}
                  </span>
                  {p.isHost && <span className="badge badge-amber">Host</span>}
                </div>
                <div className="player-status">
                  <span className={`status-dot ${p.connected ? '' : 'disconnected'}`} />
                  {isHost && p.id !== playerId && (
                    <button className="kick-btn" onClick={() => onKickPlayer(p.id)}>
                      ✕
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Settings (host only) */}
          {isHost && (
            <>
              <div className="lobby-section-title">Settings</div>
              <div className="lobby-settings">
                {/* Mode toggle option */}
                <div className="setting-row">
                  <span className="setting-label">Game Mode</span>
                  <select
                    className="input lobby-select"
                    style={{ width: 'auto', padding: '0.45rem 0.9rem', fontSize: '0.9rem', borderRadius: '0.5rem', background: '#161630', color: '#fff' }}
                    value={roomState.gameMode || 'SOCIAL_DEDUCTION'}
                    onChange={(e) => onUpdateSettings({ gameMode: e.target.value })}
                  >
                    <option value="SOCIAL_DEDUCTION">🕵️ Social Deduction</option>
                    <option value="CATEGORY_IMPOSTER">🏷️ Category Imposter</option>
                  </select>
                </div>

                {/* Category Imposter Specific Settings */}
                {roomState.gameMode === 'CATEGORY_IMPOSTER' && (
                  <>
                    <div className="setting-row">
                      <span className="setting-label">Category</span>
                      <select
                        className="input lobby-select"
                        style={{ width: 'auto', padding: '0.45rem 0.9rem', fontSize: '0.9rem', borderRadius: '0.5rem', background: '#161630', color: '#fff' }}
                        value={roomState.selectedCategory || 'Random'}
                        onChange={(e) => onUpdateSettings({ selectedCategory: e.target.value })}
                      >
                        <option value="Random">🎲 Random Category</option>
                        {categories.map((cat) => (
                          <option key={cat.name} value={cat.name}>
                            {cat.name} ({cat.count} words)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="setting-row" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', width: '100%' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(roomState.skipTyping)}
                          onChange={(e) => onUpdateSettings({ skipTyping: e.target.checked })}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--accent-rose, #f43f5e)' }}
                        />
                        <span style={{ fontWeight: '600', color: '#fff' }}>🗣️ Skip Typing (In-Person Discussion)</span>
                      </label>
                      <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0, paddingLeft: '1.75rem' }}>
                        When enabled, players talk out loud in person instead of typing text clues on screen!
                      </p>
                    </div>
                  </>
                )}

                {/* Social Deduction Specific Settings */}
                {(roomState.gameMode === 'SOCIAL_DEDUCTION' || !roomState.gameMode) && (
                  <div className="setting-row">
                    <span className="setting-label">Word Grid Mode</span>
                    <select
                      className="input lobby-select"
                      style={{ width: 'auto', padding: '0.45rem 0.9rem', fontSize: '0.85rem', borderRadius: '0.5rem', background: '#161630', color: '#fff' }}
                      value={roomState.cardDistribution || 'SAME_30'}
                      onChange={(e) => onUpdateSettings({ cardDistribution: e.target.value })}
                    >
                      <option value="SAME_30">📋 30 Same Words (Everyone gets same grid)</option>
                      <option value="DIFFERENT_30">🔀 30 Unique Words (Different grid per player)</option>
                    </select>
                  </div>
                )}

                <div className="setting-row">
                  <span className="setting-label">Rounds</span>
                  <div className="setting-value">
                    <button
                      className="setting-btn"
                      onClick={() => onUpdateSettings({ maxRounds: Math.max(1, roomState.maxRounds - 1) })}
                    >
                      −
                    </button>
                    <span className="setting-number">{roomState.maxRounds}</span>
                    <button
                      className="setting-btn"
                      onClick={() => onUpdateSettings({ maxRounds: Math.min(10, roomState.maxRounds + 1) })}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="lobby-footer">
            {!canStart && (
              <div className="min-players-hint">
                ⚠ Need at least {minPlayers} players to start
              </div>
            )}
            {isHost && (
              <button
                id="start-game-btn"
                className="btn btn-primary btn-lg"
                onClick={onStartGame}
                disabled={!canStart}
                style={{ width: '100%' }}
              >
                Start Game
              </button>
            )}
            {!isHost && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Waiting for host to start...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
