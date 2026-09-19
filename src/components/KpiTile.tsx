import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { fonts, radii } from '../theme';

interface KpiTileProps {
  label: string;
  value: number;
  bg: string;
  valueColor: string;
  labelColor: string;
  onPress?: () => void;
}

export function KpiTile({ label, value, bg, valueColor, labelColor, onPress }: KpiTileProps) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper onPress={onPress} style={[styles.tile, { backgroundColor: bg }]}>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexBasis: '48%',
    flexGrow: 1,
    borderRadius: radii.lg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 4,
  },
  value: { fontFamily: fonts.sans, fontWeight: '800', fontSize: 26 },
  label: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 12 },
});
