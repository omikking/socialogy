export default function FinalResult({ scores, isHost, onPlayAgain }) {
  const winner = scores[0];

  return (
    <div className="page">
      <div className="container animate-in">
        <div className="glass-card-glow final-result">
          <div className="winner-crown">👑</div>
          <div className="winner-name">{winner?.name}</div>
          <div className="winner-label">
            wins with {winner?.score} points!
          </div>
        </div>

        {/* Full standings */}
        <div className="glass-card" style={{ padding: '24px 20px', marginTop: 20 }}>
          <h3 style={{ textAlign: 'center', marginBottom: 20, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Final Standings
          </h3>
          <div className="scoreboard stagger">
            {scores.map((player, i) => (
              <div className="score-row" key={player.id} style={{ animationDelay: `${i * 80}ms` }}>
                <span className="score-rank">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </span>
                <span className="score-player-name">{player.name}</span>
                <span className="score-points">{player.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Play again */}
        <div style={{ marginTop: 20 }}>
          {isHost ? (
            <button
              id="play-again-btn"
              className="btn btn-primary btn-lg"
              onClick={onPlayAgain}
              style={{ width: '100%' }}
            >
              🔄 Play Again
            </button>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Waiting for host to start a new game...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
