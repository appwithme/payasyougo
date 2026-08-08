import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useApp } from '../../context/AppContext';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { type } from '../../theme/typography';

export default function EditProfileScreen({ navigation }: { navigation: any }) {
  const { currentUser, updateProfile } = useApp();
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [saving, setSaving] = useState(false);
  const email = currentUser?.email?.trim() || '';

  const handleSave = async () => {
    const name = fullName.trim();
    if (name.length < 2) {
      Alert.alert('Name required', 'Enter your full name (at least 2 characters).');
      return;
    }

    const nextPhone = phone.trim();
    if (nextPhone && nextPhone.replace(/\D/g, '').length < 9) {
      Alert.alert('Invalid phone', 'Enter a valid Ghana phone number or leave it blank.');
      return;
    }

    setSaving(true);
    const result = await updateProfile({
      fullName: name,
      phone: nextPhone,
    });
    setSaving(false);

    if (!result.success) {
      Alert.alert('Could not save', result.error || 'Try again.');
      return;
    }

    Alert.alert('Saved', 'Your profile was updated.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safe}>
        <Header title="Edit profile" onBack={() => navigation.goBack()} />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.lead}>
              Update your name and phone number.
            </Text>

            <View style={styles.form}>
              <Input
                label="Full name"
                iconName="person-outline"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                placeholder="Your name"
              />
              <Input
                label="Phone"
                iconName="call-outline"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="e.g. 0550000111"
              />
              <Input
                label="Email"
                iconName="mail-outline"
                value={email || 'Not set'}
                editable={false}
                placeholder="Email"
              />
            </View>

            <Button title="Save changes" onPress={handleSave} loading={saving} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },
  lead: {
    ...type.body,
    color: COLORS.textMuted,
  },
  form: {
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
