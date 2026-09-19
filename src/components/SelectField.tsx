import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { colors, fonts, radii } from '../theme';
import { CheckIcon } from './icons';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  compact?: boolean;
}

export function SelectField({ label, value, options, onChange, placeholder = 'Selecione', compact }: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <View style={compact ? styles.wrapCompact : styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable style={[styles.field, compact && styles.fieldCompact]} onPress={() => setOpen(true)}>
        <Text style={[styles.fieldText, compact && styles.fieldTextCompact]} numberOfLines={1}>
          {current?.label || placeholder}
        </Text>
        <Text style={styles.chevron}>⌄</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View />
        </Pressable>
        <SafeAreaView style={styles.sheet}>
          {label ? <Text style={styles.sheetTitle}>{label}</Text> : null}
          <FlatList
            data={options}
            keyExtractor={(o) => o.value}
            style={{ maxHeight: 420 }}
            renderItem={({ item }) => (
              <Pressable
                style={styles.option}
                onPress={() => {
                  onChange(item.value);
                  setOpen(false);
                }}
              >
                <Text style={styles.optionText}>{item.label}</Text>
                {item.value === value ? <CheckIcon size={16} color={colors.coral} /> : null}
              </Pressable>
            )}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  wrapCompact: { minWidth: 140 },
  label: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 12.5, color: colors.textMuted },
  field: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.sm + 2,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    gap: 6,
  },
  fieldCompact: { paddingVertical: 9, paddingHorizontal: 10 },
  fieldText: { fontFamily: fonts.sans, fontSize: 14.5, color: colors.victoryInk, flexShrink: 1 },
  fieldTextCompact: { fontSize: 13 },
  chevron: { color: colors.textMuted, fontSize: 14 },
  backdrop: { flex: 1, backgroundColor: 'rgba(10,10,10,0.4)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 12,
  },
  sheetTitle: {
    fontFamily: fonts.sans,
    fontWeight: '700',
    fontSize: 13,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  optionText: { fontFamily: fonts.sans, fontSize: 15, color: colors.victoryInk },
});
