// src/screens/BillDetails.js
import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { colors, spacing } from '../theme';
import { getContributions, saveContributions } from '../utils/storage';

const BillDetailsScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { bill, contributions: initialContributions } = params;
  const { theme } = useContext(ThemeContext);
  const [contributions, setContributions] = useState(initialContributions);

  const updateContribution = async (contribId, newAmount) => {
    const updatedContributions = contributions.map(contrib =>
      contrib.id === contribId ? { ...contrib, amount: parseFloat(newAmount) || 0 } : contrib
    );
    await saveContributions(updatedContributions);
    setContributions(updatedContributions);
    Alert.alert('Succès', 'Contribution mise à jour.');
  };

  const markAsPaid = async () => {
    const allPaid = contributions.every(contrib => contrib.amount > 0);
    if (allPaid) {
      Alert.alert('Succès', 'Facture marquée comme payée.');
      navigation.goBack();
    } else {
      Alert.alert('Erreur', 'Tous les montants doivent être remplis.');
    }
  };

  const renderContributionItem = ({ item }) => (
    <View style={styles.contributionItem}>
      <Text style={[styles.contributionText, { color: theme.text }]}>{item.colocId}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]}
        value={item.amount.toString()}
        onChangeText={(text) => updateContribution(item.id, text)}
        keyboardType="numeric"
        placeholder="Montant"
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{bill.type}</Text>
      <Text style={[styles.amount, { color: theme.primary }]}>{bill.amount} FC</Text>
      <Text style={[styles.date, { color: theme.gray }]}>Du {bill.startDate?.toISOString().split('T')[0]} au {bill.endDate?.toISOString().split('T')[0]}</Text>
      <FlatList
        data={contributions}
        renderItem={renderContributionItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
      <Button title="Marquer comme Payée" onPress={markAsPaid} color={theme.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.medium },
  title: { fontSize: 20, fontWeight: '700', marginBottom: spacing.small },
  amount: { fontSize: 18, fontWeight: '600', marginBottom: spacing.small },
  date: { fontSize: 12, marginBottom: spacing.medium },
  list: { marginBottom: spacing.large },
  contributionItem: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing.small, marginBottom: spacing.small },
  contributionText: { fontSize: 14 },
  input: { borderRadius: 8, padding: spacing.small, width: 100 },
});

export default BillDetailsScreen;