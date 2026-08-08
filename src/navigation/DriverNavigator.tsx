import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DriverTabParamList, DriverDashboardStackParamList } from '../types/navigation';
import { FloatingTabBar, floatingTabScreenOptions } from './FloatingTabBar';

import DriverDashboardScreen from '../screens/driver/DriverDashboardScreen';
import TransactionHistoryScreen from '../screens/driver/TransactionHistoryScreen';
import WalletScreen from '../screens/driver/WalletScreen';
import DriverProfileScreen from '../screens/driver/DriverProfileScreen';
import EditProfileScreen from '../screens/shared/EditProfileScreen';
import SettingsScreen from '../screens/shared/SettingsScreen';
import NotificationsSettingsScreen from '../screens/shared/NotificationsSettingsScreen';

const Tab = createBottomTabNavigator<DriverTabParamList>();
const Stack = createNativeStackNavigator<DriverDashboardStackParamList>();
const ProfileStackNav = createNativeStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DriverDashboard" component={DriverDashboardScreen} />
    <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
    <Stack.Screen name="DriverProfile" component={DriverProfileScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="NotificationsSettings" component={NotificationsSettingsScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <ProfileStackNav.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStackNav.Screen name="DriverProfile" component={DriverProfileScreen} />
    <ProfileStackNav.Screen name="EditProfile" component={EditProfileScreen} />
    <ProfileStackNav.Screen name="Settings" component={SettingsScreen} />
    <ProfileStackNav.Screen
      name="NotificationsSettings"
      component={NotificationsSettingsScreen}
    />
  </ProfileStackNav.Navigator>
);

const DriverNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <FloatingTabBar {...props} />}
    screenOptions={floatingTabScreenOptions}
  >
    <Tab.Screen name="DashboardTab" component={DashboardStack} />
    <Tab.Screen name="TxnTab" component={TransactionHistoryScreen} />
    <Tab.Screen name="WalletTab" component={WalletScreen} />
    <Tab.Screen name="ProfileTab" component={ProfileStack} />
  </Tab.Navigator>
);

export default DriverNavigator;
