import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../theme/colors';
import { type } from '../theme/typography';

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
      <View style={styles.side}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={22} color={COLORS.ink} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

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
  transparent: { backgroundColor: 'transparent' },
  side: { width: 48, alignItems: 'center' },
  center: { flex: 1, alignItems: 'center' },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: { ...type.subheading, fontSize: 17 },
  subtitle: { ...type.caption, marginTop: 2 },
});

export default Header;
