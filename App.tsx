import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreenNative from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import * as ExpoLinking from 'expo-linking';
import {
  useFonts,
  Sora_600SemiBold,
  Sora_700Bold,
} from '@expo-google-fonts/sora';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider } from './src/context/AppContext';
import RootNavigator from './src/navigation/RootNavigator';
import AnimatedSplash from './src/screens/shared/SplashScreen';
import { ONBOARDING_KEY } from './src/screens/shared/OnboardingScreen';

SplashScreenNative.preventAutoHideAsync().catch(() => undefined);

type BootRoute = 'Onboarding' | 'Welcome';

function AppShell({ initialRoute }: { initialRoute: BootRoute }) {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  const linking = {
    prefixes: [ExpoLinking.createURL('/'), 'payasyougo://', 'exp://'],
    config: {
      screens: {
        Onboarding: 'onboarding',
        Welcome: 'welcome',
        PassengerLogin: 'passenger-login',
        PassengerSignup: 'passenger-signup',
        DriverLogin: 'driver-login',
        DriverSignup: 'driver-signup',
        PassengerApp: {
          path: 'passenger',
          screens: {
            HomeTab: {
              path: 'home',
              screens: {
                PassengerDashboard: 'dashboard',
                BookTrip: 'book',
                EnterDriverId: 'enter-driver',
                ScanDriverQr: 'scan-qr',
                ConfirmTrip: 'confirm',
                PaymentSuccess: 'success',
                TripHistory: 'history',
                PassengerProfile: 'profile',
                EditProfile: 'edit-profile',
                Settings: 'settings',
                NotificationsSettings: 'notifications',
              },
            },
            BookTab: 'book-tab',
            HistoryTab: 'history-tab',
            ProfileTab: 'profile-tab',
          },
        },
        DriverApp: {
          path: 'driver',
          screens: {
            DashboardTab: {
              path: 'home',
              screens: {
                DriverDashboard: 'dashboard',
                DriverQr: 'qr',
                DriverProfile: 'profile',
                EditProfile: 'edit-profile',
                Settings: 'settings',
                NotificationsSettings: 'notifications',
                TransactionHistory: 'txns',
              },
            },
            TxnTab: 'txns',
            WalletTab: 'wallet',
            ProfileTab: 'profile-tab',
          },
        },
      },
    },
  };

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <StatusBar style="dark" />
      <RootNavigator initialRouteName={initialRoute} />
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Sora_600SemiBold,
    Sora_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  const [initialRoute, setInitialRoute] = useState<BootRoute | null>(null);
  const [phase, setPhase] = useState<'loading' | 'splash' | 'app'>('loading');
  const nativeHidden = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const done = await AsyncStorage.getItem(ONBOARDING_KEY);
        setInitialRoute(done === 'true' ? 'Welcome' : 'Onboarding');
      } catch {
        setInitialRoute('Onboarding');
      }
    })();
  }, []);

  useEffect(() => {
    if (fontsLoaded && initialRoute && phase === 'loading') {
      setPhase('splash');
    }
  }, [fontsLoaded, initialRoute, phase]);

  const hideNativeSplash = useCallback(async () => {
    if (nativeHidden.current) return;
    nativeHidden.current = true;
    try {
      await SplashScreenNative.hideAsync();
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (phase === 'splash' || phase === 'app') {
      const t = setTimeout(() => {
        hideNativeSplash();
      }, 50);
      return () => clearTimeout(t);
    }
  }, [phase, hideNativeSplash]);

  if (phase === 'loading' || !initialRoute) {
    return <View style={styles.boot} />;
  }

  if (phase === 'splash') {
    return (
      <View style={styles.boot}>
        <AnimatedSplash
          onFinish={() => {
            setPhase('app');
          }}
        />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AppProvider>
          <AppShell initialRoute={initialRoute} />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  boot: { flex: 1, backgroundColor: '#EEF3F9' },
});
