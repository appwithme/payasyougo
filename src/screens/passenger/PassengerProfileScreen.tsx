import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import Button from '../../components/Button';
import UserAvatar from '../../components/UserAvatar';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { type } from '../../theme/typography';
import { Passenger } from '../../types';
import { useTabBarPadding } from '../../navigation/FloatingTabBar';

const PassengerProfileScreen = ({ navigation }: { navigation: any }) => {
  const { currentUser, logout, passengerTrips, updateAvatar } = useApp();
  const tabPad = useTabBarPadding();
  const passenger = currentUser as Passenger | null;
  const totalSpent = passengerTrips.reduce((sum, t) => sum + t.amount, 0);
  const [uploading, setUploading] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
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

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value?: string | null;
  }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={COLORS.ink} />
      </View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '—'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <Header title="Profile" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabPad }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <TouchableOpacity
            onPress={handleChangePhoto}
            activeOpacity={0.85}
            disabled={uploading}
            style={styles.avatarWrap}
          >
            <UserAvatar
              name={passenger?.name}
              uri={passenger?.avatar}
              size={88}
              radius={28}
            />
            <View style={styles.cameraBadge}>
              {uploading ? (
                <ActivityIndicator size="small" color={COLORS.ink} />
              ) : (
                <Ionicons name="camera" size={14} color={COLORS.ink} />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{passenger?.name}</Text>
          <Text style={styles.roleLabel}>Passenger</Text>
          <TouchableOpacity onPress={handleChangePhoto} disabled={uploading}>
            <Text style={styles.changePhoto}>
              {uploading ? 'Updating…' : 'Change photo'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{passengerTrips.length}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>GH₵{totalSpent}</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <InfoRow icon="call-outline" label="Phone" value={passenger?.phone} />
          <View style={styles.separator} />
          <InfoRow icon="mail-outline" label="Email" value={passenger?.email} />
          <View style={styles.separator} />
          <InfoRow icon="id-card-outline" label="Passenger ID" value={passenger?.id} />
        </View>

        <Button
          title="Logout"
          variant="danger"
          onPress={handleLogout}
          icon={<Ionicons name="log-out-outline" size={20} color={COLORS.error} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, gap: SPACING.xl },

  avatarSection: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatarWrap: {
    position: 'relative',
  },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  name: { ...type.title, fontSize: 22 },
  roleLabel: { ...type.caption },
  changePhoto: {
    ...type.label,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: {
    fontFamily: 'Sora_700Bold',
    fontSize: 20,
    color: COLORS.ink,
  },
  statLabel: { ...type.caption, marginTop: 4 },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },

  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: { flex: 1 },
  infoLabel: { ...type.caption },
  infoValue: { ...type.bodyBold, marginTop: 2 },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xs,
  },
});

export default PassengerProfileScreen;
