import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import "./quiz.css";

const Quiz = () => {
  const { isAuth, loading } = UserData();
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState("");
  const [quizLoading, setQuizLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!loading && !isAuth) {
      navigate("/login");
    }
  }, [isAuth, loading, navigate]);

  const generateQuiz = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic");
      return;
    }

    setQuizLoading(true);
    setQuestions([]);
    setCurrent(0);
    setScore(0);
    setFinished(false);
    setSelected("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/quiz",
        { topic },
        {
          headers: {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
},
        }
      );

      if (!res.data.questions || !Array.isArray(res.data.questions)) {
        throw new Error("Invalid quiz format");
      }

      setQuestions(res.data.questions);
    } catch (error) {
      console.error("Quiz error:", error);
      alert("Failed to generate quiz");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleNext = () => {
    if (selected === questions[current].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setSelected("");

    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  if (loading) {
    return <p className="quiz-loading">Checking authentication...</p>;
  }

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">AI Quiz Generator</h1>

     
      {!questions.length && (
        <>
          <input
            type="text"
            className="quiz-input"
            placeholder="Enter topic (e.g. DBMS, OS, React)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <button onClick={generateQuiz} className="common-btn">
            Generate Quiz
          </button>

          {quizLoading && (
            <p className="quiz-loading">Generating questions...</p>
          )}
        </>
      )}

      
      {questions.length > 0 && !finished && (
        <div>
          <h3 className="quiz-question">
            Q{current + 1}. {questions[current].question}
          </h3>

          <div className="quiz-options">
            {questions[current].options.map((opt, i) => (
              <label key={i} className="quiz-option">
                <input
                  type="radio"
                  name="option"
                  value={opt}
                  checked={selected === opt}
                  onChange={() => setSelected(opt)}
                />
                {opt}
              </label>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="common-btn quiz-next-btn"
            disabled={!selected}
          >
            Next
          </button>
        </div>
      )}

      {finished && (
        <div className="quiz-result">
          <h2>Quiz Completed 🎉</h2>
          <h3 className="quiz-score">
            Your Score: {score} / {questions.length}
          </h3>

          <button
            className="common-btn"
            onClick={() => {
              setQuestions([]);
              setTopic("");
            }}
          >
            Try Another Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
