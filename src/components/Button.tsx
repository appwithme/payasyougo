// ============================================================
// BUTTON COMPONENT
// Variants: 'primary' | 'secondary' | 'ghost' | 'danger'
// ============================================================
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { COLORS, FONT_SIZE, SPACING, RADIUS, SHADOW } from '../theme/colors';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: any;
  textStyle?: any;
  icon?: React.ReactNode;
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.82}
      style={[
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? COLORS.textPrimary : COLORS.primary}
          size="small"
        />
      ) : (
        <View style={styles.row}>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text style={[styles.baseText, styles[`${variant}Text`], textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    marginRight: SPACING.sm,
  },

  // Variants
  primary: {
    backgroundColor: COLORS.primary,
    ...SHADOW.md,
  },
  secondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: COLORS.errorLight,
  },

  // Text styles per variant
  baseText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  primaryText: {
    color: COLORS.textPrimary, // High contrast on Yellow
  },
  secondaryText: {
    color: COLORS.textPrimary,
  },
  ghostText: {
    color: COLORS.textPrimary,
  },
  dangerText: {
    color: COLORS.error,
  },

  disabled: {
    opacity: 0.5,
  },
});

export default Button;
