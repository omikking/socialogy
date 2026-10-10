import { useState } from 'react';
import PhaseHeader from './PhaseHeader';

export default function StorytellerPick({ roomState, wordCards = [], isHost, onSelect, onRequestCards, onForceNextPhase, onKickPlayer }) {
  const [commonWord, setCommonWord] = useState(null);
  const [imposterWord, setImposterWord] = useState(null);
  const [step, setStep] = useState(1); // 1 = pick common, 2 = pick imposter
  const [showKickModal, setShowKickModal] = useState(false);

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
      <div className="container-wide animate-in" style={{ maxWidth: 720 }}>
        <PhaseHeader roomState={roomState} />

        {/* Host Control Action Bar */}
        {isHost && (
          <div className="glass-card" style={{ padding: '12px 16px', marginBottom: 16, display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fde047' }}>👑 Host Controls:</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-sm btn-outline" style={{ fontSize: '0.8rem', padding: '4px 10px' }} onClick={() => setShowKickModal(!showKickModal)}>
                🔴 Kick Players
              </button>
              <button className="btn btn-sm btn-primary" style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'var(--accent-rose)' }} onClick={onForceNextPhase}>
                ⚡ Force Auto Pick
              </button>
            </div>
          </div>
        )}

        {/* Kick Modal */}
        {isHost && showKickModal && (
          <div className="glass-card" style={{ padding: '16px', marginBottom: 16, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
            <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: '0.9rem' }}>Select Inactive Player to Kick:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {roomState.players.filter(p => p.id !== roomState.hostId).map(p => (
                <button
                  key={p.id}
                  className="btn btn-sm"
                  style={{ background: 'var(--accent-rose)', color: '#fff', fontSize: '0.8rem' }}
                  onClick={() => {
                    onKickPlayer(p.id);
                    setShowKickModal(false);
                  }}
                >
                  Kick {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="glass-card" style={{ padding: '24px 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span className="badge badge-purple" style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
              🎭 You are the Storyteller
            </span>
            <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.9rem' }}>
              {step === 1
                ? 'Pick 1st word: COMMON (given to normal players)'
                : !imposterWord
                ? 'Pick 2nd word: IMPOSTER (given to the imposter)'
                : 'Confirm your word selections'}
            </p>
          </div>

          {/* Word cards grid or loading state */}
          {(!wordCards || wordCards.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '36px 16px' }}>
              <div className="waiting-spinner" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Loading your 30 word cards...
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
            <div className="word-cards-grid">
              {wordCards.map((word) => {
                const isCommon = word === commonWord;
                const isImposter = word === imposterWord;
                const isDisabled = step === 2 && word === commonWord && !imposterWord;

                let cardClass = 'word-card';
                if (isCommon || isImposter) cardClass += ' selected';

                return (
                  <div
                    key={word}
                    className={cardClass}
                    onClick={() => !isDisabled && handleCardClick(word)}
                    style={{
                      ...(isCommon ? {
                        background: 'rgba(6, 182, 212, 0.25)',
                        borderColor: 'var(--accent-cyan)',
                        color: 'var(--accent-cyan)',
                      } : {}),
                      ...(isImposter ? {
                        background: 'rgba(244, 63, 94, 0.25)',
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
                      <div style={{ fontSize: '0.6rem', marginTop: 2, fontWeight: 'bold' }}>COMMON</div>
                    )}
                    {isImposter && (
                      <div style={{ fontSize: '0.6rem', marginTop: 2, fontWeight: 'bold' }}>IMPOSTER</div>
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
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Common Word</div>
                    <div style={{ fontWeight: 700, color: commonWord ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                      {commonWord || '—'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Imposter Word</div>
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
