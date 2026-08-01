import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { COLORS } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';

import WelcomeScreen from '../screens/shared/WelcomeScreen';
import PassengerSignupScreen from '../screens/passenger/PassengerSignupScreen';
import PassengerLoginScreen from '../screens/passenger/PassengerLoginScreen';
import DriverLoginScreen from '../screens/driver/DriverLoginScreen';
import DriverSignupScreen from '../screens/driver/DriverSignupScreen';

import PassengerNavigator from './PassengerNavigator';
import DriverNavigator from './DriverNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { userRole } = useApp();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      {userRole === 'passenger' ? (
        <Stack.Screen name="PassengerApp" component={PassengerNavigator} />
      ) : userRole === 'driver' ? (
        <Stack.Screen name="DriverApp" component={DriverNavigator} />
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="PassengerSignup" component={PassengerSignupScreen} />
          <Stack.Screen name="PassengerLogin" component={PassengerLoginScreen} />
          <Stack.Screen name="DriverLogin" component={DriverLoginScreen} />
          <Stack.Screen name="DriverSignup" component={DriverSignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
