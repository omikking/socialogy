import { useState } from 'react';
import PhaseHeader from './PhaseHeader';

export default function StorytellerPick({ roomState, wordCards = [], onSelect, onRequestCards }) {
  const [commonWord, setCommonWord] = useState(null);
  const [imposterWord, setImposterWord] = useState(null);
  const [step, setStep] = useState(1); // 1 = pick common, 2 = pick imposter

  const handleCardClick = (word) => {
    if (step === 1) {
      setCommonWord(word);
      setStep(2);
    } else {
      if (word === commonWord) return; // can't pick same word
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
    <div className="page">
      <div className="container animate-in" style={{ maxWidth: 560 }}>
        <PhaseHeader roomState={roomState} />

        <div className="glass-card" style={{ padding: '24px 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <span className="badge badge-purple" style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
              🎭 You are the Storyteller
            </span>
            <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: '0.9rem' }}>
              {step === 1
                ? 'Pick the COMMON word (given to normal players)'
                : !imposterWord
                ? 'Now pick the IMPOSTER word (given to the imposter)'
                : 'Confirm your selection'}
            </p>
          </div>

          {/* Word cards grid or loading state */}
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
            {wordCards.map((word, i) => {
              const isCommon = word === commonWord;
              const isImposter = word === imposterWord;
              const isSelected = isCommon || isImposter;
              const isDisabled = step === 2 && word === commonWord && !imposterWord;

              let cardClass = 'word-card';
              if (isCommon) cardClass += ' selected';
              if (isImposter) cardClass += ' selected';

              return (
                <div
                  key={word}
                  className={cardClass}
                  onClick={() => !isDisabled && handleCardClick(word)}
                  style={{
                    animationDelay: `${i * 50}ms`,
                    ...(isCommon ? {
                      background: 'rgba(6, 182, 212, 0.15)',
                      borderColor: 'var(--accent-cyan)',
                      color: 'var(--accent-cyan)',
                    } : {}),
                    ...(isImposter ? {
                      background: 'rgba(244, 63, 94, 0.15)',
                      borderColor: 'var(--accent-rose)',
                      color: 'var(--accent-rose)',
                    } : {}),
                    ...(isDisabled ? {
                      opacity: 0.4,
                      cursor: 'not-allowed',
                    } : {}),
                  }}
                >
                  {word}
                  {isCommon && (
                    <div style={{ fontSize: '0.65rem', marginTop: 4, opacity: 0.8 }}>COMMON</div>
                  )}
                  {isImposter && (
                    <div style={{ fontSize: '0.65rem', marginTop: 4, opacity: 0.8 }}>IMPOSTER</div>
                  )}
                </div>
              );
            })}
          </div>
          )}

          {/* Selection summary & actions */}
          <div style={{ marginTop: 20 }}>
            {(commonWord || imposterWord) && (
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Common</div>
                    <div style={{ fontWeight: 700, color: commonWord ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                      {commonWord || '—'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Imposter</div>
                    <div style={{ fontWeight: 700, color: imposterWord ? 'var(--accent-rose)' : 'var(--text-muted)' }}>
                      {imposterWord || '—'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              {(commonWord || imposterWord) && (
                <button className="btn btn-secondary" onClick={handleReset} style={{ flex: 1 }}>
                  Reset
                </button>
              )}
              {commonWord && imposterWord && (
                <button
                  id="confirm-words-btn"
                  className="btn btn-primary"
                  onClick={handleConfirm}
                  style={{ flex: 2 }}
                >
                  ✓ Confirm Selection
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
