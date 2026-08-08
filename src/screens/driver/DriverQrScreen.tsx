import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { useApp } from '../../context/AppContext';
import { encodeDriverQr } from '../../utils/driverQr';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme/colors';
import { type } from '../../theme/typography';

export default function DriverQrScreen({ navigation }: { navigation: any }) {
  const { getDriverData } = useApp();
  const driver = getDriverData();

  if (!driver) return null;

  const payload = encodeDriverQr(driver.id);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
        <Header title="My QR code" onBack={() => navigation.goBack()} />

        <View style={styles.body}>
          <Text style={styles.lead}>
            Passengers scan this instead of typing your driver ID.
          </Text>

          <View style={styles.card}>
            <View style={styles.qrWrap}>
              <QRCode
                value={payload}
                size={220}
                color={COLORS.ink}
                backgroundColor={COLORS.white}
              />
            </View>
            <Text style={styles.idLabel}>Driver ID</Text>
            <Text style={styles.idValue}>{driver.id}</Text>
            <Text style={styles.name}>{driver.name}</Text>
          </View>

          <View style={styles.tip}>
            <Ionicons name="scan-outline" size={18} color={COLORS.ink} />
            <Text style={styles.tipText}>
              Keep this screen open at pickup so the passenger can scan quickly.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  safe: { flex: 1 },
  body: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    gap: SPACING.lg,
  },
  lead: {
    ...type.body,
    color: COLORS.textMuted,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  qrWrap: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginBottom: 8,
  },
  idLabel: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: COLORS.textMuted,
    marginTop: 4,
  },
  idValue: {
    fontFamily: 'Sora_700Bold',
    fontSize: 28,
    color: COLORS.ink,
    letterSpacing: 3,
  },
  name: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tipText: {
    ...type.caption,
    flex: 1,
    color: COLORS.ink,
  },
});
