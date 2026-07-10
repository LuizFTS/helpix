import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../src/core/theme';

export default function MaisScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mais opções em breve</Text>
      <Text style={styles.subtitle}>Preferências, métodos de pagamento, exportação.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { color: colors.textPrimary, fontSize: 18, fontWeight: '600' },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 8, textAlign: 'center' },
});
