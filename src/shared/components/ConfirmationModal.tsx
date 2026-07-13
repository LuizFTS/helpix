import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { colors, shadow } from '../../core/theme';
import { Button } from './Button';

type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Substitui o `Alert.alert` nativo (que usa o estilo do sistema
 * operacional) por um modal com a identidade visual do app — mesma
 * paleta escura, cantos e espaçamentos do resto das telas. Pensado
 * pra ações de confirmação (excluir, sair da conta, etc.), sempre
 * com um botão de cancelar e um de confirmação.
 */
export function ConfirmationModal({
  visible,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <Pressable
        className="flex-1 bg-overlay items-center justify-center px-lg"
        onPress={isLoading ? undefined : onCancel}
      >
        <Pressable
          className="w-full max-w-[360px] bg-backgroundElevated rounded-lg border border-border p-lg items-center"
          style={shadow.card}
          onPress={(e) => e.stopPropagation()}
        >
          <View
            className="w-12 h-12 rounded-full items-center justify-center mb-md"
            style={{ backgroundColor: destructive ? colors.dangerSoft : colors.primarySoft }}
          >
            <AlertTriangle size={22} color={destructive ? colors.danger : colors.primary} />
          </View>

          <Text className="text-textPrimary text-lg font-bold text-center mb-sm">{title}</Text>
          <Text className="text-textSecondary text-sm text-center leading-5 mb-lg">{message}</Text>

          <View className="flex-row w-full gap-sm">
            <View className="flex-1">
              <Button label={cancelLabel} variant="secondary" onPress={onCancel} disabled={isLoading} />
            </View>
            <View className="flex-1">
              <Button
                label={confirmLabel}
                variant={destructive ? 'danger' : 'primary'}
                onPress={onConfirm}
                isLoading={isLoading}
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
