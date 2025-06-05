// src/screens/Family.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { colors, spacing } from '../theme';
import { getColocs, saveColocs } from '../utils/storage';
import { createColoc } from '../models';

const FamilyScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { coloc: selectedColoc } = params || {};
  const { theme } = useContext(ThemeContext);
  const [colocs, setColocs] = useState([]);
  const [newColocName, setNewColocName] = useState('');

  useEffect(() => {
    const loadColocs = async () => {
      const storedColocs = await getColocs();
      setColocs(storedColocs);
    };
    loadColocs();
  }, []);

  const addColoc = async () => {
    if (newColocName) {
      const newColoc = createColoc(newColocName, true);
      const updatedColocs = [...colocs, newColoc];
      await saveColocs(updatedColocs);
      setColocs(updatedColocs);
      setNewColocName('');
      Alert.alert('Succès', 'Nouveau coloc ajouté.');
    }
  };

  const toggleActive = async (colocId) => {
    const updatedColocs = colocs.map(coloc =>
      coloc.id === colocId ? { ...coloc, isActive: !coloc.isActive } : coloc
    );
    await saveColocs(updatedColocs);
    setColocs(updatedColocs);
    Alert.alert('Succès', 'Statut mis à jour.');
  };

  const renderColocItem = ({ item }) => (
    <View style={styles.colocItem}>
      <Text style={[styles.colocName, { color: theme.text }]}>{item.name}</Text>
      <Button
        title={item.isActive ? 'Désactiver' : 'Activer'}
        onPress={() => toggleActive(item.id)}
        color={item.isActive ? '#F44336' : '#4CAF50'}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Gestion des Membres</Text>
      <View style={styles.addColoc}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]}
          value={newColocName}
          onChangeText={setNewColocName}
          placeholder="Nom du nouveau coloc"
        />
        <Button title="Ajouter" onPress={addColoc} color={theme.primary} />
      </View>
      <FlatList
        data={colocs}
        renderItem={renderColocItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.medium },
  title: { fontSize: 20, fontWeight: '700', marginBottom: spacing.medium },
  addColoc: { flexDirection: 'row', marginBottom: spacing.large },
  input: { flex: 1, borderRadius: 8, padding: spacing.small, marginRight: spacing.small },
  list: { marginTop: spacing.medium },
  colocItem: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing.small, marginBottom: spacing.small },
  colocName: { fontSize: 14 },
});

export default FamilyScreen;