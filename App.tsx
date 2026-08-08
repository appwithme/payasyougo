import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreenNative from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
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
import SplashScreen from './src/screens/shared/SplashScreen';
import { ONBOARDING_KEY } from './src/screens/shared/OnboardingScreen';
import { COLORS } from './src/theme/colors';

SplashScreenNative.preventAutoHideAsync().catch(() => undefined);

export default function App() {
  const [fontsLoaded] = useFonts({
    Sora_600SemiBold,
    Sora_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  const [showSplash, setShowSplash] = useState(true);
  const [initialRoute, setInitialRoute] = useState<'Onboarding' | 'Welcome' | null>(null);

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

  const onLayoutReady = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreenNative.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !initialRoute) {
    return <View style={styles.boot} onLayout={onLayoutReady} />;
  }

  if (showSplash) {
    return (
      <View style={styles.boot} onLayout={onLayoutReady}>
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root} onLayout={onLayoutReady}>
      <SafeAreaProvider>
        <AppProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <RootNavigator initialRouteName={initialRoute} />
          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  boot: { flex: 1, backgroundColor: COLORS.background },
});
