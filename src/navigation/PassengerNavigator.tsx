import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PassengerTabParamList, PassengerHomeStackParamList } from '../types/navigation';
import { FloatingTabBar, floatingTabScreenOptions } from './FloatingTabBar';

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

const PassengerNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <FloatingTabBar {...props} />}
    screenOptions={floatingTabScreenOptions}
  >
    <Tab.Screen name="HomeTab" component={HomeStack} />
    <Tab.Screen name="BookTab" component={BookTripScreen} />
    <Tab.Screen name="HistoryTab" component={HistoryStack} />
    <Tab.Screen name="ProfileTab" component={ProfileStack} />
  </Tab.Navigator>
);

export default PassengerNavigator;
