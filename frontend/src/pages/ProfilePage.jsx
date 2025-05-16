import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [gameTitles, setGameTitles] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/auth');
      return;
    }

    fetch('http://127.0.0.1:8000/users/me/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur de récupération des données utilisateur');
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
        // Une fois l'utilisateur chargé, on récupère les jeux
        fetchGameTitles(data.reviews);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  const fetchGameTitles = async (reviews) => {
    const titles = {};
    for (const review of reviews) {
      const gameId = review.game;
      if (!titles[gameId]) {
        try {
          const res = await fetch(`http://127.0.0.1:8000/games/${gameId}/`);
          if (res.ok) {
            const gameData = await res.json();
            titles[gameId] = gameData.title;
          } else {
            titles[gameId] = `Jeu #${gameId}`;
          }
        } catch (err) {
          titles[gameId] = `Jeu #${gameId}`;
        }
      }
    }
    setGameTitles(titles);
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
        {/* Profil utilisateur */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 mb-10">
          <h1 className="text-4xl font-bold mb-2">{user.username}</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">{user.email}</p>
          <p className="text-md text-gray-600 dark:text-gray-400">
            Nombre total d'avis : <span className="font-semibold">{user.reviews?.length || 0}</span>
          </p>
        </div>

        {/* Avis */}
        <h2 className="text-2xl font-semibold mb-4">Mes avis</h2>
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
      </div>
    </div>
  );
};

export default ProfilePage;
