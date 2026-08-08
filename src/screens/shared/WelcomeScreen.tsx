import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { COLORS } from '../../theme/colors';

const { height: H } = Dimensions.get('window');

const HERO_STILL = require('../../../assets/brand/onboarding-pay.png');
const HERO_VIDEO = require('../../../assets/brand/onboarding-pay.mp4');

type Role = 'passenger' | 'driver';

export default function WelcomeScreen({ navigation }: { navigation: any }) {
  const player = useVideoPlayer(HERO_VIDEO, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  useEffect(() => {
    player.muted = true;
    player.loop = true;
    player.play();
  }, [player]);

  const go = (role: Role) => {
    navigation.navigate(role === 'passenger' ? 'PassengerLogin' : 'DriverLogin');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <View style={styles.hero}>
        <Image source={HERO_STILL} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        <VideoView
          player={player}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          nativeControls={false}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />

        <LinearGradient
          colors={[
            'rgba(18,28,48,0.15)',
            'rgba(18,28,48,0.05)',
            'rgba(18,28,48,0.55)',
            'rgba(18,28,48,0.92)',
          ]}
          locations={[0, 0.35, 0.7, 1]}
          style={StyleSheet.absoluteFill}
        />

        <SafeAreaView style={styles.heroSafe} edges={['top']}>
          <Animated.View entering={FadeIn.duration(600)} style={styles.brandRow}>
            <Text style={styles.brand}>
              payasyou
              <Text style={styles.brandGo}>go</Text>
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(160).duration(520)}
            style={styles.heroCopy}
          >
            <Text style={styles.headline}>Campus rides,{'\n'}paid in seconds</Text>
            <Text style={styles.subhead}>
              Book a UCC route and settle fares with MoMo — no cash hunt.
            </Text>
          </Animated.View>
        </SafeAreaView>
      </View>

      <Animated.View
        entering={FadeInUp.delay(220).duration(520)}
        style={styles.sheet}
      >
        <SafeAreaView edges={['bottom']} style={styles.sheetInner}>
          <Text style={styles.sheetLabel}>Get started</Text>

          <RoleOption
            title="Passenger"
            subtitle="Find a route and pay your driver"
            icon="person-outline"
            onPress={() => go('passenger')}
          />
          <RoleOption
            title="Driver"
            subtitle="Collect fares and track earnings"
            icon="directions-car"
            onPress={() => go('driver')}
          />

          <Text style={styles.footer}>University of Cape Coast</Text>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

function RoleOption({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialIcons.glyphMap;
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
        scale.value = withTiming(0.985, { duration: 90 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 140 });
      }}
    >
      <Animated.View style={[styles.option, pressStyle]}>
        <View style={styles.optionIcon}>
          <MaterialIcons name={icon} size={24} color={COLORS.ink} />
        </View>
        <View style={styles.optionCopy}>
          <Text style={styles.optionTitle}>{title}</Text>
          <Text style={styles.optionSubtitle}>{subtitle}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={COLORS.textMuted} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.ink,
  },
  hero: {
    flex: 1,
    minHeight: H * 0.52,
    overflow: 'hidden',
  },
  heroSafe: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  brandRow: {
    paddingTop: 8,
  },
  brand: {
    fontFamily: 'Sora_700Bold',
    fontSize: 28,
    color: COLORS.white,
    letterSpacing: -1,
  },
  brandGo: {
    color: COLORS.primary,
  },
  heroCopy: {
    gap: 10,
    paddingBottom: 8,
  },
  headline: {
    fontFamily: 'Sora_700Bold',
    fontSize: 34,
    lineHeight: 40,
    color: COLORS.white,
    letterSpacing: -1.2,
  },
  subhead: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.78)',
    maxWidth: 300,
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    paddingTop: 22,
    paddingHorizontal: 20,
  },
  sheetInner: {
    gap: 10,
    paddingBottom: 8,
  },
  sheetLabel: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: COLORS.textMuted,
    marginBottom: 6,
    marginLeft: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionCopy: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'Sora_700Bold',
    fontSize: 17,
    color: COLORS.ink,
    letterSpacing: -0.3,
  },
  optionSubtitle: {
    marginTop: 2,
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textSecondary,
  },
  footer: {
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
