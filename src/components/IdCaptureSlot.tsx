import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
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
  const pick = () => {
    Alert.alert(`${side} of ${label}`, 'Choose how to add this side', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Photo library', onPress: () => fromLibrary() },
      { text: 'Camera', onPress: () => fromCamera() },
      ...(uri
        ? [{ text: 'Remove', style: 'destructive' as const, onPress: () => onChange(null) }]
        : []),
    ]);
  };

  const fromLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow photo access to upload your Ghana Card.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [85, 54],
      quality: 0.75,
    });
    if (!result.canceled && result.assets[0]?.uri) onChange(result.assets[0].uri);
  };

  const fromCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow camera access to photograph your Ghana Card.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [85, 54],
      quality: 0.75,
    });
    if (!result.canceled && result.assets[0]?.uri) onChange(result.assets[0].uri);
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{side}</Text>

      <View style={styles.exampleRow}>
        <Image source={exampleSource} style={styles.example} resizeMode="cover" />
        <Text style={styles.exampleHint}>Example · match this layout</Text>
      </View>

      <TouchableOpacity
        style={[styles.slot, !!error && styles.slotError, !!uri && styles.slotFilled]}
        onPress={pick}
        accessibilityRole="button"
        accessibilityLabel={`Capture ${side.toLowerCase()} of ${label}`}
        activeOpacity={0.85}
      >
        {uri ? (
          <>
            <Image source={{ uri }} style={styles.captured} resizeMode="cover" />
            <View style={styles.capturedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.white} />
              <Text style={styles.capturedBadgeText}>Captured</Text>
            </View>
          </>
        ) : (
          <View style={styles.empty}>
            <View style={styles.iconCircle}>
              <Ionicons name="camera-outline" size={22} color={COLORS.ink} />
            </View>
            <Text style={styles.emptyTitle}>Capture {side.toLowerCase()}</Text>
            <Text style={styles.emptyHint}>Camera or photo library</Text>
          </View>
        )}
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: SPACING.sm },
  label: { ...type.label },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  example: {
    width: 72,
    height: 46,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt,
  },
  exampleHint: {
    ...type.caption,
    color: COLORS.textMuted,
    flex: 1,
  },
  slot: {
    height: 148,
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
  emptyHint: { ...type.caption, color: COLORS.textMuted },
  captured: {
    width: '100%',
    height: '100%',
  },
  capturedBadge: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(21, 35, 63, 0.88)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  capturedBadgeText: {
    ...type.caption,
    color: COLORS.white,
    fontFamily: 'DMSans_700Bold',
  },
  error: {
    ...type.caption,
    color: COLORS.error,
  },
});
