import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radii } from '../theme';
import { SelectField, TextField, TicketCard, NotificationBell } from '../components';
import { useAuth } from '../state/AuthContext';
import { useTickets } from '../state/TicketsContext';
import { useReferenceData } from '../state/ReferenceDataContext';
import { useSlaConfig } from '../state/useSlaConfig';
import { inHotelScope } from '../domain/permissions';
import { computeSla } from '../domain/sla';
import { buildTicketCard, priorityRank } from '../domain/ticketView';
import { pluralize } from '../domain/format';
import { STATUS_META, PRIORITY_META, PRIORITY_ORDER, Priority, TicketStatus } from '../types';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type QuickFilter = 'all' | 'urgent' | 'mine' | 'overdue';

export function TicketListScreen() {
  const route = useRoute();
  const mode: 'painel' | 'mine' = route.name === 'Mine' ? 'mine' : 'painel';
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { tickets } = useTickets();
  const { sectors, categories, staff, hotels, hotelName, categoryName, staffName } = useReferenceData();
  const slaConfig = useSlaConfig();

  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quick, setQuick] = useState<QuickFilter>('all');
  const [hotelFilter, setHotelFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [responsavelFilter, setResponsavelFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');

  if (!user) return null;

  const isManutencao = user.role === 'manutencao';
  const isSolicitante = user.role === 'solicitante';
  const showHotelFilter = user.role === 'admin';
  const showResponsavelFilter = user.role === 'admin' || user.role === 'gestor';

  const title = mode === 'mine' ? (isManutencao ? 'Atribuídos a Mim' : 'Meus Chamados') : 'Painel de Chamados';

  const filtered = useMemo(() => {
    let list = tickets.filter((t) => inHotelScope(user, t));
    if (mode === 'mine') {
      list = isManutencao ? list.filter((t) => t.responsavelId === user.id) : list.filter((t) => t.solicitanteUserId === user.id);
    }
    if (hotelFilter !== 'all') list = list.filter((t) => t.hotelId === hotelFilter);
    if (sectorFilter !== 'all') list = list.filter((t) => t.sector === sectorFilter);
    if (statusFilter !== 'all') list = list.filter((t) => t.status === statusFilter);
    if (priorityFilter !== 'all') list = list.filter((t) => t.priority === priorityFilter);
    if (categoryFilter !== 'all') list = list.filter((t) => t.categoryId === categoryFilter);
    if (responsavelFilter !== 'all') list = list.filter((t) => t.responsavelId === responsavelFilter);
    if (periodFilter !== 'all') {
      const days = periodFilter === '7' ? 7 : 30;
      const cutoff = Date.now() - days * 86400000;
      list = list.filter((t) => t.createdAt >= cutoff);
    }
    if (quick === 'urgent') list = list.filter((t) => t.priority === 'urgente');
    if (quick === 'mine') list = list.filter((t) => (isManutencao ? t.responsavelId === user.id : t.solicitanteUserId === user.id));
    if (quick === 'overdue') list = list.filter((t) => computeSla(t, slaConfig).state === 'overdue');
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) => t.number.toLowerCase().includes(q) || t.local.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }
    list = [...list].sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority] || a.createdAt - b.createdAt);
    return list.map((t) => buildTicketCard(t, slaConfig, hotelName, categoryName, staffName));
  }, [
    tickets,
    user,
    mode,
    isManutencao,
    hotelFilter,
    sectorFilter,
    statusFilter,
    priorityFilter,
    categoryFilter,
    responsavelFilter,
    periodFilter,
    quick,
    search,
    slaConfig,
    hotelName,
    categoryName,
    staffName,
  ]);

  const quickFilters: { key: QuickFilter; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'urgent', label: 'Urgentes' },
    ...(isManutencao || isSolicitante ? [{ key: 'mine' as QuickFilter, label: isSolicitante ? 'Meus chamados' : 'Atribuídos a mim' }] : []),
    { key: 'overdue', label: 'Atrasados' },
  ];

  const sectorNamesInScope = Array.from(
    new Set(sectors.filter((s) => user.role === 'admin' || s.hotelId === user.hotelId).map((s) => s.name))
  );
  const responsavelOptions = staff.filter((s) => s.role === 'manutencao' && (user.role === 'admin' || s.hotelId === user.hotelId));

  function clearFilters() {
    setHotelFilter('all');
    setSectorFilter('all');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setResponsavelFilter('all');
    setPeriodFilter('all');
    setQuick('all');
    setSearch('');
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={[styles.header, styles.headerRow]}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{pluralize(filtered.length, 'chamado encontrado', 'chamados encontrados')}</Text>
        </View>
        <NotificationBell />
      </View>

      <View style={styles.chipRow}>
        {quickFilters.map((qf) => (
          <Pressable
            key={qf.key}
            onPress={() => setQuick(qf.key)}
            style={[styles.chip, quick === qf.key && styles.chipActive]}
          >
            <Text style={[styles.chipText, quick === qf.key && styles.chipTextActive]}>{qf.label}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={() => setFiltersOpen((v) => !v)} style={styles.filtersToggle}>
        <Text style={styles.filtersToggleText}>{filtersOpen ? 'Ocultar filtros' : 'Mais filtros'}</Text>
      </Pressable>

      {filtersOpen ? (
        <View style={styles.filtersPanel}>
          <TextField placeholder="Buscar por número, local ou descrição" value={search} onChangeText={setSearch} />
          <View style={styles.filtersGrid}>
            {showHotelFilter ? (
              <SelectField
                compact
                value={hotelFilter}
                onChange={setHotelFilter}
                options={[{ value: 'all', label: 'Todos os hotéis' }, ...hotels.map((h) => ({ value: h.id, label: h.name }))]}
              />
            ) : null}
            <SelectField
              compact
              value={sectorFilter}
              onChange={setSectorFilter}
              options={[{ value: 'all', label: 'Todos os setores' }, ...sectorNamesInScope.map((n) => ({ value: n, label: n }))]}
            />
            <SelectField
              compact
              value={statusFilter}
              onChange={setStatusFilter}
              options={[{ value: 'all', label: 'Todos os status' }, ...(Object.keys(STATUS_META) as TicketStatus[]).map((k) => ({ value: k, label: STATUS_META[k].label }))]}
            />
            <SelectField
              compact
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={[{ value: 'all', label: 'Todas as prioridades' }, ...PRIORITY_ORDER.map((p: Priority) => ({ value: p, label: PRIORITY_META[p].label }))]}
            />
            <SelectField
              compact
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={[{ value: 'all', label: 'Todas as categorias' }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
            />
            {showResponsavelFilter ? (
              <SelectField
                compact
                value={responsavelFilter}
                onChange={setResponsavelFilter}
                options={[{ value: 'all', label: 'Todos os responsáveis' }, ...responsavelOptions.map((u) => ({ value: u.id, label: u.name }))]}
              />
            ) : null}
            <SelectField
              compact
              value={periodFilter}
              onChange={setPeriodFilter}
              options={[
                { value: 'all', label: 'Todo o período' },
                { value: '7', label: 'Últimos 7 dias' },
                { value: '30', label: 'Últimos 30 dias' },
              ]}
            />
          </View>
          <Pressable onPress={clearFilters}>
            <Text style={styles.clearLink}>Limpar</Text>
          </Pressable>
        </View>
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <TicketCard ticket={item} onPress={() => navigation.navigate('TicketDetail', { ticketId: item.id })} />}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum chamado encontrado com os filtros atuais.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.victoryBone },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontFamily: fonts.sans, fontWeight: '700', fontSize: 22, color: colors.victoryInk, letterSpacing: -0.3 },
  subtitle: { fontFamily: fonts.sans, fontSize: 13.5, color: colors.textMuted, marginTop: 2 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, marginBottom: 6 },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  chipActive: { backgroundColor: colors.victoryInk },
  chipText: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 13, color: colors.text },
  chipTextActive: { color: colors.white },
  filtersToggle: { paddingHorizontal: 16, paddingVertical: 6 },
  filtersToggleText: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 13, color: colors.coral },
  filtersPanel: { paddingHorizontal: 16, paddingBottom: 10, gap: 10 },
  filtersGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  clearLink: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 13, color: colors.coral, alignSelf: 'flex-start' },
  listContent: { paddingHorizontal: 16, paddingBottom: 100, gap: 10 },
  empty: { textAlign: 'center', padding: 50, color: colors.textMuted, fontSize: 14, fontFamily: fonts.sans },
});
