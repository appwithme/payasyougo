import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  PassengerTabParamList,
  PassengerHomeStackParamList,
  PassengerBookStackParamList,
} from '../types/navigation';
import { FloatingTabBar, floatingTabScreenOptions } from './FloatingTabBar';

import PassengerDashboardScreen from '../screens/passenger/PassengerDashboardScreen';
import BookTripScreen from '../screens/passenger/BookTripScreen';
import EnterDriverIdScreen from '../screens/passenger/EnterDriverIdScreen';
import ConfirmTripScreen from '../screens/passenger/ConfirmTripScreen';
import PaymentSuccessScreen from '../screens/passenger/PaymentSuccessScreen';
import TripHistoryScreen from '../screens/passenger/TripHistoryScreen';
import PassengerProfileScreen from '../screens/passenger/PassengerProfileScreen';

const Tab = createBottomTabNavigator<PassengerTabParamList>();
const HomeStackNav = createNativeStackNavigator<PassengerHomeStackParamList>();
const BookStackNav = createNativeStackNavigator<PassengerBookStackParamList>();
const HistoryStackNav = createNativeStackNavigator();
const ProfileStackNav = createNativeStackNavigator();

const bookingScreens = (
  <>
    <BookStackNav.Screen name="BookTrip" component={BookTripScreen} />
    <BookStackNav.Screen name="EnterDriverId" component={EnterDriverIdScreen} />
    <BookStackNav.Screen name="ConfirmTrip" component={ConfirmTripScreen} />
    <BookStackNav.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
  </>
);

const HomeStack = () => (
  <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
    <HomeStackNav.Screen name="PassengerDashboard" component={PassengerDashboardScreen} />
    <HomeStackNav.Screen name="BookTrip" component={BookTripScreen} />
    <HomeStackNav.Screen name="EnterDriverId" component={EnterDriverIdScreen} />
    <HomeStackNav.Screen name="ConfirmTrip" component={ConfirmTripScreen} />
    <HomeStackNav.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
    <HomeStackNav.Screen name="TripHistory" component={TripHistoryScreen} />
    <HomeStackNav.Screen name="PassengerProfile" component={PassengerProfileScreen} />
  </HomeStackNav.Navigator>
);

const BookStack = () => (
  <BookStackNav.Navigator screenOptions={{ headerShown: false }}>
    {bookingScreens}
  </BookStackNav.Navigator>
);

const HistoryStack = () => (
  <HistoryStackNav.Navigator screenOptions={{ headerShown: false }}>
    <HistoryStackNav.Screen name="TripHistory" component={TripHistoryScreen} />
  </HistoryStackNav.Navigator>
);

const ProfileStack = () => (
  <ProfileStackNav.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStackNav.Screen name="PassengerProfile" component={PassengerProfileScreen} />
  </ProfileStackNav.Navigator>
);

const PassengerNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <FloatingTabBar {...props} />}
    screenOptions={floatingTabScreenOptions}
  >
    <Tab.Screen name="HomeTab" component={HomeStack} />
    <Tab.Screen name="BookTab" component={BookStack} />
    <Tab.Screen name="HistoryTab" component={HistoryStack} />
    <Tab.Screen name="ProfileTab" component={ProfileStack} />
  </Tab.Navigator>
);

export default PassengerNavigator;
