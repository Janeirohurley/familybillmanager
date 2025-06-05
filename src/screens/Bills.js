// src/screens/Bills.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { colors, spacing } from '../theme';
import { getFactures, getContributions } from '../utils/storage';

const BillsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const [factures, setFactures] = useState([]);
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const storedFactures = await getFactures();
      const storedContributions = await getContributions();
      setFactures(storedFactures);
      setContributions(storedContributions);
    };
    loadData();
  }, []);

  const renderBillItem = ({ item }) => {
    const billContributions = contributions.filter(contrib => contrib.factureId === item.id);
    const billPaid = billContributions.every(contrib => contrib.amount > 0);
    return (
      <Pressable
        style={[styles.billCard, { backgroundColor: theme.cardBackground }]}
        onPress={() => navigation.navigate('BillDetails', { bill: item, contributions: billContributions })}
      >
        <View style={styles.billInfo}>
          <Text style={[styles.billTitle, { color: theme.text }]}>{item.type}</Text>
          <Text style={[styles.billAmount, { color: theme.primary }]}>{item.amount} FC</Text>
        </View>
        <View style={styles.billMeta}>
          <Text style={[styles.billDueDate, { color: theme.gray }]}>Échéance: {item.endDate?.toISOString().split('T')[0]}</Text>
          <View style={[styles.statusBadge, billPaid ? styles.paidBadge : styles.unpaidBadge]}>
            <Text style={[styles.statusText, { color: billPaid ? '#4CAF50' : '#F44336' }]}>
              {billPaid ? 'Payé' : 'En attente'}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Toutes les Factures</Text>
      <FlatList
        data={factures}
        renderItem={renderBillItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.billsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.medium },
  title: { fontSize: 20, fontWeight: '700', marginBottom: spacing.medium },
  billsList: { paddingBottom: spacing.medium },
  billCard: { borderRadius: 10, padding: spacing.small, marginBottom: spacing.medium },
  billInfo: { marginBottom: spacing.small / 2 },
  billTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  billAmount: { fontSize: 16, fontWeight: '700' },
  billMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  billDueDate: { fontSize: 10 },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  paidBadge: { backgroundColor: '#E8F5E9' },
  unpaidBadge: { backgroundColor: '#FFEBEE' },
  statusText: { fontSize: 10, fontWeight: '500' },
});

export default BillsScreen;