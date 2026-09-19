import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fonts, radii } from '../theme';
import { Button, StatusBadge, PriorityBadge, SelectField, PhotoPicker, ChevronLeftIcon, AttachIcon } from '../components';
import { useAuth } from '../state/AuthContext';
import { useTickets } from '../state/TicketsContext';
import { useReferenceData } from '../state/ReferenceDataContext';
import { useSlaConfig } from '../state/useSlaConfig';
import { computeSla, slaStyle } from '../domain/sla';
import {
  canAddNote,
  canAssign,
  canCancel,
  canChangePriority,
  canChangeStatus,
  canConclude,
  canManageTicket,
  isAssignedTech,
} from '../domain/permissions';
import { fmtDateTime } from '../domain/format';
import {
  assignTicket,
  cancelTicket,
  addTicketNote,
  changeTicketPriority,
  changeTicketStatus,
  concludeTicket,
} from '../services/tickets';
import { PRIORITY_META, PRIORITY_ORDER, STATUS_META, TicketStatus } from '../types';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type DetailRoute = RouteProp<RootStackParamList, 'TicketDetail'>;

const STATUS_STEPS: TicketStatus[] = ['aberto', 'recebido', 'analise', 'execucao', 'aguardando'];

export function TicketDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<DetailRoute>();
  const { user } = useAuth();
  const { tickets } = useTickets();
  const { hotelName, categoryName, staffName, staff } = useReferenceData();
  const slaConfig = useSlaConfig();

  const ticket = tickets.find((t) => t.id === route.params.ticketId);

  const [assignSelect, setAssignSelect] = useState('');
  const [noteText, setNoteText] = useState('');
  const [notePhotos, setNotePhotos] = useState<string[]>([]);
  const [showConclusion, setShowConclusion] = useState(false);
  const [conclusionService, setConclusionService] = useState('');
  const [conclusionNote, setConclusionNote] = useState('');
  const [conclusionPhotos, setConclusionPhotos] = useState<string[]>([]);
  const [conclusionError, setConclusionError] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [busy, setBusy] = useState(false);

  const sla = useMemo(() => (ticket ? computeSla(ticket, slaConfig) : null), [ticket, slaConfig]);

  if (!user) return null;
  if (!ticket || !sla) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.notFound}>Chamado não encontrado.</Text>
      </SafeAreaView>
    );
  }

  const slaTone = slaStyle[sla.state];
  const canManage = canManageTicket(user, ticket);
  const assignedTech = isAssignedTech(user, ticket);
  // NOTE: the prototype's Ações card was gated on canManage alone, which
  // would have silently locked assigned technicians out of status/
  // conclusion/notes despite the app computing per-action flags that
  // already account for them (canConclude/canChangeStatus/canAddNote all
  // check isAssignedTech). That reads as leftover-flag-without-wrapper-
  // update, not an intended business rule — it directly contradicts the
  // original spec's "Manutenção: ...assume chamados, atualiza status,
  // registra o que foi realizado e encerra a solicitação" (chats/chat1.md)
  // and would make the whole "Painel de manutenção" pointless. Gating on
  // canManage || assignedTech here instead.
  const showActionsCard = canManage || assignedTech;
  const assignPool = staff.filter((s) => s.role === 'manutencao' && s.hotelId === ticket.hotelId && s.ativo);
  const statusOptions = STATUS_STEPS.filter((s) => s !== ticket.status);
  const timeline = [...ticket.timeline].sort((a, b) => a.at - b.at);

  async function withBusy(fn: () => Promise<void>) {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  }

  const handleAssign = () =>
    withBusy(async () => {
      if (!ticket || !user) return;
      const member = assignPool.find((s) => s.id === assignSelect);
      if (!member) return;
      await assignTicket(ticket, member, user);
      setAssignSelect('');
    });

  const handleStatusChange = (s: TicketStatus) => withBusy(() => (ticket && user ? changeTicketStatus(ticket, s, user) : Promise.resolve()));

  const handlePriorityChange = (p: (typeof PRIORITY_ORDER)[number]) =>
    withBusy(() => (ticket && user ? changeTicketPriority(ticket, p, user) : Promise.resolve()));

  const handleSubmitNote = () =>
    withBusy(async () => {
      if (!ticket || !user || !noteText.trim()) return;
      await addTicketNote(ticket, noteText, notePhotos, user);
      setNoteText('');
      setNotePhotos([]);
    });

  const handleConfirmConclusion = () =>
    withBusy(async () => {
      if (!ticket || !user) return;
      if (!conclusionService.trim()) {
        setConclusionError('Descreva o serviço realizado antes de concluir.');
        return;
      }
      setConclusionError('');
      await concludeTicket(ticket, { service: conclusionService.trim(), note: conclusionNote.trim(), photoUrls: conclusionPhotos }, user);
      setShowConclusion(false);
      setConclusionService('');
      setConclusionNote('');
      setConclusionPhotos([]);
    });

  const handleConfirmCancel = () =>
    withBusy(async () => {
      if (!ticket || !user || !cancelReason.trim()) return;
      await cancelTicket(ticket, cancelReason.trim(), user);
      setShowCancel(false);
      setCancelReason('');
    });

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backRow}>
          <ChevronLeftIcon size={14} color={colors.textMuted} />
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>

        <View style={styles.headerRow}>
          <Text style={styles.number}>{ticket.number}</Text>
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </View>
        <Text style={[styles.slaLabel, { color: slaTone.color }]}>{sla.label}</Text>

        <View style={styles.card}>
          <View style={styles.infoGrid}>
            <InfoField label="Hotel" value={hotelName(ticket.hotelId)} />
            <InfoField label="Setor" value={ticket.sector} />
            <InfoField label="Local" value={ticket.local} />
            <InfoField label="Categoria" value={categoryName(ticket.categoryId)} />
          </View>

          <View style={styles.divider}>
            <Text style={styles.fieldLabel}>Descrição do problema</Text>
            <Text style={styles.description}>{ticket.description}</Text>
          </View>

          <View style={styles.divider}>
            <Text style={styles.fieldLabel}>Fotos</Text>
            {ticket.photos.length ? (
              <View style={styles.photoRow}>
                {ticket.photos.map((url) => (
                  <Image key={url} source={{ uri: url }} style={styles.photoThumb} />
                ))}
              </View>
            ) : (
              <Text style={styles.mutedText}>Nenhuma foto anexada.</Text>
            )}
          </View>

          <View style={[styles.divider, styles.infoGrid]}>
            <InfoField label="Solicitante" value={ticket.solicitante} />
            <InfoField label="Aberto em" value={fmtDateTime(new Date(ticket.createdAt))} />
            <InfoField label="Responsável" value={staffName(ticket.responsavelId)} />
          </View>
        </View>

        {showActionsCard ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ações</Text>

            <View style={styles.actionRow}>
              {canConclude(user, ticket) ? (
                <Button label="Concluir chamado" onPress={() => setShowConclusion(true)} variant="success" style={{ flex: 1 }} />
              ) : null}
              {canCancel(user, ticket) ? (
                <Button label="Cancelar chamado" onPress={() => setShowCancel(true)} variant="outline-danger" style={{ flex: 1 }} />
              ) : null}
            </View>

            {canChangeStatus(user, ticket) ? (
              <View>
                <Text style={styles.sectionLabel}>Alterar status</Text>
                <View style={styles.chipsRow}>
                  {statusOptions.map((s) => (
                    <Pressable key={s} onPress={() => handleStatusChange(s)} style={styles.statusChip} disabled={busy}>
                      <Text style={styles.statusChipText}>{STATUS_META[s].label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}

            {canChangePriority(user, ticket) ? (
              <View>
                <Text style={styles.sectionLabel}>Alterar prioridade</Text>
                <View style={styles.chipsRow}>
                  {PRIORITY_ORDER.filter((p) => p !== ticket.priority).map((p) => (
                    <Pressable key={p} onPress={() => handlePriorityChange(p)} style={styles.statusChip} disabled={busy}>
                      <Text style={styles.statusChipText}>{PRIORITY_META[p].label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}

            {canAssign(user, ticket) ? (
              <View>
                <Text style={styles.sectionLabel}>Atribuir responsável</Text>
                <View style={styles.assignRow}>
                  <SelectField
                    value={assignSelect}
                    onChange={setAssignSelect}
                    options={assignPool.map((s) => ({ value: s.id, label: s.name }))}
                    placeholder="Selecione"
                    compact
                  />
                  <Button label="Atribuir" onPress={handleAssign} variant="dark" disabled={!assignSelect || busy} />
                </View>
              </View>
            ) : null}

            {canAddNote(user, ticket) ? (
              <View>
                <Text style={styles.sectionLabel}>Registrar observação</Text>
                <View style={styles.noteRow}>
                  <TextInput
                    value={noteText}
                    onChangeText={setNoteText}
                    placeholder="Observação sobre o andamento"
                    multiline
                    style={styles.noteInput}
                  />
                </View>
                <PhotoPicker photos={notePhotos} onChange={setNotePhotos} folder={`tickets/${ticket.id}`} max={5} />
                <Button
                  label="Adicionar observação"
                  onPress={handleSubmitNote}
                  variant="soft"
                  disabled={!noteText.trim() || busy}
                  style={{ marginTop: 8, alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 9 }}
                />
              </View>
            ) : null}

            {showConclusion ? (
              <View style={styles.inlineForm}>
                <Text style={styles.inlineFormTitle}>Concluir chamado</Text>
                <TextInput
                  value={conclusionService}
                  onChangeText={setConclusionService}
                  placeholder="Descrição do serviço realizado"
                  multiline
                  style={styles.noteInput}
                />
                <TextInput
                  value={conclusionNote}
                  onChangeText={setConclusionNote}
                  placeholder="Observação final (opcional)"
                  multiline
                  style={styles.noteInput}
                />
                <View style={styles.attachRow}>
                  <AttachIcon size={14} />
                  <Text style={styles.attachLabel}>Foto do serviço ({conclusionPhotos.length})</Text>
                </View>
                <PhotoPicker photos={conclusionPhotos} onChange={setConclusionPhotos} folder={`tickets/${ticket.id}`} max={5} />
                {conclusionError ? <Text style={styles.error}>{conclusionError}</Text> : null}
                <View style={styles.inlineFormActions}>
                  <Button label="Cancelar" onPress={() => setShowConclusion(false)} variant="ghost" />
                  <Button label="Confirmar conclusão" onPress={handleConfirmConclusion} variant="success" disabled={busy} />
                </View>
              </View>
            ) : null}

            {showCancel ? (
              <View style={[styles.inlineForm, { backgroundColor: colors.danger100 }]}>
                <Text style={[styles.inlineFormTitle, { color: colors.danger }]}>Cancelar chamado</Text>
                <TextInput
                  value={cancelReason}
                  onChangeText={setCancelReason}
                  placeholder="Motivo do cancelamento"
                  multiline
                  style={styles.noteInput}
                />
                <View style={styles.inlineFormActions}>
                  <Button label="Voltar" onPress={() => setShowCancel(false)} variant="ghost" />
                  <Button label="Confirmar cancelamento" onPress={handleConfirmCancel} variant="danger" disabled={!cancelReason.trim() || busy} />
                </View>
              </View>
            ) : null}
          </View>
        ) : null}

        {ticket.conclusion ? (
          <View style={[styles.card, { backgroundColor: colors.success100 }]}>
            <Text style={[styles.cardTitle, { color: colors.success }]}>Serviço realizado</Text>
            <Text style={styles.description}>{ticket.conclusion.service}</Text>
            {ticket.conclusion.note ? <Text style={styles.description}>{ticket.conclusion.note}</Text> : null}
            <Text style={styles.mutedText}>
              Concluído por {staffName(ticket.conclusion.byId)} em {fmtDateTime(new Date(ticket.conclusion.at))}
            </Text>
          </View>
        ) : null}

        {ticket.cancellation ? (
          <View style={[styles.card, { backgroundColor: colors.danger100 }]}>
            <Text style={[styles.cardTitle, { color: colors.danger }]}>Chamado cancelado</Text>
            <Text style={styles.description}>{ticket.cancellation.reason}</Text>
            <Text style={styles.mutedText}>
              Cancelado por {staffName(ticket.cancellation.byId)} em {fmtDateTime(new Date(ticket.cancellation.at))}
            </Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Histórico</Text>
          <View style={{ marginTop: 6 }}>
            {timeline.map((entry, i) => (
              <View key={i} style={styles.timelineRow}>
                <View style={styles.timelineDotCol}>
                  <View style={styles.timelineDot} />
                  {i < timeline.length - 1 ? <View style={styles.timelineLine} /> : null}
                </View>
                <View style={{ flex: 1, paddingBottom: 16 }}>
                  <Text style={styles.timelineLabel}>{entry.label}</Text>
                  {entry.note ? <Text style={styles.timelineNote}>{entry.note}</Text> : null}
                  <Text style={styles.timelineMeta}>
                    {entry.byName} · {fmtDateTime(new Date(entry.at))}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ minWidth: 140, flexGrow: 1 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.victoryBone },
  scroll: { padding: 16, gap: 16, paddingBottom: 60 },
  notFound: { padding: 40, textAlign: 'center', color: colors.textMuted, fontFamily: fonts.sans },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  backText: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 13, color: colors.textMuted },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  number: { fontFamily: fonts.mono, fontWeight: '700', fontSize: 20, color: colors.victoryInk },
  slaLabel: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 13 },
  card: { backgroundColor: colors.white, borderRadius: radii.md, padding: 18, gap: 12 },
  cardTitle: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 15, color: colors.victoryInk },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  divider: { paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.line, gap: 6 },
  fieldLabel: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 11.5, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  fieldValue: { fontFamily: fonts.sans, fontSize: 13.5, color: colors.victoryInk, marginTop: 3 },
  description: { fontFamily: fonts.sans, fontSize: 14, color: colors.victoryInk, lineHeight: 20 },
  mutedText: { fontFamily: fonts.sans, fontSize: 13, color: colors.textMuted },
  photoRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  photoThumb: { width: 64, height: 64, borderRadius: 10, backgroundColor: colors.bgSunken },
  actionRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  sectionLabel: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 12, color: colors.textMuted, marginBottom: 8 },
  chipsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    statusChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statusChipText: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 13, color: colors.victoryInk },
  assignRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  noteRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  noteInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    padding: 11,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.victoryInk,
    minHeight: 60,
  },
  attachRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  attachLabel: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 13, color: colors.text },
  inlineForm: { backgroundColor: colors.bgSoft, borderRadius: 9, padding: 16, gap: 10 },
  inlineFormTitle: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 13.5, color: colors.victoryInk },
  inlineFormActions: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end' },
  error: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.danger },
  timelineRow: { flexDirection: 'row', gap: 10 },
  timelineDotCol: { alignItems: 'center' },
  timelineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.coral, marginTop: 4 },
  timelineLine: { width: 1, flex: 1, backgroundColor: colors.line, marginTop: 2 },
  timelineLabel: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 13, color: colors.victoryInk },
  timelineNote: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.text, marginTop: 2, lineHeight: 18 },
  timelineMeta: { fontFamily: fonts.sans, fontSize: 11.5, color: colors.textMuted, marginTop: 3 },
});
