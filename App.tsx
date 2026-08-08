import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
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
import {
  enableShotMode,
  isShotMode,
  setPendingShot,
} from './src/dev/shotTour';
import { useShotTour } from './src/dev/useShotTour';

SplashScreenNative.preventAutoHideAsync().catch(() => undefined);

type BootRoute = 'Onboarding' | 'Welcome';

function parseShotId(url: string | null): string | null {
  if (!url) return null;
  const match =
    url.match(/[?&/]shot[/:=]([^/&#?]+)/i) || url.match(/shot\/([^/&#?]+)/i);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function AppShell({ initialRoute }: { initialRoute: BootRoute }) {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  useShotTour(navigationRef);

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
    async getInitialURL() {
      const url = await Linking.getInitialURL();
      const shot = parseShotId(url);
      if (shot) {
        enableShotMode();
        setPendingShot(shot);
      }
      return url;
    },
    subscribe(listener: (url: string) => void) {
      const sub = Linking.addEventListener('url', ({ url }) => {
        const shot = parseShotId(url);
        if (shot) {
          enableShotMode();
          setPendingShot(shot);
        }
        listener(url);
      });
      return () => sub.remove();
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
        const url = await Linking.getInitialURL();
        const shot = parseShotId(url);
        if (shot) {
          enableShotMode();
          setPendingShot(shot);
          await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
          setInitialRoute('Welcome');
          return;
        }
        const done = await AsyncStorage.getItem(ONBOARDING_KEY);
        setInitialRoute(done === 'true' ? 'Welcome' : 'Onboarding');
      } catch {
        setInitialRoute('Onboarding');
      }
    })();
  }, []);

  useEffect(() => {
    if (fontsLoaded && initialRoute && phase === 'loading') {
      setPhase(isShotMode() ? 'app' : 'splash');
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
