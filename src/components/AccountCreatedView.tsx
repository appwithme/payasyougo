import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import Button from './Button';
import { COLORS, SPACING, RADIUS } from '../theme/colors';
import { type } from '../theme/typography';

type Props = {
  role: 'driver' | 'passenger';
  name?: string;
  phone?: string;
  onGoToLogin: () => void;
};

export default function AccountCreatedView({ role, name, phone, onGoToLogin }: Props) {
  const title = role === 'driver' ? 'Driver account created' : 'Account created';
  const body =
    role === 'driver'
      ? 'Your driver account is ready. Sign in with your phone and password to open the portal.'
      : 'Your passenger account is ready. Sign in with your phone and password to start booking.';

  return (
    <View style={styles.root}>
      <Animated.View entering={ZoomIn.duration(380)} style={styles.iconWrap}>
        <Ionicons name="checkmark-circle" size={64} color={COLORS.success} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).duration(360)} style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </Animated.View>

      {(name || phone) && (
        <Animated.View entering={FadeInDown.delay(140).duration(360)} style={styles.card}>
          {!!name && <Text style={styles.cardName}>{name}</Text>}
          {!!phone && <Text style={styles.cardPhone}>{phone}</Text>}
        </Animated.View>
      )}

      <Animated.View entering={FadeInDown.delay(200).duration(360)} style={styles.actions}>
        <Button title="Go to login" variant="ink" onPress={onGoToLogin} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
    gap: SPACING.lg,
  },
  iconWrap: {
    alignSelf: 'center',
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: COLORS.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { gap: SPACING.sm, alignItems: 'center' },
  title: {
    ...type.title,
    textAlign: 'center',
  },
  body: {
    ...type.body,
    textAlign: 'center',
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.md,
    lineHeight: 22,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: 4,
    alignItems: 'center',
  },
  cardName: {
    ...type.bodyBold,
    color: COLORS.ink,
  },
  cardPhone: {
    ...type.caption,
    color: COLORS.textMuted,
  },
  actions: {
    marginTop: SPACING.md,
  },
});
