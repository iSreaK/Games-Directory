import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const QuizzPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/games/') // API need filtre quizz uniquement
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement des jeux');
        return res.json();
      })
      .then(data => {
        setGames(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement des jeux...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {games.map(game => (
        <div
          key={game.id}
          onClick={() => navigate(`/quizz/${game.id}`)}
          className="cursor-pointer rounded-lg shadow-lg overflow-hidden hover:shadow-indigo-500 transition"
        >
          <img
            src={game.background_image}
            alt={game.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4 bg-white dark:bg-gray-800">
            <h3 className="text-lg font-bold">{game.name}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizzPage;
