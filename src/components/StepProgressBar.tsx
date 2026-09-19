import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

export function StepProgressBar({ progressPct }: { progressPct: number }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${progressPct}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 4, backgroundColor: colors.bgSunken, borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.coral, borderRadius: 2 },
});
