import { useState } from 'react';

export default function StorytellerPick({
  roomState,
  wordCards = [],
  isHost,
  onSelect,
  onRequestCards,
  onForceNextPhase,
  onKickPlayer,
}) {
  const [commonWord, setCommonWord] = useState(null);
  const [imposterWord, setImposterWord] = useState(null);
  const [step, setStep] = useState(1); // 1 = pick common, 2 = pick imposter
  const [showKickModal, setShowKickModal] = useState(false);

  const handleCardClick = (word) => {
    if (step === 1) {
      setCommonWord(word);
      setStep(2);
    } else {
      if (word === commonWord) {
        // Deselect common if clicked again
        setCommonWord(null);
        setStep(1);
        return;
      }
      setImposterWord(word);
    }
  };

  const handleConfirm = () => {
    if (!commonWord || !imposterWord) return;
    onSelect(commonWord, imposterWord);
  };

  const handleReset = () => {
    setCommonWord(null);
    setImposterWord(null);
    setStep(1);
  };

  return (
    <div className="game-screen-wrapper">
      <div className="game-screen-content animate-in">
        {/* Compact Header Bar */}
        <div className="compact-top-bar">
          <div className="compact-badges">
            <span className="badge badge-purple" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
              Round {roomState?.roundNumber || 1}/{roomState?.maxRounds || 5}
            </span>
            <span className="badge badge-amber" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
              🎭 You are Storyteller
            </span>
          </div>

          {/* Word Pick Progress Pill */}
          <div className="compact-pick-pills">
            <div
              className={`pick-pill-item ${commonWord ? 'filled-common' : step === 1 ? 'active-step' : ''}`}
              onClick={() => {
                if (commonWord) {
                  setCommonWord(null);
                  setStep(1);
                }
              }}
              title="Common Word (for Civilians)"
            >
              <span className="pick-pill-label">1. COMMON:</span>
              <span className="pick-pill-val">{commonWord || (step === 1 ? '👈 Pick word' : 'None')}</span>
            </div>

            <div
              className={`pick-pill-item ${imposterWord ? 'filled-imposter' : step === 2 ? 'active-step' : ''}`}
              onClick={() => {
                if (imposterWord) setImposterWord(null);
                setStep(2);
              }}
              title="Imposter Word"
            >
              <span className="pick-pill-label">2. IMPOSTER:</span>
              <span className="pick-pill-val">{imposterWord || (step === 2 ? '👈 Pick word' : 'None')}</span>
            </div>
          </div>

          {/* Host Controls Quick Toggle */}
          {isHost && (
            <div className="compact-host-controls">
              <button
                className="btn btn-sm btn-outline"
                style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px' }}
                onClick={() => setShowKickModal(!showKickModal)}
                title="Kick inactive player"
              >
                🔴 Kick
              </button>
              <button
                className="btn btn-sm btn-primary"
                style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--accent-rose)' }}
                onClick={onForceNextPhase}
                title="Auto-pick 2 random cards"
              >
                ⚡ Auto Pick
              </button>
            </div>
          )}
        </div>

        {/* Kick Modal dropdown if opened */}
        {isHost && showKickModal && (
          <div className="glass-card" style={{ padding: '8px 12px', margin: '4px 0', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Kick Inactive Player: </span>
            {roomState?.players?.filter((p) => p.id !== roomState.hostId).map((p) => (
              <button
                key={p.id}
                className="btn btn-sm"
                style={{ background: 'var(--accent-rose)', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', margin: '2px' }}
                onClick={() => {
                  onKickPlayer(p.id);
                  setShowKickModal(false);
                }}
              >
                {p.name} ✕
              </button>
            ))}
          </div>
        )}

        {/* Ultra-slim Instruction bar */}
        <div className="compact-instruction-bar">
          <span className="instruction-text">
            {step === 1
              ? 'Click 1st word for CIVILIANS (Common)'
              : !imposterWord
              ? 'Click 2nd word for the IMPOSTER'
              : 'Both words chosen! Confirm below or change any card'} ({wordCards.length}/30 cards)
          </span>
          {wordCards.length < 30 && onRequestCards && (
            <button
              className="btn btn-sm btn-secondary"
              onClick={onRequestCards}
              style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '1rem', marginLeft: '6px' }}
            >
              🔄 Refresh 30 Cards
            </button>
          )}
        </div>

        {/* 30 Cards Grid (6x5 on desktop, 5x6 on mobile - all 30 visible at once) */}
        {(!wordCards || wordCards.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div className="waiting-spinner" style={{ margin: '0 auto 8px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Loading 30 cards...</p>
            {onRequestCards && (
              <button className="btn btn-sm btn-secondary" onClick={onRequestCards} style={{ marginTop: 8 }}>
                🔄 Load Cards
              </button>
            )}
          </div>
        ) : (
          <div className="grid-30-cards">
            {wordCards.slice(0, 30).map((word, idx) => {
              const isCommon = word === commonWord;
              const isImposter = word === imposterWord;
              let extraClass = '';
              if (isCommon) extraClass = 'selected-common';
              else if (isImposter) extraClass = 'selected-imposter';

              return (
                <button
                  key={`${word}-${idx}`}
                  type="button"
                  className={`grid-word-card ${extraClass}`}
                  onClick={() => handleCardClick(word)}
                  title={isCommon ? 'Common Word' : isImposter ? 'Imposter Word' : word}
                >
                  {isCommon ? `✓ ${word}` : isImposter ? `✕ ${word}` : word}
                </button>
              );
            })}
          </div>
        )}

        {/* Confirm Word Pair Action Bar */}
        <div className="compact-action-bar" style={{ gap: '8px' }}>
          {commonWord && (
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={handleReset}
              style={{ fontSize: '0.8rem', padding: '8px 16px', height: '40px' }}
            >
              ↺ Reset
            </button>
          )}

          <button
            type="button"
            className={`btn btn-primary compact-lock-btn ${commonWord && imposterWord ? 'pulse-glow' : ''}`}
            onClick={handleConfirm}
            disabled={!commonWord || !imposterWord}
            style={{ flex: 1 }}
          >
            {commonWord && imposterWord
              ? `✓ Confirm: "${commonWord}" & "${imposterWord}"`
              : step === 1
              ? 'Select 1st word for Civilians'
              : 'Select 2nd word for Imposter'}
          </button>
        </div>
      </div>
    </div>
  );
}
