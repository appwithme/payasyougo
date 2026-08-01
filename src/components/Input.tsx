// ============================================================
// INPUT COMPONENT
// ============================================================
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING, RADIUS, SHADOW } from '../theme/colors';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  iconName,
  error,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  style,
  autoCapitalize = 'sentences',
}: {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: any;
  secureTextEntry?: boolean;
  iconName?: any;
  error?: string;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: any;
  autoCapitalize?: any;
}) => {
  const [focused, setFocused] = useState(false);
  const [hideText, setHideText] = useState(secureTextEntry);

  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.container,
          focused && styles.focused,
          error && styles.errored,
          !editable && styles.disabled,
        ]}
      >
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={focused ? COLORS.textPrimary : COLORS.textMuted}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[styles.input, multiline && styles.multiline]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={hideText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoCapitalize={autoCapitalize}
        />

        {secureTextEntry && (
          <TouchableOpacity onPress={() => setHideText(p => !p)}>
            <Ionicons
              name={hideText ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    minHeight: 56,
    ...SHADOW.sm,
  },
  focused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
    ...SHADOW.md,
  },
  errored: {
    borderColor: COLORS.error,
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: COLORS.surfaceAlt,
  },
  leftIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.base,
    fontWeight: '500',
    paddingVertical: SPACING.sm,
  },
  multiline: {
    textAlignVertical: 'top',
    paddingTop: SPACING.sm,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
});

export default Input;
