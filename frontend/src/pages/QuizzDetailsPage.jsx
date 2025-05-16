import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Quizz from '../assets/data/Quizz.json';

const QuizzDetailsPage = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recherche du quiz correspondant à l'id
    const quiz = Quizz.find(q => q.id === id || q.id_game === id);
    if (quiz && quiz.questions_id) {
      // Mapping pour adapter au format attendu (title/choices/correct_answer)
      const formattedQuestions = quiz.questions_id.map((q, index) => ({
        id: `${index}`,
        title: q.titre,
        choices: [q.choix_1, q.choix_2, q.choix_3, q.choix_4],
        correct_answer: q.right_choice
      }));
      setQuestions(formattedQuestions);
    } else {
      setQuestions([]);
    }
    setLoading(false);
  }, [id]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) score++;
    });
    setResult(`Votre score est ${score} / ${questions.length}`);
  };

  if (loading) return <div>Chargement du quiz...</div>;
  if (questions.length === 0) return <div>Aucune question disponible.</div>;

  const question = questions[currentIndex];

  return (
    <div className="max-w-xl mx-auto p-6 my-32 bg-white dark:bg-gray-800 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Question {currentIndex + 1} / {questions.length}</h2>
      <h3 className="text-xl mb-4">{question.title}</h3>

      <div className="space-y-2 mb-6">
        {question.choices.map(choice => (
          <label key={choice} className="block cursor-pointer">
            <input
              type="radio"
              name={`question-${question.id}`}
              value={choice}
              checked={answers[question.id] === choice}
              onChange={() => handleAnswerChange(question.id, choice)}
              className="mr-2"
            />
            {choice}
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

      {result && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded">
          {result}
        </div>
      )}
    </div>
  );
};

export default QuizzDetailsPage;
