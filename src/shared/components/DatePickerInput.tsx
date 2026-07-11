import React, { useState } from 'react';
import { Pressable, Text, View, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import { colors, radius, spacing } from '../../core/theme';

type DatePickerInputProps = {
  label: string;
  value: string; // ISO "AAAA-MM-DD"
  onChange: (isoDate: string) => void;
  error?: string;
};

function toDate(iso: string): Date {
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function toISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatDisplay(iso: string): string {
  return toDate(iso).toLocaleDateString('pt-BR');
}

/**
 * Substitui o campo de texto livre "AAAA-MM-DD" por um seletor visual.
 * No Android, o DateTimePicker abre como um modal nativo próprio (não
 * precisa de BottomSheet); no iOS ele é inline, então escondemos atrás
 * de um toggle pra manter o mesmo comportamento em ambos.
 */
export function DatePickerInput({ label, value, onChange, error }: DatePickerInputProps) {
  const [open, setOpen] = useState(false);

  const handleChange = (event: { type: string }, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setOpen(false);
    }
    if (event.type === 'set' && selectedDate) {
      onChange(toISO(selectedDate));
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.field, { borderColor: error ? colors.danger : colors.border }]}
      >
        <Text style={styles.value}>{formatDisplay(value)}</Text>
        <Calendar size={18} color={colors.textSecondary} />
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {open ? (
        <DateTimePicker
          value={toDate(value)}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleChange}
          locale="pt-BR"
        />
      ) : null}

      {open && Platform.OS === 'ios' ? (
        <Pressable onPress={() => setOpen(false)} style={styles.iosDoneButton}>
          <Text style={styles.iosDoneText}>Concluir</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  field: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.sm,
    height: 52,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: { color: colors.textPrimary, fontSize: 16 },
  error: { color: colors.danger, fontSize: 12, marginTop: 4 },
  iosDoneButton: { alignSelf: 'flex-end', paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  iosDoneText: { color: colors.primary, fontWeight: '600' },
});
