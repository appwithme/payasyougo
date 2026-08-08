import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DriverTabParamList, DriverDashboardStackParamList } from '../types/navigation';
import { FloatingTabBar, floatingTabScreenOptions } from './FloatingTabBar';

import DriverDashboardScreen from '../screens/driver/DriverDashboardScreen';
import TransactionHistoryScreen from '../screens/driver/TransactionHistoryScreen';
import WalletScreen from '../screens/driver/WalletScreen';
import DriverProfileScreen from '../screens/driver/DriverProfileScreen';

const Tab = createBottomTabNavigator<DriverTabParamList>();
const Stack = createNativeStackNavigator<DriverDashboardStackParamList>();

const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DriverDashboard" component={DriverDashboardScreen} />
    <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
    <Stack.Screen name="DriverProfile" component={DriverProfileScreen} />
  </Stack.Navigator>
);

const DriverNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <FloatingTabBar {...props} />}
    screenOptions={floatingTabScreenOptions}
  >
    <Tab.Screen name="DashboardTab" component={DashboardStack} />
    <Tab.Screen name="TxnTab" component={TransactionHistoryScreen} />
    <Tab.Screen name="WalletTab" component={WalletScreen} />
    <Tab.Screen name="ProfileTab" component={DriverProfileScreen} />
  </Tab.Navigator>
);

export default DriverNavigator;
