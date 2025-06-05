// src/models/Facture.js
const FactureType = {
  EAUX: 'EAUX',
  ELECTRICITE: 'ELECTRICITE',
  TOUTENSEMBLE: 'TOUTENSEMBLE',
};

const Facture = {
  id: null,
  type: FactureType.EAUX,
  amount: 0.0,
  startDate: null,
  endDate: null,
  createdBy: null,
};

// Fonction pour créer une nouvelle facture
const createFacture = (type, amount, startDate, endDate, createdBy) => ({
  id: Date.now().toString(),
  type,
  amount,
  startDate: startDate ? new Date(startDate) : null,
  endDate: endDate ? new Date(endDate) : null,
  createdBy,
});

export { Facture, FactureType, createFacture };