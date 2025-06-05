import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import AddBillScreen from '../screens/AddBill';
import BillDetailsScreen from '../screens/BillDetails';
import FamilyScreen from '../screens/Family';
import BillsScreen from '../screens/Bills'; // Nouveau
import ProfileScreen from '../screens/Profile'; // Nouveau
import { Text } from 'react-native';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const isOnboarded = useSelector((state) => state.onboarding.isOnboarded);

  if (isOnboarded === undefined) {
    return <Text>Chargement...</Text>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddBill" component={AddBillScreen} />
            <Stack.Screen name="BillDetails" component={BillDetailsScreen} />
            <Stack.Screen name="Family" component={FamilyScreen} />
            <Stack.Screen name="Bills" component={BillsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;