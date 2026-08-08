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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { type } from '../../theme/typography';

const { width } = Dimensions.get('window');
const ONBOARDING_KEY = 'payasyougo_onboarding_done';

const SLIDES = [
  {
    key: 'pay',
    title: 'Pay your fare\nin seconds',
    body: 'Skip the change hunt. Select your campus route and pay drivers with Mobile Money.',
    image: require('../../../assets/brand/onboarding-pay.png'),
    icon: 'flash-outline' as const,
  },
  {
    key: 'wallet',
    title: 'Drivers see\nevery cedi',
    body: 'Wallet balance, today’s earnings, and trip history update the moment a passenger pays.',
    image: require('../../../assets/brand/onboarding-wallet.png'),
    icon: 'wallet-outline' as const,
  },
  {
    key: 'routes',
    title: 'Built for\nUCC routes',
    body: 'Science, Casford, Ayensu, Valco — fixed fares for the routes you actually ride.',
    image: require('../../../assets/brand/onboarding-routes.png'),
    icon: 'map-outline' as const,
  },
];

type Props = {
  navigation: any;
};

export default function OnboardingScreen({ navigation }: Props) {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const finish = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    navigation.replace('Welcome');
  };

  const next = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
      setIndex(index + 1);
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
          <View style={styles.miniLogo}>
            <Image
              source={require('../../../assets/icon.png')}
              style={styles.miniLogoImg}
            />
          </View>
          <Text style={styles.brand}>PayAsYouGo</Text>
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
              <View style={styles.imageScrim} />
              <View style={styles.iconChip}>
                <Ionicons name={item.icon} size={18} color={COLORS.ink} />
              </View>
            </View>

            <Animated.View entering={FadeInDown.duration(420)} style={styles.copy}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
            </Animated.View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((s, i) => (
            <View
              key={s.key}
              style={[styles.dot, i === index && styles.dotActive]}
            />
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

export { ONBOARDING_KEY };

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  miniLogo: {
    width: 32,
    height: 32,
    borderRadius: 9,
    overflow: 'hidden',
  },
  miniLogoImg: { width: '100%', height: '100%' },
  brand: { ...type.subheading, fontSize: 16 },
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
  imageScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,249,240,0.04)',
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
