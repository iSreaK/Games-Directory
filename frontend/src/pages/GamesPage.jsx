import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Navbar from '../components/Navbar'

import AndroidIcon from '../assets/icons/android.svg'
import PlaystationIcon from '../assets/icons/playstation.svg'
import XboxIcon from '../assets/icons/xbox.svg'
import PcIcon from '../assets/icons/windows.svg'
import AppleIcon from '../assets/icons/apple.svg'
import NintendoIcon from '../assets/icons/nintendo.svg'
import iOSIcon from '../assets/icons/ios.svg'
import LinuxIcon from '../assets/icons/linux.svg'

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

const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [allGenres, setAllGenres] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/games/')
      .then(res => res.json())
      .then(data => {
        setGames(data);

        // Extraire tous les genres uniques
        const genresSet = new Set();
        data.forEach(game => game.genres.forEach(genre => genresSet.add(genre)));
        setAllGenres(['All', ...Array.from(genresSet)]);
      })
      .catch(err => console.error('Erreur lors du chargement des jeux :', err));
  }, []);

  const filteredGames = games.filter(game => {
    const matchesGenre = selectedGenre === 'All' || game.genres.includes(selectedGenre);
    const matchesSearch = game.name.toLowerCase().includes(search.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
        <div className="w-screen h-24 bg-gradient-to-r from-[#150a29] via-[#1a0f2f] to-[#0a122d] flex items-center justify-center text-white">
          <p className="text-xl font-medium">Jeux</p>
        </div>

        <div className="px-4 sm:px-6 md:px-12 xl:px-20 py-8">
          {/* Barre de filtres */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            {/* Texte à gauche */}
            <div className="w-full md:w-auto mb-2 md:mb-0">
              <span className="text-lg font-medium">Trier par :</span>
            </div>

            {/* Filtres à droite */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              {/* Sélecteur de genres */}
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-4 py-2"
              >
                {allGenres.map((genre, idx) => (
                  <option key={idx} value={genre}>{genre}</option>
                ))}
              </select>

              {/* Barre de recherche */}
              <input
                type="text"
                placeholder="Rechercher un jeu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-4 py-2 w-full sm:w-64"
              />
            </div>
          </div>

          {/* Cartes de jeux */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                onClick={() => navigate(`/games/${game.id}`)}
                className="cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-indigo-500 transition overflow-hidden"
              >
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{game.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {game.genres.join(', ')}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {game.platforms.map((platform, idx) => (
                      platformIcons[platform] ? (
                        <img
                          key={idx}
                          src={platformIcons[platform]}
                          alt={platform}
                          title={platform}
                          className="w-5 h-5 filter invert"
                        />
                      ) : (
                        <span key={idx} className="text-sm">🎲</span>
                      )
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default GamesPage;
