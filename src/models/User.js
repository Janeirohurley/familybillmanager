// src/models/User.js
const User = {
  id: null,
  username: '',
  password: '',
  role: '',
};

// Fonction pour créer un nouvel utilisateur
const createUser = (username, password, role) => ({
  id: Date.now().toString(),
  username,
  password,
  role,
});

export { User, createUser };