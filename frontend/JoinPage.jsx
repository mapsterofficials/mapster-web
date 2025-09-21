import "./JoinPage.css";
import { useNavigate } from "react-router-dom";
import FullWidthButton from "./FullWidthButton";

function JoinPage() {
  const navigate = useNavigate();
  return (
    <div className="join-page-wrapper">
      <h3>The Best Way to find your way to Destiny!</h3>
      <p>
        Welcome to our community of students, who are navigating campus together. Join us to find your way to Class, Labs, Exam Hall, etc.
        connect with peers, and make the most of your college experience.
      </p>
      <FullWidthButton text="Join" onClick={() => navigate("/signin")}></FullWidthButton>
    </div>
  );
}

export default JoinPage;
