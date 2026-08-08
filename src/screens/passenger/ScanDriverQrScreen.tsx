import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { parseDriverQr } from '../../utils/driverQr';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { type } from '../../theme/typography';

export default function ScanDriverQrScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { from, to, fare, routeId } = route.params || {};
  const [permission, requestPermission] = useCameraPermissions();
  const [locked, setLocked] = useState(false);

  const onScanned = useCallback(
    ({ data }: { data: string }) => {
      if (locked) return;
      const driverId = parseDriverQr(data);
      if (!driverId) {
        setLocked(true);
        Alert.alert(
          'Not a PayAsYouGo driver QR',
          'Ask the driver to open My QR code in their app.',
          [{ text: 'Scan again', onPress: () => setLocked(false) }]
        );
        return;
      }

      setLocked(true);
      navigation.replace('EnterDriverId', {
        from,
        to,
        fare,
        routeId,
        prefillDriverId: driverId,
      });
    },
    [locked, navigation, from, to, fare, routeId]
  );

  if (!permission) {
    return <View style={styles.root} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
          <Header title="Scan driver QR" onBack={() => navigation.goBack()} />
          <View style={styles.permBody}>
            <Ionicons name="camera-outline" size={48} color={COLORS.ink} />
            <Text style={styles.permTitle}>Camera access needed</Text>
            <Text style={styles.permBodyText}>
              Allow camera so you can scan the driver’s PayAsYouGo QR code.
            </Text>
            <Button title="Allow camera" onPress={requestPermission} />
            <Button
              title="Type driver ID instead"
              variant="ghost"
              onPress={() => navigation.goBack()}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={locked ? undefined : onScanned}
      />

      <SafeAreaView edges={['top', 'bottom']} style={styles.overlay}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => navigation.goBack()}
            hitSlop={8}
          >
            <Ionicons name="close" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Scan driver QR</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.frameWrap}>
          <View style={styles.frame} />
          <Text style={styles.hint}>Align the driver’s QR inside the box</Text>
        </View>

        <Button
          title="Type ID instead"
          variant="secondary"
          onPress={() => navigation.goBack()}
          style={styles.altBtn}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.ink },
  safe: { flex: 1, backgroundColor: COLORS.background },
  permBody: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    gap: SPACING.md,
    alignItems: 'center',
  },
  permTitle: {
    fontFamily: 'Sora_700Bold',
    fontSize: 22,
    color: COLORS.ink,
    textAlign: 'center',
  },
  permBodyText: {
    ...type.body,
    textAlign: 'center',
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 16,
    color: COLORS.white,
  },
  frameWrap: {
    alignItems: 'center',
    gap: 16,
  },
  frame: {
    width: 240,
    height: 240,
    borderRadius: RADIUS.lg,
    borderWidth: 3,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  hint: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  altBtn: {
    alignSelf: 'stretch',
  },
});
