// src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  COLOCS: 'colocs',
  CONTRIBUTIONS: 'contributions',
  FACTURES: 'factures',
  USERS: 'users',
};

// Fonction générique pour sauvegarder une liste d'éléments
const saveItems = async (key, items) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
  }
};

// Fonction générique pour récupérer une liste d'éléments
const getItems = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Erreur lors de la récupération de ${key}:`, error);
    return [];
  }
};

// Fonctions spécifiques pour chaque modèle
const saveColocs = (colocs) => saveItems(STORAGE_KEYS.COLOCS, colocs);
const getColocs = () => getItems(STORAGE_KEYS.COLOCS);

const saveContributions = (contributions) => saveItems(STORAGE_KEYS.CONTRIBUTIONS, contributions);
const getContributions = () => getItems(STORAGE_KEYS.CONTRIBUTIONS);

const saveFactures = (factures) => saveItems(STORAGE_KEYS.FACTURES, factures);
const getFactures = () => getItems(STORAGE_KEYS.FACTURES);

const saveUsers = (users) => saveItems(STORAGE_KEYS.USERS, users);
const getUsers = () => getItems(STORAGE_KEYS.USERS);

export {
  saveColocs,
  getColocs,
  saveContributions,
  getContributions,
  saveFactures,
  getFactures,
  saveUsers,
  getUsers,
};