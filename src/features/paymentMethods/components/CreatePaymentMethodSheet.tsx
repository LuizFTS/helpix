import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Icons from 'lucide-react-native';
import { colors, spacing, radius } from '../../../core/theme';
import { BottomSheet, Input, Button } from '../../../shared/components';
import { useCreatePaymentMethod } from '../../../shared/hooks/usePaymentMethods';
import {
  PAYMENT_METHOD_ICONS,
  PaymentMethodIconName,
  defaultIconForType,
} from '../../../shared/constants/paymentMethodIcons';
import { PaymentMethodTypeToggle } from './PaymentMethodTypeToggle';

type CreatePaymentMethodSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function CreatePaymentMethodSheet({ visible, onClose }: CreatePaymentMethodSheetProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [color, setColor] = useState(colors.paymentMethodPalette[0]);
  const [icon, setIcon] = useState<PaymentMethodIconName>(defaultIconForType('expense'));
  // Só reajusta o ícone automaticamente pelo tipo enquanto o usuário
  // não tiver escolhido um manualmente — depois que ele toca em algum
  // ícone da lista, a troca de Entrada/Saída não pisa mais na escolha.
  const [iconTouched, setIconTouched] = useState(false);
  const [nameError, setNameError] = useState<string | undefined>();
  const createPaymentMethod = useCreatePaymentMethod();

  const handleChangeType = (nextType: 'income' | 'expense') => {
    setType(nextType);
    if (!iconTouched) {
      setIcon(defaultIconForType(nextType));
    }
  };

  const handleChangeIcon = (nextIcon: PaymentMethodIconName) => {
    setIcon(nextIcon);
    setIconTouched(true);
  };

  const resetForm = () => {
    setName('');
    setType('expense');
    setColor(colors.paymentMethodPalette[0]);
    setIcon(defaultIconForType('expense'));
    setIconTouched(false);
    setNameError(undefined);
  };

  const handleSave = async () => {
    if (name.trim().length < 2) {
      setNameError('Dê um nome pra esse método');
      return;
    }

    await createPaymentMethod.mutateAsync({ name: name.trim(), type, color, icon });
    resetForm();
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} heightPercent={0.74}>
      <Text style={styles.title}>Novo método de pagamento</Text>

      <PaymentMethodTypeToggle value={type} onChange={handleChangeType} />

      <Input
        label="Nome"
        placeholder="Ex: Nubank, Recebimentos..."
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (nameError) setNameError(undefined);
        }}
        error={nameError}
      />

      <Text style={styles.colorLabel}>ÍCONE</Text>
      <View style={styles.iconRow}>
        {PAYMENT_METHOD_ICONS.map((iconName) => {
          const IconComponent = Icons[iconName] as Icons.LucideIcon;
          const isActive = icon === iconName;
          return (
            <Pressable
              key={iconName}
              onPress={() => handleChangeIcon(iconName)}
              style={[
                styles.iconSwatch,
                { backgroundColor: isActive ? color : colors.surface },
                isActive ? styles.iconSwatchActive : null,
              ]}
            >
              <IconComponent size={18} color={isActive ? colors.white : colors.textSecondary} />
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.colorLabel}>COR</Text>
      <View style={styles.colorRow}>
        {colors.paymentMethodPalette.map((paletteColor) => (
          <Pressable
            key={paletteColor}
            onPress={() => setColor(paletteColor)}
            style={[
              styles.colorSwatch,
              { backgroundColor: paletteColor },
              color === paletteColor ? styles.colorSwatchActive : null,
            ]}
          />
        ))}
      </View>

      <View style={{ height: spacing.md }} />

      <Button label="Criar método" onPress={handleSave} isLoading={createPaymentMethod.isPending} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 16 },
  colorLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 10, letterSpacing: 0.5 },
  iconRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md },
  iconSwatch: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconSwatchActive: { borderColor: colors.textPrimary },
  colorRow: { flexDirection: 'row', marginBottom: spacing.sm },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchActive: { borderColor: colors.textPrimary },
});
