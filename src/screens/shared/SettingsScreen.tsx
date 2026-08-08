import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { useApp } from '../../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme/colors';
import { type } from '../../theme/typography';

type DocStatus = 'verified' | 'pending' | 'missing';

function docStatus(number?: string | null, verified?: boolean): DocStatus {
  if (!number?.trim()) return 'missing';
  return verified ? 'verified' : 'pending';
}

function statusLabel(status: DocStatus) {
  if (status === 'verified') return 'Verified';
  if (status === 'pending') return 'Pending';
  return 'Not on file';
}

function maskId(value?: string | null) {
  const raw = (value || '').trim();
  if (!raw) return '—';
  if (raw.length <= 6) return raw;
  return `${raw.slice(0, 4)}····${raw.slice(-3)}`;
}

export default function SettingsScreen({ navigation }: { navigation: any }) {
  const { userRole, getDriverData } = useApp();
  const driver = userRole === 'driver' ? getDriverData() : null;

  const ghanaStatus = docStatus(driver?.ghanaCardNumber, driver?.ghanaCardVerified);
  const licenseStatus = docStatus(driver?.licenseNumber, driver?.licenseVerified);

  const openSupport = async () => {
    const url = 'mailto:support@payasyougo.app?subject=PayAsYouGo%20support';
    const can = await Linking.canOpenURL(url);
    if (!can) {
      Alert.alert('Support', 'Email us at support@payasyougo.app');
      return;
    }
    await Linking.openURL(url);
  };

  const showDocDetails = (
    title: string,
    number: string | undefined,
    status: DocStatus
  ) => {
    const lines = [
      `Status: ${statusLabel(status)}`,
      number?.trim() ? `Number: ${number.trim()}` : 'No number on file yet.',
    ];
    if (status === 'pending') {
      lines.push('Verification is still pending review.');
    } else if (status === 'verified') {
      lines.push('This document has been verified.');
    }
    Alert.alert(title, lines.join('\n'));
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safe}>
        <Header title="Settings" onBack={() => navigation.goBack()} />
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Account</Text>
            <SettingsRow
              icon="notifications-outline"
              title="Notifications"
              hint="Payment and trip alerts"
              onPress={() => navigation.navigate('NotificationsSettings')}
            />
          </View>

          {driver ? (
            <View style={styles.panel}>
              <Text style={styles.panelTitle}>Identity documents</Text>
              <Text style={styles.panelHint}>
                Ghana Card and licence status for your driver account.
              </Text>

              <DocumentRow
                icon="card-outline"
                title="Ghana Card"
                preview={maskId(driver.ghanaCardNumber)}
                status={ghanaStatus}
                onPress={() =>
                  showDocDetails('Ghana Card', driver.ghanaCardNumber, ghanaStatus)
                }
              />
              <View style={styles.rule} />
              <DocumentRow
                icon="document-text-outline"
                title="Driver licence"
                preview={maskId(driver.licenseNumber)}
                status={licenseStatus}
                onPress={() =>
                  showDocDetails(
                    'Driver licence',
                    driver.licenseNumber,
                    licenseStatus
                  )
                }
              />
            </View>
          ) : null}

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Support</Text>
            <SettingsRow
              icon="mail-outline"
              title="Contact support"
              hint="Email the team"
              onPress={openSupport}
            />
            <View style={styles.rule} />
            <SettingsRow
              icon="information-circle-outline"
              title="About"
              hint="PayAsYouGo · UCC campus rides"
              onPress={() =>
                Alert.alert(
                  'PayAsYouGo',
                  'Campus MoMo payments for UCC routes. Pay as you go, ride with confidence.'
                )
              }
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function DocumentRow({
  icon,
  title,
  preview,
  status,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  preview: string;
  status: DocStatus;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={18} color={COLORS.ink} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.hint}>{preview}</Text>
      </View>
      <StatusPill status={status} />
      <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
}

function StatusPill({ status }: { status: DocStatus }) {
  const tone =
    status === 'verified'
      ? styles.pillVerified
      : status === 'pending'
        ? styles.pillPending
        : styles.pillMissing;
  const textTone =
    status === 'verified'
      ? styles.pillTextVerified
      : status === 'pending'
        ? styles.pillTextPending
        : styles.pillTextMissing;

  return (
    <View style={[styles.pill, tone]}>
      <Text style={[styles.pillText, textTone]}>{statusLabel(status)}</Text>
    </View>
  );
}

function SettingsRow({
  icon,
  title,
  hint,
  onPress,
  disabled,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  hint: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.row, disabled && styles.rowDisabled]}
      onPress={onPress}
      activeOpacity={0.75}
      disabled={disabled || !onPress}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={18} color={COLORS.ink} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.hint}>{hint}</Text>
      </View>
      {!disabled ? (
        <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },
  panel: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  panelTitle: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 15,
    color: COLORS.ink,
    marginBottom: 4,
  },
  panelHint: {
    ...type.caption,
    fontSize: 12,
    marginBottom: 6,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
    marginLeft: 48,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  rowDisabled: {
    opacity: 0.45,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2, minWidth: 0 },
  title: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 15,
    color: COLORS.ink,
  },
  hint: {
    ...type.caption,
    fontSize: 12,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pillVerified: {
    backgroundColor: COLORS.successLight,
  },
  pillPending: {
    backgroundColor: COLORS.primaryMuted,
  },
  pillMissing: {
    backgroundColor: COLORS.surfaceAlt,
  },
  pillText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 0.2,
  },
  pillTextVerified: {
    color: COLORS.success,
  },
  pillTextPending: {
    color: COLORS.warning,
  },
  pillTextMissing: {
    color: COLORS.textMuted,
  },
});
