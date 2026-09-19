import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, StyleProp } from 'react-native';
import { colors, fonts, radii } from '../theme';

type Variant = 'primary' | 'dark' | 'success' | 'danger' | 'outline-danger' | 'ghost' | 'soft';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<Variant, { bg: string; text: string; border?: string }> = {
  primary: { bg: colors.coral, text: colors.white },
  dark: { bg: colors.victoryInk, text: colors.white },
  success: { bg: colors.success, text: colors.white },
  danger: { bg: colors.danger, text: colors.white },
  'outline-danger': { bg: 'transparent', text: colors.danger, border: colors.danger100 },
  ghost: { bg: 'transparent', text: colors.textMuted },
  soft: { bg: colors.bgSunken, text: colors.victoryInk },
};

export function Button({ label, onPress, variant = 'primary', disabled, loading, style, fullWidth }: ButtonProps) {
  const v = VARIANT_STYLES[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: v.bg },
        v.border ? { borderWidth: 1.5, borderColor: v.border } : null,
        fullWidth ? { width: '100%' } : null,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={v.text} /> : <Text style={[styles.label, { color: v.text }]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontFamily: fonts.sans, fontWeight: '700', fontSize: 15.5 },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
});
