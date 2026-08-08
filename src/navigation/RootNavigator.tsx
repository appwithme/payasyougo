import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { COLORS } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';

import OnboardingScreen from '../screens/shared/OnboardingScreen';
import WelcomeScreen from '../screens/shared/WelcomeScreen';
import PassengerSignupScreen from '../screens/passenger/PassengerSignupScreen';
import PassengerLoginScreen from '../screens/passenger/PassengerLoginScreen';
import DriverLoginScreen from '../screens/driver/DriverLoginScreen';
import DriverSignupScreen from '../screens/driver/DriverSignupScreen';

import PassengerNavigator from './PassengerNavigator';
import DriverNavigator from './DriverNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

type Props = {
  initialRouteName?: keyof RootStackParamList;
};

const RootNavigator = ({ initialRouteName = 'Welcome' }: Props) => {
  const { userRole, bootstrapping } = useApp();

  if (bootstrapping) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={COLORS.ink} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
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
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
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

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});

export default RootNavigator;
