import PhaseHeader from './PhaseHeader';

export default function Results({ roomState, roundResult, isHost, onShowScoreboard }) {
  if (!roundResult) {
    return (
      <div className="page">
        <div className="container">
          <PhaseHeader roomState={roomState} />
          <div className="waiting-screen">
            <div className="waiting-spinner" />
            <p className="waiting-text">Calculating results...</p>
          </div>
        </div>
      </div>
    );
  }

  const { imposterCaught, imposterName, voteCounts, commonWord, imposterWord, voteDetails, gameMode, categoryName } = roundResult;
  const isCategoryImposter = gameMode === 'CATEGORY_IMPOSTER' || roomState?.gameMode === 'CATEGORY_IMPOSTER';

  // Sort players by vote count for the bar chart
  const sortedVotes = Object.entries(voteCounts || {})
    .map(([id, count]) => {
      const player = roomState.players.find(p => p.id === id);
      return { id, count, name: player?.name || 'Unknown', isImposter: id === roundResult.imposterId };
    })
    .filter(v => roomState.gameMode === 'CATEGORY_IMPOSTER' ? true : v.id !== roomState.storytellerId)
    .sort((a, b) => b.count - a.count);

  const maxVoteCount = Math.max(...sortedVotes.map(v => v.count), 1);

  return (
    <div className="page">
      <div className="container animate-in">
        <PhaseHeader roomState={roomState} />

        {/* Category Header if Category Imposter mode */}
        {isCategoryImposter && categoryName && (
          <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
            <span className="badge badge-rose" style={{ fontSize: '0.9rem', padding: '0.3rem 0.8rem', borderRadius: '1rem' }}>
              🏷️ Category: {categoryName}
            </span>
          </div>
        )}

        {/* Big reveal */}
        <div className="glass-card-glow result-reveal">
          <div className="result-label">The Imposter Was</div>
          <div className={`result-name ${imposterCaught ? 'result-caught' : 'result-survived'}`}>
            {imposterName}
          </div>
          <div className={`result-status ${imposterCaught ? 'caught' : 'survived'}`}>
            {imposterCaught ? '🎯 Caught!' : '🎭 Survived!'}
          </div>

          {/* Words reveal */}
          <div className="result-words">
            <div className="result-word-item">
              <div className="result-word-label">{isCategoryImposter ? "Civilian Word" : "Common Word"}</div>
              <div className="result-word-value" style={{ color: 'var(--accent-cyan)' }}>{commonWord}</div>
            </div>
            <div className="result-word-item">
              <div className="result-word-label">Imposter Word</div>
              <div className="result-word-value" style={{ color: 'var(--accent-rose)' }}>{imposterWord}</div>
            </div>
          </div>
        </div>

        {/* Vote breakdown */}
        <div className="glass-card" style={{ padding: '24px 20px', marginTop: 16 }}>
          <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
            Vote Breakdown
          </h3>
          <div className="vote-breakdown stagger">
            {sortedVotes.map((v, i) => (
              <div className="vote-bar-row" key={v.id} style={{ animationDelay: `${i * 100}ms` }}>
                <span className="vote-bar-name">
                  {v.name}
                  {v.isImposter && ' 🕵️'}
                </span>
                <div className="vote-bar-track">
                  <div
                    className={`vote-bar-fill ${v.isImposter ? 'imposter' : ''}`}
                    style={{ width: `${(v.count / maxVoteCount) * 100}%` }}
                  />
                </div>
                <span className="vote-bar-count">{v.count}</span>
              </div>
            ))}
          </div>

          {/* Who voted for whom */}
          {voteDetails && voteDetails.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                Vote Details
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {voteDetails.map((v) => (
                  <span key={v.voterId} className="badge badge-purple" style={{ fontSize: '0.8rem' }}>
                    {v.voterName} → {v.targetName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Scoring summary */}
        <div className="glass-card" style={{ padding: '24px 20px', marginTop: 16 }}>
          <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            Round Scoring
          </h3>

          {isCategoryImposter ? (
            imposterCaught ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                🎯 Imposter was caught! Civilians earn <strong style={{ color: 'var(--accent-emerald)' }}>+1 point each</strong>.
              </p>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                🎭 Imposter survived! Imposter earns <strong style={{ color: 'var(--accent-emerald)' }}>+{Math.max(1, Math.floor(roomState.players.length / 2))} points</strong> (half of total players count).
              </p>
            )
          ) : (
            imposterCaught ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                🎯 Imposter was caught! Voters who identified them earned <strong style={{ color: 'var(--accent-emerald)' }}>+3 points</strong>.
              </p>
            ) : (
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 10 }}>
                  🎭 Imposter survived with <strong>{roundResult.imposterVotes || 0}</strong> vote{roundResult.imposterVotes === 1 ? '' : 's'} against them:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: 8 }}>
                    <span>Storyteller ({roomState.players.find(p => p.id === roomState.storytellerId)?.name || 'Storyteller'})</span>
                    <strong style={{ color: 'var(--accent-emerald)' }}>
                      +{roundResult.storytellerPoints ?? 4} pts
                      <span style={{ fontSize: '0.75rem', opacity: 0.8, marginLeft: 6 }}>
                        {roundResult.imposterVotes >= 2 ? '(Close Game Bonus ⭐)' : roundResult.imposterVotes === 1 ? '(Balanced Pair)' : '(Clean Escape)'}
                      </span>
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: 8 }}>
                    <span>Imposter ({roundResult.imposterName})</span>
                    <strong style={{ color: 'var(--accent-emerald)' }}>
                      +{roundResult.imposterPoints ?? 4} pts
                      <span style={{ fontSize: '0.75rem', opacity: 0.8, marginLeft: 6 }}>
                        {roundResult.imposterVotes >= 2 ? '(Narrow Survival Bonus 🔥)' : '(Survival)'}
                      </span>
                    </strong>
                  </div>
                </div>
              </div>
            )
          )}

          {roundResult.scoringSummary && roundResult.scoringSummary.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {roundResult.scoringSummary.map((s, idx) => (
                <span key={idx} className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                  {s.playerName}: +{s.points} pts ({s.reason})
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Next button */}
        <div style={{ marginTop: 20 }}>
          {isHost ? (
            <button
              id="show-scoreboard-btn"
              className="btn btn-primary"
              onClick={onShowScoreboard}
              style={{ width: '100%' }}
            >
              View Scoreboard →
            </button>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Waiting for host...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
