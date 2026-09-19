import React from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { colors, fonts, radii } from '../theme';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function TextField({ label, error, style, ...rest }: TextFieldProps) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.victoryWarmGray}
        style={[styles.input, style]}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 12.5, color: colors.textMuted },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.sm + 2,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontFamily: fonts.sans,
    fontSize: 14.5,
    color: colors.victoryInk,
    backgroundColor: colors.white,
  },
  error: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 12.5, color: colors.danger },
});
