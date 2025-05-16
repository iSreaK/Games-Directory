import React from 'react';
import { useNavigate } from 'react-router';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav
      className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow px-4 sm:px-6 md:px-12 xl:px-20 py-8
       flex justify-between items-center z-50"
      style={{ height: '60px' }}
    >
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        className="text-2xl font-bold cursor-pointer text-gray-800 dark:text-gray-100"
      >
        🎮 GameHub
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate('/games')}
          className="text-gray-800 dark:text-gray-100 hover:underline text-lg"
        >
          Games
        </button>

        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-1 text-gray-800 dark:text-gray-100 hover:text-indigo-500 transition"
          title="Connexion / Inscription"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.121 17.804A11.953 11.953 0 0012 20c2.21 0 4.26-.635 5.879-1.716M15 10a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
