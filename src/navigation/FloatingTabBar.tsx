import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, Platform, LayoutChangeEvent } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeInUp,
  interpolate,
} from 'react-native-reanimated';
import { COLORS } from '../theme/colors';

const BAR_H = 72;
const CIRCLE = 56;
const CUTOUT = 70;
const SPRING = { damping: 16, stiffness: 180, mass: 0.85 };

/** Visible height of the floating pill + bump (excludes safe-area inset). */
export const FLOATING_TAB_BAR_CONTENT_HEIGHT = BAR_H + CIRCLE / 2;

/** Bottom padding so scroll/content clears the absolute floating tab bar. */
export function useTabBarPadding(extra = 24) {
  const insets = useSafeAreaInsets();
  return FLOATING_TAB_BAR_CONTENT_HEIGHT + Math.max(insets.bottom, 14) + extra;
}

function isNestedPastRoot(state: BottomTabBarProps['state']) {
  const tab = state.routes[state.index];
  const nested = tab?.state as { index?: number } | undefined;
  return typeof nested?.index === 'number' && nested.index > 0;
}

type IconPair = {
  outline: keyof typeof Ionicons.glyphMap;
  solid: keyof typeof Ionicons.glyphMap;
  label: string;
};

const ROUTE_META: Record<string, IconPair> = {
  HomeTab: { outline: 'home-outline', solid: 'home', label: 'Home' },
  BookTab: { outline: 'navigate-outline', solid: 'navigate', label: 'Book' },
  HistoryTab: { outline: 'receipt-outline', solid: 'receipt', label: 'History' },
  ProfileTab: { outline: 'person-outline', solid: 'person', label: 'Profile' },
  DashboardTab: { outline: 'home-outline', solid: 'home', label: 'Home' },
  TxnTab: { outline: 'cash-outline', solid: 'cash', label: 'Pay' },
  WalletTab: { outline: 'wallet-outline', solid: 'wallet', label: 'Wallet' },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function TabSlot({
  focused,
  meta,
  onPress,
  onLongPress,
  accessibilityLabel,
  onLayout,
}: {
  focused: boolean;
  meta: IconPair;
  onPress: () => void;
  onLongPress: () => void;
  accessibilityLabel?: string;
  onLayout: (e: LayoutChangeEvent) => void;
}) {
  const press = useSharedValue(1);
  const active = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    active.value = withTiming(focused ? 1 : 0, { duration: 220 });
  }, [focused]);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: press.value }],
  }));

  const inactiveIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(active.value, [0, 1], [1, 0]),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: active.value,
    transform: [{ translateY: interpolate(active.value, [0, 1], [6, 0]) }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={accessibilityLabel ?? meta.label}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => {
        press.value = withSpring(0.9, { damping: 14, stiffness: 400 });
      }}
      onPressOut={() => {
        press.value = withSpring(1, SPRING);
      }}
      onLayout={onLayout}
      style={styles.slot}
      hitSlop={6}
    >
      <Animated.View style={[styles.slotInner, pressStyle]}>
        <Animated.View style={[styles.inactiveIcon, inactiveIconStyle]}>
          <Ionicons name={meta.outline} size={24} color={COLORS.ink} />
        </Animated.View>
        <Animated.Text style={[styles.label, labelStyle]} numberOfLines={1}>
          {meta.label}
        </Animated.Text>
      </Animated.View>
    </AnimatedPressable>
  );
}

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const indicatorX = useSharedValue(0);
  const ready = useSharedValue(0);
  const centers = React.useRef<number[]>([]);
  const activeRoute = state.routes[state.index]?.name;
  const activeMeta = ROUTE_META[activeRoute] ?? ROUTE_META.HomeTab;
  const hideBar = isNestedPastRoot(state);

  const moveTo = (index: number, animated: boolean) => {
    const x = centers.current[index];
    if (x == null) return;
    if (animated && ready.value) {
      indicatorX.value = withSpring(x, SPRING);
    } else {
      indicatorX.value = x;
      ready.value = withTiming(1, { duration: 180 });
    }
  };

  useEffect(() => {
    moveTo(state.index, true);
  }, [state.index]);

  const cutoutStyle = useAnimatedStyle(() => ({
    opacity: ready.value,
    transform: [{ translateX: indicatorX.value - CUTOUT / 2 }],
  }));

  const circleStyle = useAnimatedStyle(() => ({
    opacity: ready.value,
    transform: [
      { translateX: indicatorX.value - CIRCLE / 2 },
      { scale: interpolate(ready.value, [0, 1], [0.75, 1]) },
    ],
  }));

  if (hideBar) {
    return null;
  }

  return (
    <View
      style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 14) }]}
      pointerEvents="box-none"
    >
      <Animated.View
        entering={FadeInUp.springify().damping(15).stiffness(130)}
        style={styles.shell}
      >
        <View style={styles.bar}>
          <Animated.View style={[styles.cutout, cutoutStyle]} pointerEvents="none" />

          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const { options } = descriptors[route.key];
            const meta = ROUTE_META[route.name] ?? {
              outline: 'ellipse-outline' as const,
              solid: 'ellipse' as const,
              label: route.name,
            };

            return (
              <TabSlot
                key={route.key}
                focused={focused}
                meta={meta}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onLayout={(e) => {
                  const { x, width } = e.nativeEvent.layout;
                  centers.current[index] = x + width / 2;
                  if (index === state.index) moveTo(index, false);
                }}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!focused && !event.defaultPrevented) {
                    navigation.navigate(route.name, route.params);
                  }
                }}
                onLongPress={() => {
                  navigation.emit({ type: 'tabLongPress', target: route.key });
                }}
              />
            );
          })}
        </View>

        <Animated.View style={[styles.activeCircle, circleStyle]} pointerEvents="none">
          <Ionicons name={activeMeta.solid} size={24} color="#FFFFFF" />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

export const floatingTabScreenOptions = {
  headerShown: false,
  tabBarShowLabel: false,
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  shell: {
    width: '88%',
    maxWidth: 400,
    height: BAR_H + CIRCLE / 2,
    justifyContent: 'flex-end',
  },
  bar: {
    height: BAR_H,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#1B2B4B',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
      },
      android: { elevation: 12 },
    }),
  },
  cutout: {
    position: 'absolute',
    top: -(CUTOUT / 2) + 2,
    left: 0,
    width: CUTOUT,
    height: CUTOUT,
    borderRadius: CUTOUT / 2,
    backgroundColor: COLORS.background,
    zIndex: 1,
  },
  activeCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: COLORS.ink,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#1B2B4B',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.28,
        shadowRadius: 10,
      },
      android: { elevation: 10 },
    }),
  },
  slot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    zIndex: 2,
  },
  slotInner: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    width: '100%',
  },
  inactiveIcon: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    bottom: 0,
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    color: COLORS.ink,
    letterSpacing: 0.1,
  },
});
