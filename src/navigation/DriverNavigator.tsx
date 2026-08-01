import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { DriverTabParamList, DriverDashboardStackParamList } from '../types/navigation';
import { COLORS } from '../theme/colors';

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

const TabIcon = ({ name, focused, color, label }: { name: any; focused: boolean; color: string; label: string }) => (
  <View style={styles.tabItem}>
    <Ionicons name={name} size={22} color={color} />
    <Text style={[styles.tabLabel, { color, fontWeight: focused ? '800' : '600' }]}>{label}</Text>
    {focused && <View style={styles.tabActiveBar} />}
  </View>
);

const DriverNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarShowLabel: false,
    }}
  >
    <Tab.Screen
      name="DashboardTab"
      component={DashboardStack}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon name={focused ? 'grid' : 'grid-outline'} focused={focused} color={color} label="Home" />
        ),
        tabBarActiveTintColor: COLORS.textPrimary,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    />
    <Tab.Screen
      name="TxnTab"
      component={TransactionHistoryScreen}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon name={focused ? 'cash' : 'cash-outline'} focused={focused} color={color} label="Transactions" />
        ),
        tabBarActiveTintColor: COLORS.textPrimary,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    />
    <Tab.Screen
      name="WalletTab"
      component={WalletScreen}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon name={focused ? 'wallet' : 'wallet-outline'} focused={focused} color={color} label="Wallet" />
        ),
        tabBarActiveTintColor: COLORS.textPrimary,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={DriverProfileScreen}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} color={color} label="Profile" />
        ),
        tabBarActiveTintColor: COLORS.textPrimary,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: 68,
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    position: 'relative',
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.3,
  },
  tabActiveBar: {
    position: 'absolute',
    bottom: -8,
    width: 24,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
});

export default DriverNavigator;
