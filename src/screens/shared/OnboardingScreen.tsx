import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import BrandMark from '../../components/BrandMark';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { type } from '../../theme/typography';

const { width } = Dimensions.get('window');

/** Bump version so existing Expo Go installs see onboarding again after redesign */
export const ONBOARDING_KEY = 'payasyougo_onboarding_v3';

const SLIDES: {
  key: string;
  title: string;
  body: string;
  image: ImageSourcePropType;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    key: 'pay',
    title: 'Pay your fare\nin seconds',
    body: 'Skip hunting for change. Pick a campus route and pay the driver with Mobile Money.',
    image: require('../../../assets/brand/onboarding-pay.png'),
    icon: 'flash-outline',
  },
  {
    key: 'wallet',
    title: 'Drivers see\nevery cedi',
    body: 'Wallet balance and today’s earnings update the moment a passenger confirms payment.',
    image: require('../../../assets/brand/onboarding-wallet.png'),
    icon: 'wallet-outline',
  },
  {
    key: 'routes',
    title: 'Built for\nUCC routes',
    body: 'Science, Casford, Ayensu, Valco — fixed fares for the routes you actually ride.',
    image: require('../../../assets/brand/onboarding-routes.png'),
    icon: 'map-outline',
  },
];

type Props = { navigation: any };

export default function OnboardingScreen({ navigation }: Props) {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const finish = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    navigation.replace('Welcome');
  };

  const next = () => {
    if (index < SLIDES.length - 1) {
      const nextIndex = index + 1;
      listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setIndex(nextIndex);
    } else {
      finish();
    }
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <BrandMark size={28} />
          <Text style={styles.brand}>
            payasyou<Text style={styles.brandAccent}>go</Text>
          </Text>
        </View>
        {index < SLIDES.length - 1 ? (
          <Button title="Skip" onPress={finish} variant="ghost" style={styles.skip} />
        ) : (
          <View style={styles.skipPlaceholder} />
        )}
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.imageFrame}>
              <Image source={item.image} style={styles.image} resizeMode="cover" />
              <View style={styles.iconChip}>
                <Ionicons name={item.icon} size={18} color={COLORS.ink} />
              </View>
            </View>

            <Animated.View entering={FadeInDown.duration(400)} style={styles.copy}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
            </Animated.View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((s, i) => (
            <View key={s.key} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>

        <Button
          title={index === SLIDES.length - 1 ? 'Get started' : 'Continue'}
          onPress={next}
          variant="ink"
          icon={
            <Ionicons
              name={index === SLIDES.length - 1 ? 'arrow-forward' : 'chevron-forward'}
              size={18}
              color={COLORS.white}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#EAF3FA' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brand: {
    fontFamily: 'Sora_700Bold',
    fontSize: 16,
    color: '#152033',
    letterSpacing: -0.4,
    textTransform: 'lowercase',
  },
  brandAccent: { color: COLORS.primaryDark },
  skip: { minHeight: 40, paddingVertical: 8, paddingHorizontal: 12 },
  skipPlaceholder: { width: 64 },

  slide: {
    width,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  imageFrame: {
    height: width * 0.92,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: COLORS.backgroundAlt,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  iconChip: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    marginTop: SPACING.lg,
    paddingRight: SPACING.md,
  },
  title: {
    ...type.title,
    fontSize: 30,
    lineHeight: 36,
  },
  body: {
    ...type.body,
    marginTop: SPACING.sm,
  },

  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: SPACING.md,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.borderStrong,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.ink,
  },
});
