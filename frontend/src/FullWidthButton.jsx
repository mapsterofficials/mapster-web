import "./FullWidthButton.css";

function FullWidthButton({ text, onClick }) {
  return (
    <button className="full-width-button" onClick={onClick}>
      {text}
    </button>
  );
}

export default FullWidthButton;
