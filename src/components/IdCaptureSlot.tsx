import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ImageSourcePropType,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS, SPACING, RADIUS } from '../theme/colors';
import { type } from '../theme/typography';

type Props = {
  label: string;
  side: 'Front' | 'Back';
  exampleSource: ImageSourcePropType;
  uri: string | null;
  onChange: (uri: string | null) => void;
  error?: string;
};

export default function IdCaptureSlot({
  label,
  side,
  exampleSource,
  uri,
  onChange,
  error,
}: Props) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const openLiveCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setOpen(true);
  };

  const takePhoto = async () => {
    if (!cameraRef.current || busy) return;
    setBusy(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });
      if (photo?.uri) {
        onChange(photo.uri);
        setOpen(false);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{side}</Text>

      <View style={styles.exampleCard}>
        <Image source={exampleSource} style={styles.example} resizeMode="contain" />
        <View style={styles.exampleMeta}>
          <Text style={styles.exampleBadge}>Example</Text>
          <Text style={styles.exampleHint}>
            Match this {side.toLowerCase()} layout when you capture your live photo.
          </Text>
        </View>
      </View>

      {uri ? (
        <View style={[styles.slot, styles.slotFilled, !!error && styles.slotError]}>
          <Image source={{ uri }} style={styles.captured} resizeMode="cover" />
          <View style={styles.capturedActions}>
            <TouchableOpacity
              style={styles.actionChip}
              onPress={openLiveCamera}
              accessibilityLabel="Retake photo"
            >
              <Ionicons name="camera-reverse-outline" size={16} color={COLORS.white} />
              <Text style={styles.actionChipText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionChip, styles.actionChipDanger]}
              onPress={() => onChange(null)}
              accessibilityLabel="Remove photo"
            >
              <Ionicons name="trash-outline" size={16} color={COLORS.white} />
              <Text style={styles.actionChipText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.slot, !!error && styles.slotError]}
          onPress={openLiveCamera}
          accessibilityRole="button"
          accessibilityLabel={`Open live camera for ${side.toLowerCase()} of ${label}`}
          activeOpacity={0.85}
        >
          <View style={styles.empty}>
            <View style={styles.iconCircle}>
              <Ionicons name="videocam-outline" size={22} color={COLORS.ink} />
            </View>
            <Text style={styles.emptyTitle}>Open live camera</Text>
            <Text style={styles.emptyHint}>Photograph the {side.toLowerCase()} of your card</Text>
          </View>
        </TouchableOpacity>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal visible={open} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.cameraRoot}>
          <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />

          <SafeAreaView edges={['top', 'bottom']} style={styles.cameraOverlay}>
            <View style={styles.cameraTop}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setOpen(false)}
                hitSlop={8}
              >
                <Ionicons name="close" size={22} color={COLORS.white} />
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>
                {side} · {label}
              </Text>
              <View style={{ width: 40 }} />
            </View>

            <View style={styles.guideWrap}>
              <View style={styles.exampleFloat}>
                  <Image source={exampleSource} style={styles.exampleFloatImg} resizeMode="contain" />
                <Text style={styles.exampleFloatLabel}>Example</Text>
              </View>
              <View style={styles.cardFrame} />
              <Text style={styles.guideHint}>
                Hold your real Ghana Card steady inside the frame
              </Text>
            </View>

            <View style={styles.cameraBottom}>
              {busy ? (
                <ActivityIndicator color={COLORS.white} size="large" />
              ) : (
                <TouchableOpacity
                  style={styles.shutter}
                  onPress={takePhoto}
                  accessibilityRole="button"
                  accessibilityLabel="Take photo"
                >
                  <View style={styles.shutterInner} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setOpen(false)} hitSlop={8}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: SPACING.sm },
  label: { ...type.label },
  exampleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  example: {
    width: 96,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  exampleMeta: { flex: 1, gap: 4 },
  exampleBadge: {
    ...type.caption,
    alignSelf: 'flex-start',
    color: COLORS.ink,
    fontFamily: 'DMSans_700Bold',
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  exampleHint: {
    ...type.caption,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  slot: {
    height: 160,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
  slotFilled: {
    borderStyle: 'solid',
    borderColor: COLORS.ink,
  },
  slotError: {
    borderColor: COLORS.error,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: SPACING.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: { ...type.bodyBold, color: COLORS.ink },
  emptyHint: { ...type.caption, color: COLORS.textMuted, textAlign: 'center' },
  captured: {
    width: '100%',
    height: '100%',
  },
  capturedActions: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
    flexDirection: 'row',
    gap: 8,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(21, 35, 63, 0.88)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  actionChipDanger: {
    backgroundColor: 'rgba(160, 40, 40, 0.9)',
  },
  actionChipText: {
    ...type.caption,
    color: COLORS.white,
    fontFamily: 'DMSans_700Bold',
  },
  error: {
    ...type.caption,
    color: COLORS.error,
  },
  cameraRoot: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cameraTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraTitle: {
    ...type.bodyBold,
    color: COLORS.white,
  },
  guideWrap: {
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  exampleFloat: {
    alignItems: 'center',
    gap: 4,
  },
  exampleFloatImg: {
    width: 120,
    height: 74,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  exampleFloatLabel: {
    ...type.caption,
    color: COLORS.white,
    fontFamily: 'DMSans_700Bold',
  },
  cardFrame: {
    width: '100%',
    aspectRatio: 85 / 54,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.92)',
    backgroundColor: 'transparent',
  },
  guideHint: {
    ...type.caption,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  cameraBottom: {
    alignItems: 'center',
    gap: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  shutter: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 4,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.white,
  },
  cancelText: {
    ...type.bodyBold,
    color: COLORS.white,
    paddingVertical: SPACING.sm,
  },
});
