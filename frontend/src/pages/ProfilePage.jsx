import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [gameTitles, setGameTitles] = useState({});
  const [scores, setScores] = useState([]);
  const [activeTab, setActiveTab] = useState('reviews');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/auth');
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/users/me/', {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error('Erreur de récupération des données utilisateur');
        const data = await res.json();
        setUser(data);
        await fetchGameTitles(data.reviews);
        await fetchScores(token);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchGameTitles = async (reviews) => {
      const titles = {};
      for (const review of reviews) {
        const gameId = review.game;
        if (!titles[gameId]) {
          try {
            const res = await fetch(`http://127.0.0.1:8000/games/${gameId}/`);
            if (res.ok) {
              const gameData = await res.json();
              titles[gameId] = gameData.name;
            } else {
              titles[gameId] = `Jeu #${gameId}`;
            }
          } catch {
            titles[gameId] = `Jeu #${gameId}`;
          }
        }
      }
      setGameTitles(titles);
    };

    const fetchScores = async (token) => {
      try {
        const res = await fetch('http://127.0.0.1:8000/quizzes/score/all', {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error('Erreur de récupération des scores');
        const data = await res.json();
        setScores(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-xl">
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen px-4 sm:px-6 md:px-12 xl:px-20 py-16 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{user.username}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">{user.email}</p>
            <p className="text-md text-gray-600 dark:text-gray-400">
              Nombre total d'avis : <span className="font-semibold">{user.reviews?.length || 0}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 sm:mt-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Déconnexion
          </button>
        </div>

        <div className="mb-6 flex border-b border-gray-300 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-2 -mb-px font-semibold border-b-2 ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-indigo-600'
            }`}
          >
            Mes avis
          </button>
          <button
            onClick={() => setActiveTab('scores')}
            className={`ml-4 px-6 py-2 -mb-px font-semibold border-b-2 ${
              activeTab === 'scores'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-indigo-600'
            }`}
          >
            Mes scores
          </button>
        </div>

        {activeTab === 'reviews' && (
          <>
            {user.reviews?.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">Aucun avis pour le moment.</p>
            ) : (
              <div className="space-y-6">
                {user.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">
                        {gameTitles[review.game] || `Jeu #${review.game}`}
                      </h3>
                      <span className="text-yellow-400 font-bold">{'⭐'.repeat(review.rating)}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">{review.comment}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Posté le {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'scores' && (
          <>
            {scores.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">Aucun score enregistré pour le moment.</p>
            ) : (
              <div className="space-y-6">
                {scores.map(({ quiz_id, quiz_title, game_id, game_name, score, total }) => (
                  <div
                    key={quiz_id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 hover:shadow-md transition flex justify-between items-center"
                  >
                    <div>
                      <a
                        href={`/quizz/${game_id}`}
                        className="text-lg font-semibold text-indigo-600 hover:underline"
                      >
                        {quiz_title || `Quiz #${quiz_id}`}
                      </a>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{game_name}</p>
                    </div>
                    <p className="text-indigo-600 font-bold text-xl">
                      {score} / {total}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;