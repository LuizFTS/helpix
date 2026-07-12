import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../../../core/theme';
import { BottomSheet, Input, AmountInput, DatePickerInput, Button } from '../../../shared/components';
import { useCreateSavingGoal } from '../hooks/useSavings';

type CreateSavingGoalSheetProps = {
  visible: boolean;
  onClose: () => void;
};

function defaultDeadline(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
}

export function CreateSavingGoalSheet({ visible, onClose }: CreateSavingGoalSheetProps) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState(0);
  const [deadline, setDeadline] = useState(defaultDeadline());
  const [errors, setErrors] = useState<{ name?: string; targetAmount?: string }>({});
  const createGoal = useCreateSavingGoal();

  const resetForm = () => {
    setName('');
    setTargetAmount(0);
    setDeadline(defaultDeadline());
    setErrors({});
  };

  const handleSave = async () => {
    const nextErrors: typeof errors = {};
    if (name.trim().length < 2) nextErrors.name = 'Dê um nome pra essa caixinha';
    if (!targetAmount || targetAmount <= 0) nextErrors.targetAmount = 'Informe uma meta maior que zero';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    await createGoal.mutateAsync({ name: name.trim(), targetAmount, deadline });
    resetForm();
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} heightPercent={0.62}>
      <Text style={styles.title}>Nova caixinha</Text>

      <Input
        label="Nome"
        placeholder="Ex: Viagem, Reserva de emergência..."
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
        }}
        error={errors.name}
      />

      <AmountInput
        label="Meta (valor objetivo)"
        value={targetAmount}
        onChangeValue={(value) => {
          setTargetAmount(value);
          if (errors.targetAmount) setErrors((e) => ({ ...e, targetAmount: undefined }));
        }}
        error={errors.targetAmount}
      />

      <DatePickerInput label="Prazo (opcional)" value={deadline} onChange={setDeadline} />

      <Button label="Criar caixinha" onPress={handleSave} isLoading={createGoal.isPending} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 16 },
});
