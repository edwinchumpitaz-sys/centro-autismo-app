import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/context/session-context';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/lib/supabase';

type Specialty = {
  id: string;
  name: string;
};

type IntakeRequest = {
  id: string;
  status: string;
  requested_specialty_id: string | null;
};

type Child = {
  id: string;
  full_name: string;
  birth_date: string;
  diagnosis_notes: string | null;
  intake_requests: IntakeRequest[];
};

const STATUS_LABELS: Record<string, string> = {
  pendiente: 'Pendiente de revisión',
  en_revision: 'En revisión',
  asignado: 'Asignado a un terapeuta',
  descartado: 'Descartado',
};

export default function IntakeScreen() {
  const theme = useTheme();
  const { fullName, signOut } = useSession();

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  const [childName, setChildName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [diagnosisNotes, setDiagnosisNotes] = useState('');
  const [availabilityNotes, setAvailabilityNotes] = useState('');
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoadingList(true);
    const [{ data: specialtiesData }, { data: childrenData, error: childrenError }] =
      await Promise.all([
        supabase.from('specialties').select('id, name').order('name'),
        supabase
          .from('children')
          .select('id, full_name, birth_date, diagnosis_notes, intake_requests(id, status, requested_specialty_id)')
          .order('created_at', { ascending: false }),
      ]);

    if (specialtiesData) setSpecialties(specialtiesData);
    if (childrenError) console.error('Error loading children', childrenError);
    if (childrenData) setChildren(childrenData as unknown as Child[]);
    setIsLoadingList(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(birthDate);
  const canSubmit = childName.trim().length > 0 && isValidDate && selectedSpecialtyId && !isSubmitting;

  async function handleSubmit() {
    setError(null);
    if (!canSubmit) return;
    setIsSubmitting(true);

    const { data: child, error: childError } = await supabase
      .from('children')
      .insert({
        full_name: childName.trim(),
        birth_date: birthDate,
        diagnosis_notes: diagnosisNotes.trim() || null,
      })
      .select('id')
      .single();

    if (childError || !child) {
      setError(childError?.message ?? 'No se pudo guardar. Intenta de nuevo.');
      setIsSubmitting(false);
      return;
    }

    const { error: intakeError } = await supabase.from('intake_requests').insert({
      child_id: child.id,
      requested_specialty_id: selectedSpecialtyId,
      availability_notes: availabilityNotes.trim() || null,
    });

    setIsSubmitting(false);

    if (intakeError) {
      setError(intakeError.message);
      return;
    }

    setChildName('');
    setBirthDate('');
    setDiagnosisNotes('');
    setAvailabilityNotes('');
    setSelectedSpecialtyId(null);
    loadData();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle">Hola{fullName ? `, ${fullName}` : ''}</ThemedText>
          <Pressable onPress={signOut}>
            <ThemedText type="link" themeColor="textSecondary">
              Cerrar sesión
            </ThemedText>
          </Pressable>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="smallBold">Tus solicitudes</ThemedText>
          {isLoadingList && <ActivityIndicator style={{ marginTop: Spacing.three }} />}
          {!isLoadingList && children.length === 0 && (
            <ThemedText themeColor="textSecondary" style={{ marginTop: Spacing.two }}>
              Todavía no has registrado a ningún niño.
            </ThemedText>
          )}
          {children.map((child) => {
            const latestRequest = child.intake_requests[0];
            return (
              <ThemedView key={child.id} type="backgroundElement" style={styles.childCard}>
                <ThemedText type="smallBold">{child.full_name}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {latestRequest
                    ? (STATUS_LABELS[latestRequest.status] ?? latestRequest.status)
                    : 'Sin solicitud activa'}
                </ThemedText>
              </ThemedView>
            );
          })}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="smallBold">Agregar a tu hijo/a</ThemedText>

          <TextInput
            value={childName}
            onChangeText={setChildName}
            placeholder="Nombre del niño/a"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          />
          <TextInput
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="Fecha de nacimiento (AAAA-MM-DD)"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          />
          <TextInput
            value={diagnosisNotes}
            onChangeText={setDiagnosisNotes}
            placeholder="Diagnóstico o sospecha (opcional)"
            placeholderTextColor={theme.textSecondary}
            multiline
            style={[
              styles.input,
              styles.textArea,
              { color: theme.text, borderColor: theme.backgroundSelected },
            ]}
          />

          <ThemedText type="small" themeColor="textSecondary">
            ¿Qué especialidad necesita?
          </ThemedText>
          <ThemedView style={styles.chipRow}>
            {specialties.map((specialty) => {
              const selected = specialty.id === selectedSpecialtyId;
              return (
                <Pressable
                  key={specialty.id}
                  onPress={() => setSelectedSpecialtyId(specialty.id)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selected ? '#3c87f7' : theme.backgroundElement,
                    },
                  ]}>
                  <ThemedText
                    type="small"
                    style={{ color: selected ? '#fff' : theme.text }}>
                    {specialty.name}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ThemedView>

          <TextInput
            value={availabilityNotes}
            onChangeText={setAvailabilityNotes}
            placeholder="Zona y horarios disponibles (opcional)"
            placeholderTextColor={theme.textSecondary}
            multiline
            style={[
              styles.input,
              styles.textArea,
              { color: theme.text, borderColor: theme.backgroundSelected },
            ]}
          />

          {error && <ThemedText style={styles.error}>{error}</ThemedText>}

          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={[styles.button, { opacity: canSubmit ? 1 : 0.5 }]}>
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Enviar solicitud</ThemedText>
            )}
          </Pressable>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    gap: Spacing.five,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section: {
    gap: Spacing.two,
  },
  childCard: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.half,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  textArea: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
  },
  button: {
    backgroundColor: '#3c87f7',
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  error: {
    color: '#d64545',
  },
});
