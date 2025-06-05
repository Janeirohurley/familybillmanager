// src/screens/Profile.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { colors, spacing } from '../theme';
import { getColocs } from '../utils/storage';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const colocs = await getColocs();
      const activeColoc = colocs.find(coloc => coloc.isActive);
      setUser(activeColoc || { name: 'Utilisateur inconnu', role: 'Aucun rôle' });
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Vous êtes déconnecté.', [
      { text: 'OK', onPress: () => navigation.navigate('Onboarding') },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Profil</Text>
      <View style={[styles.userInfo, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.label, { color: theme.text }]}>Nom : {user?.name}</Text>
        <Text style={[styles.label, { color: theme.text }]}>Rôle : {user?.role || 'Chef de Clôture'}</Text>
      </View>
      <Button title="Déconnexion" onPress={handleLogout} color={theme.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.medium, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: spacing.medium, textAlign: 'center' },
  userInfo: { borderRadius: 10, padding: spacing.medium, marginBottom: spacing.large },
  label: { fontSize: 14, marginBottom: spacing.small },
});

export default ProfileScreen;