import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';
import { KpiTile, TicketCard, Button, NotificationBell } from '../components';
import { useAuth } from '../state/AuthContext';
import { useTickets } from '../state/TicketsContext';
import { useReferenceData } from '../state/ReferenceDataContext';
import { useSlaConfig } from '../state/useSlaConfig';
import { logout } from '../services/auth';
import { inHotelScope } from '../domain/permissions';
import { computeSla, isNonTerminal } from '../domain/sla';
import { buildTicketCard, sortTicketsForBoard } from '../domain/ticketView';
import { pluralize } from '../domain/format';
import { MainTabParamList, RootStackParamList } from '../navigation/types';

type Nav = BottomTabNavigationProp<MainTabParamList> & NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();
  const { tickets } = useTickets();
  const { hotels, hotelName, categoryName, staffName } = useReferenceData();
  const slaConfig = useSlaConfig();

  const openDetail = (ticketId: string) => navigation.navigate('TicketDetail', { ticketId });

  const scoped = useMemo(() => (user ? tickets.filter((t) => inHotelScope(user, t)) : []), [tickets, user]);

  const cAberto = scoped.filter((t) => t.status === 'aberto').length;
  const cExec = scoped.filter((t) => t.status === 'execucao').length;
  const cAguardando = scoped.filter((t) => t.status === 'aguardando').length;
  const urgentCount = scoped.filter((t) => isNonTerminal(t) && t.priority === 'urgente').length;
  const overdueTickets = useMemo(
    () =>
      sortTicketsForBoard(scoped.filter((t) => isNonTerminal(t) && computeSla(t, slaConfig).state === 'overdue')).map(
        (t) => buildTicketCard(t, slaConfig, hotelName, categoryName, staffName)
      ),
    [scoped, slaConfig, hotelName, categoryName, staffName]
  );
  const unassigned = useMemo(
    () =>
      sortTicketsForBoard(scoped.filter((t) => t.status === 'aberto' && !t.responsavelId)).map((t) =>
        buildTicketCard(t, slaConfig, hotelName, categoryName, staffName)
      ),
    [scoped, slaConfig, hotelName, categoryName, staffName]
  );
  const myAssignedActive = user ? scoped.filter((t) => t.responsavelId === user.id && isNonTerminal(t)).length : 0;
  const myOpened = useMemo(
    () =>
      (user ? scoped.filter((t) => t.solicitanteUserId === user.id) : [])
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((t) => buildTicketCard(t, slaConfig, hotelName, categoryName, staffName)),
    [scoped, user, slaConfig, hotelName, categoryName, staffName]
  );

  if (!user) return null;

  const dashScopeLabel = user.role === 'admin' ? 'Rede Victory Hotéis — todas as unidades' : hotelName(user.hotelId);

  const tileRed = { bg: '#FDE0DE', color: '#B53B35', labelColor: '#8A3530' };
  const tileAmber = { bg: '#FBEED2', color: '#9C6A14', labelColor: '#9C6A14' };
  const tileBlue = { bg: '#D7EEF9', color: '#00607F', labelColor: '#00607F' };
  const tileGray = { bg: '#EFEDE8', color: '#4A4A4A', labelColor: '#6B655D' };

  let tiles: { label: string; value: number; bg: string; color: string; labelColor: string; onPress?: () => void }[] = [];
  if (user.role === 'admin' || user.role === 'gestor') {
    tiles = [
      { label: 'Chamados abertos', value: scoped.filter(isNonTerminal).length, ...tileGray },
      { label: 'Urgentes', value: urgentCount, ...tileRed },
      { label: 'Atrasados', value: overdueTickets.length, ...tileAmber },
      { label: 'Em execução', value: cExec, bg: '#FDE7E5', color: '#DC4A43', labelColor: '#B8433C' },
    ];
  } else if (user.role === 'manutencao') {
    tiles = [
      { label: 'Não atribuídos', value: unassigned.length, ...tileGray },
      { label: 'Meus chamados', value: myAssignedActive, ...tileBlue },
      { label: 'Urgentes', value: urgentCount, ...tileRed },
      { label: 'Aguardando', value: cAguardando, ...tileAmber },
    ];
  } else {
    const myNonTerminal = myOpened.filter((t) => t.status !== 'concluido' && t.status !== 'cancelado').length;
    tiles = [
      { label: 'Meus chamados', value: myOpened.length, ...tileGray },
      { label: 'Em andamento', value: myNonTerminal, ...tileBlue },
    ];
  }

  const hotelComparison = hotels.map((h) => {
    const ht = tickets.filter((t) => t.hotelId === h.id);
    const abertos = ht.filter((t) => ['aberto', 'recebido', 'analise'].includes(t.status)).length;
    const execucao = ht.filter((t) => t.status === 'execucao' || t.status === 'aguardando').length;
    const concluidos = ht.filter((t) => t.status === 'concluido').length;
    return { id: h.id, name: h.name, abertos, execucao, concluidos };
  });

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.hello}>Olá, {user.name.split(' ')[0]}</Text>
            <Text style={styles.scopeLabel}>{dashScopeLabel}</Text>
          </View>
          <View style={styles.headerActions}>
            <NotificationBell />
            <Pressable onPress={() => logout()}>
              <Text style={styles.logout}>Sair</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.tileGrid}>
          {tiles.map((t) => (
            <KpiTile key={t.label} label={t.label} value={t.value} bg={t.bg} valueColor={t.color} labelColor={t.labelColor} />
          ))}
        </View>

        {user.role === 'admin' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumo por hotel</Text>
            {hotelComparison.map((h) => (
              <View key={h.id} style={styles.hotelRow}>
                <Text style={styles.hotelName}>{h.name}</Text>
                <Text style={styles.hotelMeta}>
                  {pluralize(h.abertos, 'aberto', 'abertos')} · {h.execucao} em execução ·{' '}
                  {pluralize(h.concluidos, 'concluído', 'concluídos')}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {(user.role === 'admin' || user.role === 'gestor') && overdueTickets.length > 0 ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.danger }]}>Requer atenção</Text>
            {overdueTickets.slice(0, 4).map((t) => (
              <TicketCard key={t.id} ticket={t} onPress={() => openDetail(t.id)} showDescription={false} />
            ))}
          </View>
        ) : null}

        {user.role === 'manutencao' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Não atribuídos</Text>
            {unassigned.slice(0, 3).map((t) => (
              <TicketCard key={t.id} ticket={t} onPress={() => openDetail(t.id)} showDescription={false} />
            ))}
            {unassigned.length === 0 ? <Text style={styles.emptyNote}>Nenhum chamado pendente.</Text> : null}
            <Pressable onPress={() => navigation.navigate('Painel')}>
              <Text style={styles.linkCenter}>Ver painel completo ›</Text>
            </Pressable>
          </View>
        ) : null}

        {user.role === 'solicitante' ? (
          <View style={styles.section}>
            <View style={styles.headerRow}>
              <Text style={styles.sectionTitle}>Meus chamados recentes</Text>
              <Pressable onPress={() => navigation.navigate('Mine')}>
                <Text style={styles.link}>Ver todos ›</Text>
              </Pressable>
            </View>
            {myOpened.slice(0, 4).map((t) => (
              <TicketCard key={t.id} ticket={t} onPress={() => openDetail(t.id)} showDescription={false} />
            ))}
            {myOpened.length === 0 ? (
              <Text style={styles.emptyNoteBig}>Você ainda não abriu nenhum chamado.</Text>
            ) : null}
            <Button label="+ Novo chamado" onPress={() => navigation.navigate('NewTicket')} style={{ marginTop: 4 }} fullWidth />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.victoryBone },
  scroll: { padding: 16, paddingBottom: 100, gap: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  hello: { fontFamily: fonts.sans, fontWeight: '700', fontSize: 24, color: colors.victoryInk, letterSpacing: -0.3 },
  scopeLabel: { fontFamily: fonts.sans, fontSize: 13.5, color: colors.textMuted, marginTop: 2 },
  logout: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 12.5, color: colors.textMuted },
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  section: { gap: 10 },
  sectionTitle: { fontFamily: fonts.sans, fontWeight: '700', fontSize: 15, color: colors.victoryInk },
  hotelRow: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  hotelName: { fontFamily: fonts.sans, fontWeight: '700', fontSize: 14, color: colors.victoryInk },
  hotelMeta: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.textMuted },
  emptyNote: { textAlign: 'center', padding: 16, color: colors.textMuted, fontSize: 13, fontFamily: fonts.sans },
  emptyNoteBig: { textAlign: 'center', padding: 30, color: colors.textMuted, fontSize: 13.5, fontFamily: fonts.sans },
  linkCenter: { textAlign: 'center', fontSize: 13, fontWeight: '600', color: colors.coral, fontFamily: fonts.sans, padding: 6 },
  link: { fontSize: 12.5, fontWeight: '600', color: colors.coral, fontFamily: fonts.sans },
});
