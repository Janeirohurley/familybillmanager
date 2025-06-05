// src/screens/AddBill.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { colors, spacing } from '../theme';
import { getColocs, getFactures, saveFactures, saveContributions } from '../utils/storage';
import { createFacture, createContribution, FactureType } from '../models';

const AddBillScreen = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const [type, setType] = useState(FactureType.EAUX);
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleAddBill = async () => {
    if (!amount || !startDate || !endDate) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    const colocs = await getColocs();
    const newFacture = createFacture(type, parseFloat(amount), startDate, endDate, colocs[0]?.id);
    await saveFactures([...(await getFactures()), newFacture]);

    const newContributions = colocs.map(coloc =>
      createContribution(newFacture.id, coloc.id, (parseFloat(amount) / colocs.length).toFixed(2), startDate, endDate)
    );
    await saveContributions([...(await getContributions()), ...newContributions]);

    Alert.alert('Succès', 'Facture ajoutée avec succès.');
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.label, { color: theme.text }]}>Type de Facture</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]}
        value={type}
        onChangeText={setType}
        placeholder="EAUX, ELECTRICITE, ou TOUTENSEMBLE"
      />
      <Text style={[styles.label, { color: theme.text }]}>Montant (FC)</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="Entrez le montant"
      />
      <Text style={[styles.label, { color: theme.text }]}>Date de Début (AAAA-MM-JJ)</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]}
        value={startDate}
        onChangeText={setStartDate}
        placeholder="Ex: 2025-06-01"
      />
      <Text style={[styles.label, { color: theme.text }]}>Date de Fin (AAAA-MM-JJ)</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]}
        value={endDate}
        onChangeText={setEndDate}
        placeholder="Ex: 2025-06-30"
      />
      <Button title="Ajouter Facture" onPress={handleAddBill} color={theme.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.medium, justifyContent: 'center' },
  label: { fontSize: 14, marginBottom: spacing.small },
  input: { borderRadius: 8, padding: spacing.small, marginBottom: spacing.medium, fontSize: 14 },
});

export default AddBillScreen;