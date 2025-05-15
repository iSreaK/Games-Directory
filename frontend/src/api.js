// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// login : récupère un token JWT
export async function login(username, password) {
  const response = await API.post('token/', { username, password });
  const { access, refresh } = response.data;

  localStorage.setItem('access', access);
  localStorage.setItem('refresh', refresh);
  API.defaults.headers.common['Authorization'] = `Bearer ${access}`;
}

export async function fetchProtectedData(endpoint) {
  const access = localStorage.getItem('access');
  API.defaults.headers.common['Authorization'] = `Bearer ${access}`;
  const response = await API.get(endpoint);
  return response.data;
}