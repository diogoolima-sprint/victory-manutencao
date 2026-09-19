import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { colors, fonts } from '../theme';
import { BellIcon } from './icons';
import { useAuth } from '../state/AuthContext';
import { useTickets } from '../state/TicketsContext';
import { useSlaConfig } from '../state/useSlaConfig';
import { deriveNotifications } from '../domain/notifications';

/** Ported from the prototype's bell dropdown (top nav) — same derivation,
 *  same copy ("Notificações" / empty state), shown as a bottom sheet here
 *  since there's no persistent top nav chrome on mobile. */
export function NotificationBell({ dark }: { dark?: boolean }) {
  const { user } = useAuth();
  const { tickets } = useTickets();
  const slaConfig = useSlaConfig();
  const [open, setOpen] = useState(false);

  const notifications = useMemo(() => deriveNotifications(tickets, user, slaConfig), [tickets, user, slaConfig]);

  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={styles.button}>
        <BellIcon size={19} color={dark ? colors.white : colors.victoryInk} strokeWidth={1.8} />
        {notifications.length > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notifications.length}</Text>
          </View>
        ) : null}
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <SafeAreaView style={styles.sheet}>
          <Text style={styles.title}>Notificações</Text>
          <FlatList
            data={notifications}
            keyExtractor={(n) => n.id}
            style={{ maxHeight: 380 }}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.rowText}>{item.text}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.empty}>Nenhuma notificação no momento.</Text>}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.coral,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: '700', fontFamily: fonts.sans },
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
  title: {
    fontFamily: fonts.sans,
    fontWeight: '700',
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  row: { paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line },
  rowText: { fontFamily: fonts.sans, fontSize: 13, color: colors.victoryInk, lineHeight: 18 },
  empty: { fontFamily: fonts.sans, fontSize: 13, color: colors.textMuted, padding: 20 },
});
