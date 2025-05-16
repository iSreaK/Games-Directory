import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const QuizzDetailsPage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizRes = await fetch(`http://127.0.0.1:8000/quizzes/game/${id}`, {
          headers: { Authorization: `Token ${token}` }
        });

        if (!quizRes.ok) {
            setQuiz(null);
            setLoading(false);
            return;
          }

        const quizData = await quizRes.json();
        setQuiz(quizData);

        const formatted = quizData.questions.map(q => ({
          id: q.id,
          text: q.text,
          choices: q.choices.map(c => ({ id: c.id, text: c.text }))
        }));
        setQuestions(formatted);

        const scoreRes = await fetch(`http://127.0.0.1:8000/quizzes/${quizData.id}/score/`, {
          headers: { Authorization: `Token ${token}` }
        });

        if (scoreRes.ok) {
          const scoreData = await scoreRes.json();
          if (scoreData.total > 0) {
            setScore({ score: scoreData.score, total: scoreData.total });
            setAlreadyPlayed(true);
          }
        }
      } catch (err) {
        console.error("Erreur chargement quiz/score :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAnswerChange = (questionId, choiceId) => {
    setAnswers(prev => ({ ...prev, [questionId]: choiceId }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        responses: questions.map(q => ({
          question_id: q.id,
          choice_id: answers[q.id]
        }))
      };

      const res = await fetch('http://127.0.0.1:8000/quizzes/submit-quiz/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setScore({ score: data.score, total: data.total });
      setAlreadyPlayed(true);
    } catch (err) {
      console.error("Erreur soumission quiz :", err);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIndex(0);
    setScore(null);
    setAlreadyPlayed(false);
  };

  if (loading) return <div>Chargement du quiz...</div>;
  if (!quiz) return <div>Aucun quiz trouvé pour ce jeu.</div>;

  const question = questions[currentIndex];

  return (
    <div className="max-w-xl mx-auto p-6 my-32 bg-white dark:bg-gray-800 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>

      {alreadyPlayed && score !== null ? (
        <>
          <div className="p-4 bg-green-100 text-green-800 rounded mb-4">
            Vous avez déjà complété ce quiz.<br />
            <strong>Votre score : {score.score} / {score.total}</strong>
          </div>
          <button onClick={handleRetry} className="px-4 py-2 bg-blue-600 text-white rounded">
            Rejouer
          </button>
        </>
      ) : (
        <>
          <h3 className="text-xl mb-4">Question {currentIndex + 1} / {questions.length}</h3>
          <p className="mb-4">{question.text}</p>

          <div className="space-y-2 mb-6">
            {question.choices.map(choice => (
              <label key={choice.id} className="block cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={choice.id}
                  checked={answers[question.id] === choice.id}
                  onChange={() => handleAnswerChange(question.id, choice.id)}
                  className="mr-2"
                />
                {choice.text}
              </label>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Précédent
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!answers[question.id]}
                className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== questions.length}
                className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
              >
                Valider
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default QuizzDetailsPage;