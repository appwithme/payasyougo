import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { PassengerTabParamList, PassengerHomeStackParamList } from '../types/navigation';
import { COLORS } from '../theme/colors';

import PassengerDashboardScreen from '../screens/passenger/PassengerDashboardScreen';
import BookTripScreen from '../screens/passenger/BookTripScreen';
import EnterDriverIdScreen from '../screens/passenger/EnterDriverIdScreen';
import ConfirmTripScreen from '../screens/passenger/ConfirmTripScreen';
import PaymentSuccessScreen from '../screens/passenger/PaymentSuccessScreen';
import TripHistoryScreen from '../screens/passenger/TripHistoryScreen';
import PassengerProfileScreen from '../screens/passenger/PassengerProfileScreen';

const Tab = createBottomTabNavigator<PassengerTabParamList>();
const Stack = createNativeStackNavigator<PassengerHomeStackParamList>();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PassengerDashboard" component={PassengerDashboardScreen} />
    <Stack.Screen name="BookTrip" component={BookTripScreen} />
    <Stack.Screen name="EnterDriverId" component={EnterDriverIdScreen} />
    <Stack.Screen name="ConfirmTrip" component={ConfirmTripScreen} />
    <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
    <Stack.Screen name="TripHistory" component={TripHistoryScreen} />
    <Stack.Screen name="PassengerProfile" component={PassengerProfileScreen} />
  </Stack.Navigator>
);

const HistoryStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TripHistory" component={TripHistoryScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PassengerProfile" component={PassengerProfileScreen} />
  </Stack.Navigator>
);

const TabIcon = ({ name, focused, color, label }: { name: any; focused: boolean; color: string; label: string }) => (
  <View style={styles.tabItem}>
    <Ionicons name={name} size={22} color={color} />
    <Text style={[styles.tabLabel, { color, fontWeight: focused ? '800' : '600' }]}>{label}</Text>
    {focused && <View style={styles.tabActiveBar} />}
  </View>
);

const PassengerNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarShowLabel: false,
    }}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeStack}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} color={color} label="Home" />
        ),
        tabBarActiveTintColor: COLORS.textPrimary,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    />
    <Tab.Screen
      name="BookTab"
      component={BookTripScreen}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon name={focused ? 'add-circle' : 'add-circle-outline'} focused={focused} color={color} label="Book" />
        ),
        tabBarActiveTintColor: COLORS.textPrimary,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    />
    <Tab.Screen
      name="HistoryTab"
      component={HistoryStack}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon name={focused ? 'receipt' : 'receipt-outline'} focused={focused} color={color} label="History" />
        ),
        tabBarActiveTintColor: COLORS.textPrimary,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileStack}
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

export default PassengerNavigator;
