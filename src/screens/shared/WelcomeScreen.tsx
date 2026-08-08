import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import CampusRideScene from '../../components/CampusRideScene';
import { COLORS } from '../../theme/colors';

const { height: H } = Dimensions.get('window');

type Role = 'passenger' | 'driver';

export default function WelcomeScreen({ navigation }: { navigation: any }) {
  const go = (role: Role) => {
    navigation.navigate(role === 'passenger' ? 'PassengerLogin' : 'DriverLogin');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <LinearGradient
        colors={['#E8F1FA', '#D5E4F3', '#B9CEE6']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.top}>
          <Animated.View entering={FadeInDown.duration(500)}>
            <Text style={styles.brand}>
              payasyou
              <Text style={styles.brandGo}>go</Text>
            </Text>
            <Text style={styles.tagline}>Digital fares for UCC campus rides</Text>
          </Animated.View>
        </View>

        <Animated.View
          entering={FadeInUp.delay(120).duration(560)}
          style={styles.sceneWrap}
        >
          <CampusRideScene />
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(380).duration(520)}
          style={styles.ctaBlock}
        >
          <RoleButton
            label="Continue as Passenger"
            variant="primary"
            onPress={() => go('passenger')}
          />
          <RoleButton
            label="Continue as Driver"
            variant="secondary"
            onPress={() => go('driver')}
          />
          <Text style={styles.footer}>University of Cape Coast · v1.0</Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

function RoleButton({
  label,
  variant,
  onPress,
}: {
  label: string;
  variant: 'primary' | 'secondary';
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(0.98, { duration: 90 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 140 });
      }}
    >
      <Animated.View
        style={[
          styles.btn,
          variant === 'primary' ? styles.btnPrimary : styles.btnSecondary,
          pressStyle,
        ]}
      >
        <Text
          style={[
            styles.btnLabel,
            variant === 'primary' ? styles.btnLabelPrimary : styles.btnLabelSecondary,
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#D5E4F3',
  },
  safe: {
    flex: 1,
    justifyContent: 'space-between',
  },
  top: {
    paddingHorizontal: 28,
    paddingTop: H > 700 ? 18 : 8,
  },
  brand: {
    fontFamily: 'Sora_700Bold',
    fontSize: 38,
    color: COLORS.ink,
    letterSpacing: -1.5,
  },
  brandGo: {
    color: COLORS.primaryDark,
  },
  tagline: {
    marginTop: 8,
    fontFamily: 'DMSans_500Medium',
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    maxWidth: 280,
  },
  sceneWrap: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  ctaBlock: {
    paddingHorizontal: 28,
    paddingBottom: 8,
    gap: 12,
  },
  btn: {
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: COLORS.ink,
  },
  btnSecondary: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1.5,
    borderColor: 'rgba(27,43,75,0.18)',
  },
  btnLabel: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 16,
    letterSpacing: 0.1,
  },
  btnLabelPrimary: {
    color: COLORS.white,
  },
  btnLabelSecondary: {
    color: COLORS.ink,
  },
  footer: {
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
