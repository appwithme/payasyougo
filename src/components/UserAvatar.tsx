import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../theme/colors';

type Props = {
  name?: string | null;
  uri?: string | null;
  size?: number;
  style?: ViewStyle;
  radius?: number;
};

/** Shows profile photo when available, otherwise initials on amber. */
export default function UserAvatar({ name, uri, size = 48, style, radius }: Props) {
  const [failed, setFailed] = useState(false);
  const r = radius ?? Math.round(size * 0.33);
  const initial = (name?.trim()?.charAt(0) || '?').toUpperCase();
  const showImage = Boolean(uri) && !failed;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: r,
          backgroundColor: COLORS.primary,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri: uri! }}
          style={{ width: size, height: size }}
          onError={() => setFailed(true)}
        />
      ) : (
        <Text
          style={{
            fontFamily: 'Sora_700Bold',
            fontSize: size * 0.38,
            color: COLORS.ink,
          }}
        >
          {initial}
        </Text>
      )}
    </View>
  );
}
