import PhaseHeader from './PhaseHeader';

export default function Scoreboard({ roomState, scores, isHost, onNextRound }) {
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const isLastRound = roomState.roundNumber >= roomState.maxRounds;

  return (
    <div className="page">
      <div className="container animate-in">
        <PhaseHeader roomState={roomState} />

        <div className="glass-card" style={{ padding: '24px 20px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: 20, fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Standings after Round {roomState.roundNumber}
          </h3>

          <div className="scoreboard stagger">
            {sorted.map((player, i) => (
              <div className="score-row" key={player.id} style={{ animationDelay: `${i * 80}ms` }}>
                <span className="score-rank">
                  {i === 0 ? '👑' : `#${i + 1}`}
                </span>
                <span className="score-player-name">{player.name}</span>
                <span className="score-points">{player.score}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          {isHost ? (
            <button
              id="next-round-btn"
              className="btn btn-primary btn-lg"
              onClick={onNextRound}
              style={{ width: '100%' }}
            >
              {isLastRound ? '🏆 See Final Results' : '→ Next Round'}
            </button>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Waiting for host to continue...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
