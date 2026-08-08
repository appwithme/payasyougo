import React, { useRef } from 'react';
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
  /** Once someone has signed in this session, logout should never reopen onboarding. */
  const hasAuthenticated = useRef(false);
  if (userRole) hasAuthenticated.current = true;

  if (bootstrapping) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={COLORS.ink} />
      </View>
    );
  }

  // Cold start: App picks Onboarding vs Welcome from AsyncStorage.
  // After logout: always Welcome — onboarding is first-launch only.
  const resolvedInitial: keyof RootStackParamList =
    userRole === 'passenger'
      ? 'PassengerApp'
      : userRole === 'driver'
        ? 'DriverApp'
        : hasAuthenticated.current
          ? 'Welcome'
          : initialRouteName === 'PassengerApp' || initialRouteName === 'DriverApp'
            ? 'Welcome'
            : initialRouteName;

  return (
    <Stack.Navigator
      key={userRole ?? `guest-${resolvedInitial}`}
      initialRouteName={resolvedInitial}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      {userRole === 'passenger' ? (
        <Stack.Screen name="PassengerApp" component={PassengerNavigator} />
      ) : null}

      {userRole === 'driver' ? (
        <Stack.Screen name="DriverApp" component={DriverNavigator} />
      ) : null}

      {userRole == null ? (
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="PassengerSignup" component={PassengerSignupScreen} />
          <Stack.Screen name="PassengerLogin" component={PassengerLoginScreen} />
          <Stack.Screen name="DriverLogin" component={DriverLoginScreen} />
          <Stack.Screen name="DriverSignup" component={DriverSignupScreen} />
        </>
      ) : null}
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
