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
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme/colors';
import { type } from '../../theme/typography';

export default function SettingsScreen({ navigation }: { navigation: any }) {
  const openSupport = async () => {
    const url = 'mailto:support@payasyougo.app?subject=PayAsYouGo%20support';
    const can = await Linking.canOpenURL(url);
    if (!can) {
      Alert.alert('Support', 'Email us at support@payasyougo.app');
      return;
    }
    await Linking.openURL(url);
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
              hint="Coming soon"
              disabled
            />
          </View>

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
});
