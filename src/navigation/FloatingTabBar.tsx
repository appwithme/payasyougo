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

const ROUTE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  HomeTab: 'home-outline',
  BookTab: 'add-outline',
  HistoryTab: 'receipt-outline',
  ProfileTab: 'person-outline',
  DashboardTab: 'home-outline',
  TxnTab: 'cash-outline',
  WalletTab: 'wallet-outline',
};

const SPRING = { damping: 18, stiffness: 220, mass: 0.8 };
const CIRCLE = 48;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function TabSlot({
  focused,
  iconName,
  onPress,
  onLongPress,
  accessibilityLabel,
  onLayout,
}: {
  focused: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  onLongPress: () => void;
  accessibilityLabel?: string;
  onLayout: (e: LayoutChangeEvent) => void;
}) {
  const scale = useSharedValue(1);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => {
        scale.value = withSpring(0.88, { damping: 15, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, SPRING);
      }}
      onLayout={onLayout}
      style={styles.slot}
      hitSlop={8}
    >
      <Animated.View style={[styles.iconHit, iconStyle]}>
        <Ionicons name={iconName} size={24} color="#111111" />
      </Animated.View>
    </AnimatedPressable>
  );
}

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const indicatorX = useSharedValue(0);
  const indicatorReady = useSharedValue(0);
  const slotCenters = React.useRef<number[]>([]);

  const moveIndicator = (index: number, animated: boolean) => {
    const x = slotCenters.current[index];
    if (x == null) return;
    if (animated && indicatorReady.value) {
      indicatorX.value = withSpring(x, SPRING);
    } else {
      indicatorX.value = x;
      indicatorReady.value = withTiming(1, { duration: 200 });
    }
  };

  useEffect(() => {
    moveIndicator(state.index, true);
  }, [state.index]);

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: indicatorReady.value,
    transform: [
      { translateX: indicatorX.value - CIRCLE / 2 },
      {
        scale: interpolate(indicatorReady.value, [0, 1], [0.6, 1]),
      },
    ],
  }));

  return (
    <View
      style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 16) }]}
      pointerEvents="box-none"
    >
      <Animated.View entering={FadeInUp.springify().damping(16).stiffness(140)} style={styles.pill}>
        <Animated.View style={[styles.indicator, indicatorStyle]} />

        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const iconName = ROUTE_ICONS[route.name] ?? 'ellipse-outline';

          return (
            <TabSlot
              key={route.key}
              focused={focused}
              iconName={iconName}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onLayout={(e) => {
                const { x, width } = e.nativeEvent.layout;
                slotCenters.current[index] = x + width / 2;
                if (index === state.index) {
                  moveIndicator(index, false);
                }
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
                navigation.emit({
                  type: 'tabLongPress',
                  target: route.key,
                });
              }}
            />
          );
        })}
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
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#FFFFFF',
    width: '78%',
    maxWidth: 340,
    height: 68,
    borderRadius: 34,
    paddingHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: (68 - CIRCLE) / 2,
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: COLORS.primary,
    zIndex: 0,
  },
  slot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    zIndex: 1,
  },
  iconHit: {
    width: CIRCLE,
    height: CIRCLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
