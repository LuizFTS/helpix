import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Settings, Database } from 'lucide-react-native';
import { colors, spacing } from '../../src/core/theme';
import { Button } from '../../src/shared/components';
import { seedFirestoreIfEmpty } from '../../src/core/services/seedFirestore';

export default function MaisScreen() {
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const result = await seedFirestoreIfEmpty();
      Alert.alert(result.seeded ? 'Dados criados' : 'Nada a fazer', result.message);
    } catch (error) {
      Alert.alert('Erro ao popular dados', String(error));
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <View style={styles.container}>
      <Settings color={colors.textSecondary} size={40} />
      <Text style={styles.title}>Mais opções em breve</Text>
      <Text style={styles.subtitle}>Preferências, métodos de pagamento, exportação.</Text>

      <View style={{ height: spacing.xl }} />

      <View style={styles.seedBox}>
        <Database color={colors.primary} size={20} />
        <Text style={styles.seedTitle}>Popular dados iniciais (Firestore)</Text>
        <Text style={styles.seedDescription}>
          Cria os métodos de pagamento e transações de exemplo no seu banco, uma única vez
          (não duplica se já existirem dados).
        </Text>
        <View style={{ height: spacing.md }} />
        <Button label="Popular dados de exemplo" onPress={handleSeed} isLoading={isSeeding} variant="secondary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  title: { color: colors.textPrimary, fontSize: 18, fontWeight: '600', marginTop: spacing.md },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.sm, textAlign: 'center' },
  seedBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  seedTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '700', marginTop: spacing.sm, textAlign: 'center' },
  seedDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 18,
  },
});
