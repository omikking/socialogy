export default function WaitingScreen({ text }) {
  return (
    <div className="waiting-screen">
      <div className="waiting-spinner" />
      <p className="waiting-text">{text}</p>
    </div>
  );
}
