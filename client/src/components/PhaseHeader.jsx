export default function PhaseHeader({ roomState }) {
  const storyteller = roomState.players.find(p => p.id === roomState.storytellerId);

  const phaseLabels = {
    STORYTELLER_PICK: 'Storyteller Choosing',
    CARD_SELECTION: 'Choose Your Card',
    REVEAL: 'Answers Revealed',
    DISCUSSION: 'Discussion',
    VOTING: 'Vote for the Imposter',
    RESULTS: 'Round Results',
    SCOREBOARD: 'Scoreboard',
    FINISHED: 'Game Over',
  };

  return (
    <div className="phase-header">
      <div className="round-info">
        <span className="badge badge-purple">
          Round {roomState.roundNumber} / {roomState.maxRounds}
        </span>
        {storyteller && (
          <span className="badge badge-cyan">
            🎭 {storyteller.name}
          </span>
        )}
      </div>
      <h2 className="phase-title">
        {phaseLabels[roomState.gameState] || roomState.gameState}
      </h2>
    </div>
  );
}
