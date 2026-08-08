import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme/colors';
import { type } from '../theme/typography';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'ink';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: Props) {
  const isDisabled = disabled || loading;
  const spinnerColor =
    variant === 'ink' || variant === 'primary' ? COLORS.white : COLORS.ink;
  // primary button is yellow — use ink spinner there
  const resolvedSpinner =
    variant === 'primary' ? COLORS.ink : spinnerColor;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={[styles.base, styles[variant], isDisabled && styles.disabled, style]}
    >
      {loading ? (
        <View style={styles.row}>
          <ActivityIndicator color={resolvedSpinner} size="small" />
          {!!title && (
            <Text
              style={[
                styles.baseText,
                styles[`${variant}Text` as const],
                styles.loadingText,
                textStyle,
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.row}>
          {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
          <Text style={[styles.baseText, styles[`${variant}Text` as const], textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { marginRight: SPACING.sm },
  loadingText: { marginLeft: SPACING.sm, maxWidth: '85%' },

  primary: {
    backgroundColor: COLORS.primary,
    ...SHADOW.sm,
  },
  ink: {
    backgroundColor: COLORS.ink,
    ...SHADOW.sm,
  },
  secondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.borderStrong,
  },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: COLORS.errorLight },

  baseText: { ...type.button },
  primaryText: { color: COLORS.ink },
  inkText: { color: COLORS.white },
  secondaryText: { color: COLORS.ink },
  ghostText: { color: COLORS.ink },
  dangerText: { color: COLORS.error },

  disabled: { opacity: 0.45 },
});
