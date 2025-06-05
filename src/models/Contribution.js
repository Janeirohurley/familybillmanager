// src/models/Contribution.js
const Contribution = {
  id: null,
  factureId: null,
  colocId: null,
  amount: 0.0,
  startDate: null,
  endDate: null,
  days: 0,
};

// Fonction pour créer une nouvelle contribution
const createContribution = (factureId, colocId, amount, startDate, endDate) => {
  const contribution = {
    id: Date.now().toString(),
    factureId,
    colocId,
    amount,
    startDate: startDate ? new Date(startDate) : null,
    endDate: endDate ? new Date(endDate) : null,
    days: 0,
  };

  // Calculer le nombre de jours
  if (contribution.startDate && contribution.endDate) {
    const diffTime = Math.abs(contribution.endDate - contribution.startDate);
    contribution.days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return contribution;
};

export { Contribution, createContribution };