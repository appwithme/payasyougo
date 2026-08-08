import React from 'react';
import { Image, View, ViewStyle, ImageStyle } from 'react-native';

type Props = {
  size?: number;
  style?: ViewStyle;
};

const LOGO = require('../../assets/brand/logo-pin-p.png');

/** Same pin-P mark — alias kept so existing imports keep working. */
export function CustomBrandMark({ size = 48, style }: Props) {
  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Image
        source={LOGO}
        style={{ width: size, height: size } as ImageStyle}
        resizeMode="contain"
      />
    </View>
  );
}

export default CustomBrandMark;
