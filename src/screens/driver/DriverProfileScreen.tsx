import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useApp } from '../../context/AppContext';
import InkSheetScreen from '../../components/InkSheetScreen';
import UserAvatar from '../../components/UserAvatar';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme/colors';
import { type } from '../../theme/typography';
import { useTabBarPadding } from '../../navigation/FloatingTabBar';

const DriverProfileScreen = ({ navigation }: { navigation: any }) => {
  const { logout, getDriverData, updateAvatar } = useApp();
  const tabPad = useTabBarPadding();
  const driver = getDriverData();
  const canGoBack = (navigation.getState()?.index ?? 0) > 0;
  const avatar = driver?.avatar ?? null;
  const [uploading, setUploading] = useState(false);

  const handleLogout = () => {
    Alert.alert('Log out', 'Sign out of this driver account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const handleChangePhoto = () => {
    Alert.alert('Profile photo', 'Choose a photo source', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Photo library', onPress: () => pickFromLibrary() },
      { text: 'Camera', onPress: () => pickFromCamera() },
    ]);
  };

  const pickFromLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow photo access to change your profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.65,
      base64: true,
    });
    if (!result.canceled) await savePickedAsset(result.assets[0]);
  };

  const pickFromCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow camera access to take a profile picture.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.65,
      base64: true,
    });
    if (!result.canceled) await savePickedAsset(result.assets[0]);
  };

  const savePickedAsset = async (asset: ImagePicker.ImagePickerAsset) => {
    if (!asset.base64) {
      Alert.alert('Error', 'Could not read the selected image.');
      return;
    }
    const mime = asset.mimeType || 'image/jpeg';
    const dataUrl = `data:${mime};base64,${asset.base64}`;
    setUploading(true);
    const result = await updateAvatar(dataUrl);
    setUploading(false);
    if (!result.success) {
      Alert.alert('Update failed', result.error || 'Could not update photo');
    }
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < full ? 'star' : 'star-outline'}
        size={16}
        color={COLORS.primary}
      />
    ));
  };

  if (!driver) return null;

  return (
    <InkSheetScreen
      hero={
        <Animated.View entering={FadeInDown.delay(60).duration(420)} style={styles.heroBody}>
          {canGoBack ? (
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          ) : null}

          <View style={styles.heroCenter}>
            <TouchableOpacity
              onPress={handleChangePhoto}
              activeOpacity={0.9}
              disabled={uploading}
              style={styles.avatarRing}
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
            >
              <UserAvatar name={driver.name} uri={avatar} size={86} radius={28} />
              <View style={styles.cameraBadge}>
                {uploading ? (
                  <ActivityIndicator size="small" color={COLORS.ink} />
                ) : (
                  <Ionicons name="camera" size={13} color={COLORS.ink} />
                )}
              </View>
            </TouchableOpacity>
            <Text style={styles.heroName}>{driver.name}</Text>
            <Text style={styles.heroMeta}>
              {(driver.ratingCount ?? 0) > 0
                ? `Driver · ${Number(driver.rating).toFixed(1)} · ${driver.ratingCount} ratings`
                : 'Driver · No passenger ratings yet'}
            </Text>
            <View style={styles.starsRow}>{renderStars(driver.rating)}</View>

            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={() => navigation.navigate('EditProfile')}
              activeOpacity={0.85}
            >
              <Ionicons name="create-outline" size={15} color={COLORS.ink} />
              <Text style={styles.editProfileText}>Edit profile</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      }
      heroBottom={SPACING.lg}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabPad }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.delay(100).duration(420)} style={styles.panel}>
          <Text style={styles.panelTitle}>Account</Text>
          <DetailRow
            icon="id-card-outline"
            label="Driver ID"
            value={driver.id}
            onPress={() => navigation.navigate('DriverQr')}
          />
          <View style={styles.rule} />
          <DetailRow
            icon="card-outline"
            label="Ghana Card"
            value={
              driver.ghanaCardNumber
                ? `${driver.ghanaCardNumber}${driver.ghanaCardVerified ? ' · Verified' : ''}`
                : 'Not on file'
            }
          />
          <View style={styles.rule} />
          <DetailRow
            icon="document-text-outline"
            label="Driver licence"
            value={
              driver.licenseNumber
                ? `${driver.licenseNumber}${driver.licenseVerified ? ' · Verified' : ''}`
                : 'Not on file'
            }
          />
          <View style={styles.rule} />
          <DetailRow icon="call-outline" label="Phone" value={driver.phone || 'Not set'} />
          <View style={styles.rule} />
          <DetailRow icon="mail-outline" label="Email" value={driver.email || 'Not set'} />
          <View style={styles.rule} />
          <DetailRow icon="bus-outline" label="Vehicle" value={driver.vehicle || 'Not set'} />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(160).duration(420)} style={styles.actions}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.85}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="settings-outline" size={18} color={COLORS.ink} />
            </View>
            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>Settings</Text>
              <Text style={styles.actionHint}>Notifications and support</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Ionicons name="log-out-outline" size={18} color={COLORS.error} />
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </InkSheetScreen>
  );
};

function DetailRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.detailRow}
      onPress={onPress}
      activeOpacity={0.75}
      disabled={!onPress}
    >
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={16} color={COLORS.ink} />
      </View>
      <View style={styles.detailCopy}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
      {onPress ? (
        <Ionicons name="qr-code-outline" size={16} color={COLORS.textMuted} />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  heroBody: {
    marginTop: SPACING.md,
    gap: SPACING.lg,
  },
  backText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 14,
    color: COLORS.primary,
  },
  heroCenter: {
    alignItems: 'center',
    gap: 6,
  },
  avatarRing: {
    padding: 4,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: 4,
  },
  cameraBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.ink,
  },
  heroName: {
    fontFamily: 'Sora_700Bold',
    fontSize: 28,
    color: COLORS.white,
    letterSpacing: -0.8,
  },
  heroMeta: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 4,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },
  editProfileText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
    color: COLORS.ink,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
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
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCopy: { flex: 1, gap: 2, minWidth: 0 },
  detailLabel: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
    color: COLORS.textMuted,
  },
  detailValue: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
    color: COLORS.ink,
  },
  actions: { gap: 12 },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCopy: { flex: 1, gap: 2 },
  actionTitle: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 15,
    color: COLORS.ink,
  },
  actionHint: {
    ...type.caption,
    fontSize: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.errorLight,
  },
  logoutText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
    color: COLORS.error,
  },
});

export default DriverProfileScreen;
