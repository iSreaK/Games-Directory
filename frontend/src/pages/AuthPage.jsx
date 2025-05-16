import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Base URL sans endpoint
  const API_URL = 'http://127.0.0.1:8000/users/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const endpoint = isLogin ? 'login/' : 'signup/';

      // IMPORTANT : si login, on envoie username et password, sinon email, username, password
      const payload = isLogin
        ? { username, password }
        : { email, username, password };

      const res = await fetch(API_URL + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Erreur d\'authentification');
      }

      const data = await res.json();

      // Sauvegarde du token dans localStorage (adapter selon ta réponse API)
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="bg-gray-800 rounded-xl shadow-lg w-full max-w-md">
        {/* Onglets connexion / inscription */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 text-center font-bold text-white transition-colors
              ${isLogin ? 'border-b-4 border-indigo-500 bg-gray-900' : 'hover:bg-gray-700'}`}
          >
            Connexion
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 text-center font-bold text-white transition-colors
              ${!isLogin ? 'border-b-4 border-indigo-500 bg-gray-900' : 'hover:bg-gray-700'}`}
          >
            Inscription
          </button>
        </div>

        {/* Formulaire */}
        <div className="p-8 text-white">
          <h2 className="text-3xl font-extrabold mb-8 text-center">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h2>

          {error && (
            <div className="mb-6 p-3 bg-red-700 rounded text-center font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-indigo-500"
                required
              />
            )}
            {!isLogin && (
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-indigo-500"
                required
              />
            )}
            {isLogin && (
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-indigo-500"
                required
              />
            )}
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-indigo-500"
              required
            />

            <button
              type="submit"
              disabled={
                isLogin
                  ? !(username && password)
                  : !(email && username && password)
              }
              className={`w-full py-3 rounded font-bold text-white transition-colors
                ${
                  (isLogin
                    ? !(username && password)
                    : !(email && username && password))
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
            >
              {isLogin ? 'Se connecter' : "S'inscrire"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
