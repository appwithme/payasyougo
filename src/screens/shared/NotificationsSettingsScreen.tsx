import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { useApp } from '../../context/AppContext';
import {
  DEFAULT_NOTIFICATION_PREFS,
  NotificationPrefs,
  ensureNotificationPermission,
} from '../../services/notificationService';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme/colors';
import { type } from '../../theme/typography';

export default function NotificationsSettingsScreen({
  navigation,
}: {
  navigation: any;
}) {
  const { notificationPrefs, updateNotificationPrefs } = useApp();
  const [prefs, setPrefs] = useState<NotificationPrefs>(
    notificationPrefs || DEFAULT_NOTIFICATION_PREFS
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (notificationPrefs) setPrefs(notificationPrefs);
  }, [notificationPrefs]);

  const apply = useCallback(
    async (next: NotificationPrefs) => {
      setPrefs(next);
      setSaving(true);
      try {
        if (next.enabled) {
          const granted = await ensureNotificationPermission();
          if (!granted && Platform.OS !== 'web') {
            Alert.alert(
              'Permission needed',
              'Turn on notifications for PayAsYouGo in your device Settings to receive alerts.'
            );
          }
        }
        await updateNotificationPrefs(next);
      } finally {
        setSaving(false);
      }
    },
    [updateNotificationPrefs]
  );

  const setEnabled = (enabled: boolean) => {
    apply({ ...prefs, enabled });
  };

  const setPaymentAlerts = (paymentAlerts: boolean) => {
    apply({ ...prefs, paymentAlerts, enabled: prefs.enabled || paymentAlerts });
  };

  const setTripUpdates = (tripUpdates: boolean) => {
    apply({ ...prefs, tripUpdates, enabled: prefs.enabled || tripUpdates });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safe}>
        <Header title="Notifications" onBack={() => navigation.goBack()} />
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.lead}>
            Choose which alerts you get for payments and trips.
          </Text>

          <View style={styles.panel}>
            <ToggleRow
              title="Allow notifications"
              hint="Master switch for all alerts"
              value={prefs.enabled}
              onValueChange={setEnabled}
              disabled={saving}
            />
          </View>

          <View style={[styles.panel, !prefs.enabled && styles.panelDimmed]}>
            <Text style={styles.panelTitle}>Alerts</Text>
            <ToggleRow
              title="Payment alerts"
              hint="When a passenger pays you"
              value={prefs.enabled && prefs.paymentAlerts}
              onValueChange={setPaymentAlerts}
              disabled={saving || !prefs.enabled}
            />
            <View style={styles.rule} />
            <ToggleRow
              title="Trip updates"
              hint="When your MoMo payment succeeds"
              value={prefs.enabled && prefs.tripUpdates}
              onValueChange={setTripUpdates}
              disabled={saving || !prefs.enabled}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ToggleRow({
  title,
  hint,
  value,
  onValueChange,
  disabled,
}: {
  title: string;
  hint: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <View style={[styles.row, disabled && styles.rowDisabled]}>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.hint}>{hint}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: COLORS.borderStrong, true: COLORS.ink }}
        thumbColor={COLORS.white}
        ios_backgroundColor={COLORS.borderStrong}
      />
    </View>
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
  lead: {
    ...type.body,
    color: COLORS.textMuted,
  },
  panel: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  panelDimmed: {
    opacity: 0.55,
  },
  panelTitle: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 15,
    color: COLORS.ink,
    marginBottom: 4,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  rowDisabled: {
    opacity: 0.7,
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
});
