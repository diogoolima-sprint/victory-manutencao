import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts } from '../theme';

interface BadgeProps {
  label: string;
  bg: string;
  color: string;
  dot?: boolean;
  size?: 'sm' | 'md';
}

export function Badge({ label, bg, color, dot, size = 'md' }: BadgeProps) {
  return (
    <View style={[styles.wrap, { backgroundColor: bg }, size === 'sm' && styles.wrapSm]}>
      {dot ? <View style={[styles.dot, { backgroundColor: color }]} /> : null}
      <Text style={[styles.label, { color }, size === 'sm' && styles.labelSm]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  wrapSm: { paddingHorizontal: 7, paddingVertical: 2 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontFamily: fonts.sans, fontWeight: '700', fontSize: 11.5 },
  labelSm: { fontSize: 10.5 },
});
