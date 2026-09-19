import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { StatusBadge, PriorityBadge } from './StatusPriorityBadges';
import { colors, fonts } from '../theme';
import { TicketCardData } from '../domain/ticketView';

interface TicketCardProps {
  ticket: TicketCardData;
  onPress: () => void;
  /** Show category + description line (list views) vs. omit it (compact board columns). */
  showDescription?: boolean;
}

export function TicketCard({ ticket, onPress, showDescription = true }: TicketCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <PriorityBadge priority={ticket.priority} size="sm" />
          <Text style={styles.number}>{ticket.number}</Text>
        </View>
        <Text style={styles.local} numberOfLines={1}>
          {ticket.local}
        </Text>
        {showDescription ? (
          <Text style={styles.desc} numberOfLines={2}>
            {ticket.categoryName} — {ticket.description}
          </Text>
        ) : null}
        <Text style={styles.meta} numberOfLines={1}>
          {ticket.hotelName} · {ticket.sector} · há {ticket.elapsedLabel}
        </Text>
        <View style={styles.footer}>
          <StatusBadge status={ticket.status} size="sm" />
          <Text style={[styles.sla, { color: ticket.slaColor }]}>{ticket.slaLabel}</Text>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { gap: 7 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  number: { fontFamily: fonts.mono, fontSize: 11.5, color: colors.textMuted },
  local: { fontFamily: fonts.sans, fontWeight: '700', fontSize: 16, color: colors.victoryInk },
  desc: { fontFamily: fonts.sans, fontSize: 13, color: colors.text },
  meta: { fontFamily: fonts.sans, fontSize: 12, color: colors.textMuted },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    marginTop: 2,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  sla: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 11.5 },
});
