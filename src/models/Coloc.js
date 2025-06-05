// src/models/Coloc.js
const Coloc = {
  id: null,
  name: '',
  isActive: true,
};

// Fonction pour créer un nouveau coloc
const createColoc = (name, isActive = true) => ({
  id: Date.now().toString(), // ID unique basé sur le timestamp
  name,
  isActive,
});

export { Coloc, createColoc };