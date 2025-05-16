import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Navbar from '../components/Navbar';

import AndroidIcon from '../assets/icons/android.svg';
import PlaystationIcon from '../assets/icons/playstation.svg';
import XboxIcon from '../assets/icons/xbox.svg';
import PcIcon from '../assets/icons/windows.svg';
import AppleIcon from '../assets/icons/apple.svg';
import NintendoIcon from '../assets/icons/nintendo.svg';
import iOSIcon from '../assets/icons/ios.svg';
import LinuxIcon from '../assets/icons/linux.svg';

const platformIcons = {
  PC: PcIcon,
  PlayStation: PlaystationIcon,
  Xbox: XboxIcon,
  Nintendo: NintendoIcon,
  'Apple Macintosh': AppleIcon,
  Android: AndroidIcon,
  iOS: iOSIcon,
  Linux: LinuxIcon,
};

const GameDetails = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/games/${id}/`)
      .then(res => res.json())
      .then(data => setGame(data))
      .catch(err => console.error('Erreur chargement jeu :', err));
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté pour poster un commentaire.');
      return;
    }

    if (rating === 0 || comment.trim() === '') {
      setError('Veuillez saisir une note et un commentaire.');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/reviews/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`, // Important : Token, pas Bearer
        },
        body: JSON.stringify({
          game: Number(id),
          rating,
          comment,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Erreur lors de la soumission');
      }

      const newReview = await res.json();

      // Ajouter la nouvelle review localement (game.reviews)
      setGame((prevGame) => ({
        ...prevGame,
        comments: [newReview, ...(prevGame.reviews || [])],
      }));

      setComment('');
      setRating(0);
      setSuccess('Commentaire posté avec succès !');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!game) {
    return <div className="text-center py-12 text-xl">Chargement...</div>;
  }

  const averageRating =
    game.reviews && game.reviews.length > 0
      ? (game.reviews.reduce((sum, c) => sum + c.rating, 0) / game.reviews.length).toFixed(1)
      : null;

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen px-6 py-8 text-gray-900 dark:text-gray-100">
        {/* Titre + image */}
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{game.name}</h1>
          <img
            src={game.background_image}
            alt={game.name}
            className="w-full max-h-[400px] object-cover rounded-2xl shadow mb-6"
          />

          {/* Infos principales */}
          <div className="mb-6">
            <p className="text-lg mb-2 text-gray-700 dark:text-gray-300">
              Genres : {game.genres.join(', ')}
            </p>
            <div className="flex items-center gap-2 mb-2">
              {game.platforms.map((platform, idx) =>
                platformIcons[platform] ? (
                  <img
                    key={idx}
                    src={platformIcons[platform]}
                    alt={platform}
                    title={platform}
                    className="w-6 h-6 filter invert"
                  />
                ) : (
                  <span key={idx}>🎮</span>
                )
              )}
            </div>
            <p className="text-base text-gray-600 dark:text-gray-400">
              {game.description || 'Aucune description disponible pour ce jeu.'}
            </p>
          </div>

          {/* Commentaires */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Commentaires</h2>

            {/* Note moyenne */}
            {averageRating && (
              <p className="mb-4 font-semibold text-yellow-500">⭐ Note moyenne : {averageRating} / 5</p>
            )}

            {/* Messages d'erreur ou succès */}
            {error && <p className="mb-4 text-red-600">{error}</p>}
            {success && <p className="mb-4 text-green-600">{success}</p>}

            {/* Liste des commentaires */}
            <div className="space-y-4 mb-6">
              {game.reviews?.length > 0 ? (
                game.reviews.map((c, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                    <p className="font-medium">{c.user || 'Anonyme'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{c.comment || c.text}</p>
                    <div className="text-yellow-400">Note : {c.rating}/5</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">Pas encore de commentaires.</p>
              )}
            </div>

            {/* Formulaire de commentaire */}
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Écris ton commentaire..."
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                rows={3}
                required
              />
              <div className="flex items-center gap-4">
                <label className="font-medium">Note :</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="p-2 rounded border bg-white dark:bg-gray-800"
                >
                  <option value={0}>--</option>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={rating === 0 || comment.trim() === ''}
                  className={`ml-auto px-4 py-2 rounded-xl text-white ${
                    rating === 0 || comment.trim() === ''
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameDetails;
