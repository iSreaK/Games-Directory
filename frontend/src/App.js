// src/App.js
import React, { useState, useEffect } from 'react';
import Login from './components/login.js';
import { fetchProtectedData } from './api';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [data, setData] = useState(null);

  const handleLogin = async () => {
    setLoggedIn(true);
    try {
      const result = await fetchProtectedData('endpoint-protege/');
      setData(result);
    } catch (err) {
      console.error("Erreur lors de la récupération de l'API", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) handleLogin();
  }, []);

  return (
    <div>
      <h1>Mon App Frontend</h1>
      {!loggedIn ? (
        <Login onLoginSuccess={handleLogin} />
      ) : (
        <div>
          <h2>Données protégées :</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
