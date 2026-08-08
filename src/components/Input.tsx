import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../theme/colors';
import { type, FONTS } from '../theme/typography';

type Props = {
  label?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  error?: string;
  style?: ViewStyle;
} & TextInputProps;

export default function Input({
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
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);
  const [hideText, setHideText] = useState(secureTextEntry);

  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.container,
          focused && styles.focused,
          !!error && styles.errored,
          !editable && styles.disabled,
        ]}
      >
        {iconName ? (
          <Ionicons
            name={iconName}
            size={20}
            color={focused ? COLORS.ink : COLORS.textMuted}
            style={styles.leftIcon}
          />
        ) : null}

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
          {...rest}
        />

        {secureTextEntry ? (
          <TouchableOpacity onPress={() => setHideText((p) => !p)} hitSlop={8}>
            <Ionicons
              name={hideText ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: SPACING.md },
  label: { ...type.label, marginBottom: SPACING.xs },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    minHeight: 56,
  },
  focused: {
    borderColor: COLORS.primaryDark,
    backgroundColor: COLORS.white,
  },
  errored: { borderColor: COLORS.error },
  disabled: { opacity: 0.6, backgroundColor: COLORS.surfaceAlt },
  leftIcon: { marginRight: SPACING.sm },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
    fontFamily: FONTS.bodyMedium,
    paddingVertical: SPACING.sm,
  },
  multiline: { textAlignVertical: 'top', paddingTop: SPACING.sm },
  errorText: {
    ...type.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
});
