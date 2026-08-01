// ============================================================
// HEADER COMPONENT
// Reusable screen header for light theme
// ============================================================
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING } from '../theme/colors';

const Header = ({
  title,
  subtitle,
  onBack,
  rightComponent,
  transparent = false,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  transparent?: boolean;
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        transparent && styles.transparent,
        { paddingTop: insets.top + SPACING.sm },
      ]}
    >
      {/* Left: Back button or spacer */}
      <View style={styles.side}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Center: Title + subtitle */}
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right: Optional action */}
      <View style={styles.side}>{rightComponent || null}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  side: {
    width: 48,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
    fontWeight: '500',
  },
});

export default Header;
