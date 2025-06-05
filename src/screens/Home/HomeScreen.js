import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { colors, spacing } from '../../theme';
import { getColocs, getFactures, getContributions, saveColocs, saveFactures, saveContributions } from '../../utils/storage';
import { createColoc, createFacture, createContribution } from '../../models';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const [colocs, setColocs] = useState([]);
  const [factures, setFactures] = useState([]);
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const storedColocs = await getColocs();
      const storedFactures = await getFactures();
      const storedContributions = await getContributions();

      if (storedColocs.length === 0) {
        const newColocs = [
          createColoc('Jean Dupont', true),
          createColoc('Marie Dupont', true),
          createColoc('Pierre Dupont', true),
        ];
        await saveColocs(newColocs);
        setColocs(newColocs);
      } else {
        setColocs(storedColocs);
      }

      if (storedFactures.length === 0) {
        const newFactures = [
          createFacture('ELECTRICITE', 85.60, '2025-05-15', '2025-06-15', storedColocs[0]?.id),
          createFacture('EAUX', 62.30, '2025-05-10', '2025-06-10', storedColocs[0]?.id),
        ];
        await saveFactures(newFactures);
        setFactures(newFactures);
      } else {
        setFactures(storedFactures);
      }

      if (storedContributions.length === 0 && storedFactures.length > 0 && storedColocs.length > 0) {
        const newContributions = colocs.map((coloc, index) =>
          createContribution(storedFactures[0].id, coloc.id, (85.60 / colocs.length).toFixed(2), '2025-05-15', '2025-06-15')
        );
        await saveContributions(newContributions);
        setContributions(newContributions);
      } else {
        setContributions(storedContributions);
      }
    };
    loadData();
  }, []);

  const chefDeCloture = colocs.find(coloc => coloc.isActive) || { name: 'Aucun', role: 'Chef de Clôture', avatar: '👤' };

  const totalDays = contributions.reduce((sum, contrib) => sum + contrib.days, 0);
  const calculateShare = (billAmount, memberDays) => (totalDays > 0 ? (memberDays / totalDays) * billAmount : 0);

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
        <View style={styles.shareInfo}>
          <Text style={[styles.shareText, { color: theme.textSecondary }]}>
            Part/Membre (estimée): {calculateShare(item.amount, 30).toFixed(2)} FC
          </Text>
        </View>
      </Pressable>
    );
  };

  const renderMemberItem = ({ item }) => {
    const memberContributions = contributions.filter(contrib => contrib.colocId === item.id);
    const totalDaysPresent = memberContributions.reduce((sum, contrib) => sum + contrib.days, 0);
    return (
      <Pressable
        style={[styles.memberCard, { backgroundColor: theme.cardBackground }]}
        onPress={() => navigation.navigate('Family', { coloc: item })}
      >
        <Text style={styles.memberAvatar}>{item.avatar || '👤'}</Text>
        <View style={styles.memberInfo}>
          <Text style={[styles.memberName, { color: theme.text }]}>{item.name}</Text>
          <Text style={[styles.memberRole, { color: theme.gray }]}>Jours: {totalDaysPresent}</Text>
        </View>
      </Pressable>
    );
  };

  const changeChef = async () => {
    const activeColocs = colocs.filter(coloc => coloc.isActive);
    if (activeColocs.length > 1) {
      const currentChef = activeColocs.find(coloc => coloc.id === chefDeCloture.id);
      const nextChefIndex = (activeColocs.indexOf(currentChef) + 1) % activeColocs.length;
      const updatedColocs = colocs.map(coloc =>
        coloc.id === activeColocs[nextChefIndex].id ? { ...coloc, isActive: true } : { ...coloc, isActive: false }
      );
      await saveColocs(updatedColocs);
      setColocs(updatedColocs);
      Alert.alert('Succès', `Nouveau chef : ${activeColocs[nextChefIndex].name}`);
    } else {
      Alert.alert('Erreur', 'Pas assez de colocs actifs pour changer le chef.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.primary }]}>Tableau de Bord</Text>
        <Pressable onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle" size={28} color={theme.primary} />
        </Pressable>
      </View>
      <View style={styles.chefSection}>
        <Text style={[styles.chefTitle, { color: theme.text }]}>Chef de Clôture</Text>
        <View style={[styles.chefCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={styles.memberAvatar}>{chefDeCloture.avatar}</Text>
          <Text style={[styles.chefName, { color: theme.text }]}>{chefDeCloture.name}</Text>
          <Text style={[styles.chefRole, { color: theme.gray }]}>{chefDeCloture.role}</Text>
        </View>
        <Pressable style={styles.changeChefButton} onPress={changeChef}>
          <Text style={styles.changeChefText}>Changer le Chef</Text>
        </Pressable>
      </View>
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.statValue, { color: theme.primary }]}>{factures.length}</Text>
          <Text style={[styles.statLabel, { color: theme.gray }]}>Factures</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.statValue, { color: theme.primary }]}>
            {factures.reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)} FC
          </Text>
          <Text style={[styles.statLabel, { color: theme.gray }]}>Total</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.statValue, { color: theme.primary }]}>
            {factures.filter(bill => {
              const billContributions = contributions.filter(contrib => contrib.factureId === bill.id);
              return !billContributions.every(contrib => contrib.amount > 0);
            }).length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.gray }]}>En attente</Text>
        </View>
      </View>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Factures Récentes</Text>
          <Pressable onPress={() => navigation.navigate('Bills')}>
            <Text style={[styles.seeAll, { color: theme.primary }]}>Voir tout</Text>
          </Pressable>
        </View>
        <FlatList
          data={factures}
          renderItem={renderBillItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.billsList}
        />
      </View>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Membres de la Clôture</Text>
          <Pressable onPress={() => navigation.navigate('Family')}>
            <Text style={[styles.seeAll, { color: theme.primary }]}>Voir tout</Text>
          </Pressable>
        </View>
        <FlatList
          data={colocs}
          renderItem={renderMemberItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.membersList}
        />
      </View>
      <Pressable
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('AddBill')}
      >
        <Ionicons name="add" size={24} color={theme.background} />
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.medium },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.medium },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  chefSection: { marginBottom: spacing.medium },
  chefTitle: { fontSize: 16, fontWeight: '600', marginBottom: spacing.small },
  chefCard: { borderRadius: 10, padding: spacing.medium, alignItems: 'center' },
  chefName: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  chefRole: { fontSize: 11 },
  changeChefButton: { marginTop: spacing.small, padding: spacing.small, backgroundColor: '#E0E0E0', borderRadius: 8 },
  changeChefText: { fontSize: 12, color: '#333' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.medium },
  statCard: { borderRadius: 10, padding: spacing.small, flex: 1, marginHorizontal: spacing.small / 2, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', marginBottom: spacing.small / 2 },
  statLabel: { fontSize: 11 },
  section: { marginBottom: spacing.large },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.small },
  sectionTitle: { fontSize: 16, fontWeight: '600' },
  seeAll: { fontSize: 12 },
  billsList: { paddingRight: spacing.medium },
  billCard: { borderRadius: 10, padding: spacing.small, width: 180, marginRight: spacing.medium },
  billInfo: { marginBottom: spacing.small / 2 },
  billTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  billAmount: { fontSize: 16, fontWeight: '700' },
  billMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  billDueDate: { fontSize: 10 },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  paidBadge: { backgroundColor: '#E8F5E9' },
  unpaidBadge: { backgroundColor: '#FFEBEE' },
  statusText: { fontSize: 10, fontWeight: '500' },
  shareInfo: { marginTop: spacing.small / 2 },
  shareText: { fontSize: 10 },
  membersList: { paddingRight: spacing.medium },
  memberCard: { borderRadius: 10, padding: spacing.small, width: 120, marginRight: spacing.medium, alignItems: 'center' },
  memberAvatar: { fontSize: 28, marginBottom: spacing.small / 2 },
  memberName: { fontSize: 14, fontWeight: '600', textAlign: 'center', marginBottom: 2 },
  memberRole: { fontSize: 10, textAlign: 'center' },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
});

export default HomeScreen;