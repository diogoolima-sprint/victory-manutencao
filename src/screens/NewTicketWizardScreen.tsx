import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fonts, radii } from '../theme';
import { Button, SelectField, StepProgressBar, PhotoPicker, CheckIcon, ChevronLeftIcon } from '../components';
import { useAuth } from '../state/AuthContext';
import { useReferenceData } from '../state/ReferenceDataContext';
import { getWizardSteps, WizardStep } from '../domain/ticketWizard';
import { createTicket } from '../services/tickets';
import { PRIORITY_META, PRIORITY_ORDER, Priority, ROOM_FLOORS_BUSINESS, ROOM_FLOORS_SUITES } from '../types';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Phase = 'wizard' | 'summary' | 'done';

const STEP_TITLES: Record<WizardStep, string> = {
  hotel: 'Qual hotel?',
  sector: 'Qual setor?',
  room: 'Qual apartamento?',
  local: 'Onde é o problema?',
  category: 'Categoria do problema',
  description: 'Descreva o problema',
  priority: 'Qual a prioridade?',
  photo: 'Adicione uma foto',
  summary: 'Revisão final',
};

export function NewTicketWizardScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { hotels, sectors, categories, hotelName, categoryName } = useReferenceData();

  const [phase, setPhase] = useState<Phase>('wizard');
  const [hotelId, setHotelId] = useState(user?.role === 'admin' ? '' : user?.hotelId || '');
  const [sectorId, setSectorId] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [local, setLocal] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('normal');
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdNumber, setCreatedNumber] = useState('');
  const [createdId, setCreatedId] = useState('');
  const [draftId] = useState(() => `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const [step, setStep] = useState<WizardStep>(user?.role === 'admin' ? 'hotel' : 'sector');

  if (!user) return null;

  const effectiveHotelId = user.role === 'admin' ? hotelId : user.hotelId || '';
  const selectedSector = sectors.find((s) => s.id === sectorId);
  const steps = useMemo(() => getWizardSteps(user.role, selectedSector), [user.role, selectedSector]);
  const stepIndex = steps.indexOf(step);
  const stepLabel = `Etapa ${stepIndex + 1} de ${steps.length}`;
  const progressPct = Math.round(((stepIndex + 1) / steps.length) * 100);
  const isLastFieldStep = stepIndex === steps.length - 1;

  function validateStep(s: WizardStep): boolean {
    switch (s) {
      case 'hotel':
        return !!hotelId;
      case 'sector':
        return !!sectorId;
      case 'room':
        return !!roomNumber;
      case 'local':
        return !!local.trim();
      case 'category':
        return !!categoryId;
      case 'description':
        return !!description.trim();
      default:
        return true;
    }
  }

  function goNext() {
    if (!validateStep(step)) {
      setError('Preencha este campo para continuar.');
      return;
    }
    setError('');
    if (isLastFieldStep) {
      setPhase('summary');
      return;
    }
    setStep(steps[stepIndex + 1]);
  }

  function goPrev() {
    if (phase === 'summary') {
      setPhase('wizard');
      setStep(steps[steps.length - 1]);
      return;
    }
    if (stepIndex <= 0) {
      navigation.goBack();
      return;
    }
    setError('');
    setStep(steps[stepIndex - 1]);
  }

  async function handleConfirm() {
    if (!user) return;
    setSubmitting(true);
    try {
      const sector = sectors.find((s) => s.id === sectorId);
      const result = await createTicket(
        {
          hotelId: effectiveHotelId,
          sectorName: sector?.name || '',
          local: local.trim(),
          categoryId,
          description: description.trim(),
          priority,
          photoUrls: photos,
        },
        user
      );
      setCreatedNumber(result.number);
      setCreatedId(result.id);
      setPhase('done');
    } catch {
      setError('Não foi possível enviar o chamado. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  function resetWizard() {
    if (!user) return;
    setHotelId(user.role === 'admin' ? '' : user.hotelId || '');
    setSectorId('');
    setRoomNumber('');
    setLocal('');
    setCategoryId('');
    setDescription('');
    setPriority('normal');
    setPhotos([]);
    setError('');
    setPhase('wizard');
    setStep(user.role === 'admin' ? 'hotel' : 'sector');
  }

  const roomFloors = effectiveHotelId === 'h2' ? ROOM_FLOORS_SUITES : ROOM_FLOORS_BUSINESS;
  const roomOptions = roomFloors.flatMap((fl) => {
    const opts = [];
    for (let n = fl.start; n <= fl.end; n++) opts.push({ value: String(n), label: `${fl.floor}º andar · ${n}` });
    return opts;
  });

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {phase === 'wizard' ? (
          <>
            <View style={styles.headerRow}>
              <Pressable onPress={goPrev} style={styles.backBtn}>
                <ChevronLeftIcon />
              </Pressable>
              <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>Novo chamado</Text>
                <Text style={styles.headerStep}>{stepLabel}</Text>
              </View>
            </View>
            <StepProgressBar progressPct={progressPct} />

            <View style={styles.stepCard}>
              <Text style={styles.stepTitle}>{STEP_TITLES[step]}</Text>

              {step === 'hotel' ? (
                <View style={{ gap: 10 }}>
                  {hotels.filter((h) => h.ativo).map((h) => {
                    const active = hotelId === h.id;
                    return (
                      <Pressable
                        key={h.id}
                        onPress={() => setHotelId(h.id)}
                        style={[styles.tile, active && styles.tileActive]}
                      >
                        <Text style={[styles.tileText, active && styles.tileTextActive]}>{h.name}</Text>
                        {active ? <CheckIcon size={18} color={colors.danger} /> : null}
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}

              {step === 'sector' ? (
                <View style={{ gap: 10 }}>
                  {sectors
                    .filter((s) => s.hotelId === effectiveHotelId && s.ativo)
                    .map((s) => {
                      const active = sectorId === s.id;
                      return (
                        <Pressable
                          key={s.id}
                          onPress={() => {
                            setSectorId(s.id);
                            setRoomNumber('');
                            setLocal('');
                            setError('');
                          }}
                          style={[styles.tile, active && styles.tileActive]}
                        >
                          <Text style={[styles.tileText, active && styles.tileTextActive]}>{s.name}</Text>
                          {active ? <CheckIcon size={18} color={colors.danger} /> : null}
                        </Pressable>
                      );
                    })}
                </View>
              ) : null}

              {step === 'room' ? (
                <SelectField
                  value={roomNumber}
                  onChange={(v) => {
                    setRoomNumber(v);
                    setLocal(v ? `Apartamento ${v}` : '');
                    setError('');
                  }}
                  options={roomOptions}
                  placeholder="Selecione o quarto"
                />
              ) : null}

              {step === 'local' ? (
                <TextInput
                  value={local}
                  onChangeText={(v) => {
                    setLocal(v);
                    setError('');
                  }}
                  placeholder="Ex: Banheiro da recepção, Salão do restaurante"
                  style={styles.textInput}
                />
              ) : null}

              {step === 'category' ? (
                <View style={styles.categoryGrid}>
                  {categories
                    .filter((c) => c.ativo)
                    .map((c) => {
                      const active = categoryId === c.id;
                      return (
                        <Pressable
                          key={c.id}
                          onPress={() => {
                            setCategoryId(c.id);
                            setError('');
                          }}
                          style={[styles.categoryTile, active && styles.tileActive]}
                        >
                          <Text style={[styles.categoryTileText, active && styles.tileTextActive]}>{c.name}</Text>
                        </Pressable>
                      );
                    })}
                </View>
              ) : null}

              {step === 'description' ? (
                <TextInput
                  value={description}
                  onChangeText={(v) => {
                    setDescription(v);
                    setError('');
                  }}
                  placeholder="O que está acontecendo? Quanto mais detalhes, mais rápido o atendimento."
                  multiline
                  numberOfLines={6}
                  style={[styles.textInput, styles.textArea]}
                  textAlignVertical="top"
                />
              ) : null}

              {step === 'priority' ? (
                <View style={{ gap: 10 }}>
                  {PRIORITY_ORDER.map((p) => {
                    const active = priority === p;
                    const m = PRIORITY_META[p];
                    return (
                      <Pressable
                        key={p}
                        onPress={() => setPriority(p)}
                        style={[styles.priorityTile, { borderColor: active ? m.color : colors.line, backgroundColor: active ? m.bg : colors.white }]}
                      >
                        <Text style={[styles.priorityTileText, { color: active ? m.color : colors.victoryInk }]}>{m.label}</Text>
                        {active ? <CheckIcon size={18} color={m.color} /> : null}
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}

              {step === 'photo' ? (
                <PhotoPicker
                  photos={photos}
                  onChange={setPhotos}
                  folder={`drafts/${draftId}`}
                  helperText="Uma foto ajuda a equipe a entender o problema mais rápido."
                />
              ) : null}

              {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>

            <Button label={isLastFieldStep ? 'Revisar chamado' : 'Continuar'} onPress={goNext} fullWidth />
          </>
        ) : null}

        {phase === 'summary' ? (
          <>
            <View style={styles.headerRow}>
              <Pressable onPress={goPrev} style={styles.backBtn}>
                <ChevronLeftIcon />
              </Pressable>
              <Text style={styles.headerTitle}>Confira antes de enviar</Text>
            </View>
            <View style={styles.stepCard}>
              <SummaryRow label="Hotel" value={hotelName(effectiveHotelId)} />
              <SummaryRow label="Setor" value={selectedSector?.name || '—'} />
              <SummaryRow label="Local" value={local} />
              <SummaryRow label="Categoria" value={categoryName(categoryId)} />
              <SummaryRow label="Problema" value={description} />
              <View style={styles.priorityRow}>
                <Text style={styles.summaryLabel}>Prioridade: </Text>
                <View style={[styles.priorityPill, { backgroundColor: PRIORITY_META[priority].bg }]}>
                  <Text style={{ color: PRIORITY_META[priority].color, fontWeight: '700', fontSize: 12.5, fontFamily: fonts.sans }}>
                    {PRIORITY_META[priority].label}
                  </Text>
                </View>
              </View>
              <SummaryRow label="Fotos anexadas" value={String(photos.length)} />
              <Text style={styles.summaryFooter}>Aberto por {user.name} · agora</Text>
              {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>
            <Button label="Confirmar abertura" onPress={handleConfirm} loading={submitting} fullWidth />
          </>
        ) : null}

        {phase === 'done' ? (
          <View style={styles.doneCard}>
            <View style={styles.doneCheck}>
              <CheckIcon size={24} color={colors.success} />
            </View>
            <Text style={styles.doneNote}>Chamado aberto com sucesso</Text>
            <Text style={styles.doneNumber}>{createdNumber}</Text>
            <View style={{ gap: 10, marginTop: 8, width: '100%' }}>
              <Button
                label="Ver detalhes do chamado"
                onPress={() => navigation.replace('TicketDetail', { ticketId: createdId })}
                fullWidth
              />
              <Button label="Abrir outro chamado" onPress={resetWizard} variant="ghost" fullWidth />
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Text style={styles.summaryLine}>
      <Text style={styles.summaryLabel}>{label}: </Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.victoryBone },
  scroll: { padding: 16, gap: 16, flexGrow: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: fonts.sans, fontWeight: '700', fontSize: 19, color: colors.victoryInk, letterSpacing: -0.2 },
  headerStep: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 12, color: colors.textMuted },
  stepCard: { backgroundColor: colors.white, borderRadius: radii.md, padding: 22, gap: 16, minHeight: 240 },
  stepTitle: { fontFamily: fonts.sans, fontWeight: '700', fontSize: 16, color: colors.victoryInk },
  tile: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tileActive: { borderColor: colors.coral, backgroundColor: colors.coral100 },
  tileText: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 15, color: colors.victoryInk },
  tileTextActive: { color: colors.danger },
  textInput: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    padding: 16,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.victoryInk,
  },
  textArea: { minHeight: 130 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryTile: {
    flexBasis: '47%',
    flexGrow: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  categoryTileText: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 13.5, color: colors.victoryInk, textAlign: 'center' },
  priorityTile: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityTileText: { fontFamily: fonts.sans, fontWeight: '700', fontSize: 15 },
  error: { fontFamily: fonts.sans, fontSize: 13, color: colors.danger, backgroundColor: colors.danger100, padding: 10, borderRadius: 7 },
  summaryLine: { fontFamily: fonts.sans, fontSize: 14.5, color: colors.victoryInk, lineHeight: 21 },
  summaryLabel: { fontWeight: '700', fontFamily: fonts.sans, fontSize: 14.5, color: colors.victoryInk },
  summaryValue: { fontWeight: '400' },
  priorityRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  summaryFooter: { fontFamily: fonts.sans, fontSize: 13, color: colors.textMuted },
  priorityPill: { paddingHorizontal: 9, paddingVertical: 2, borderRadius: 5, alignSelf: 'flex-start' },
  doneCard: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, backgroundColor: colors.white, borderRadius: radii.md, padding: 40 },
  doneCheck: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.success100, alignItems: 'center', justifyContent: 'center' },
  doneNote: { fontFamily: fonts.sans, fontSize: 14, color: colors.textMuted },
  doneNumber: { fontFamily: fonts.mono, fontWeight: '700', fontSize: 24, color: colors.victoryInk },
});
