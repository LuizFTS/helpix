import '../global.css';
import 'react-native-gesture-handler';
import React from 'react';
import { Stack } from 'expo-router';
import { AppProviders } from '../src/core/providers/AppProviders';
import { colors } from '../src/core/theme';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="transaction/new"
          options={{ title: 'Nova Movimentação', presentation: 'modal' }}
        />
        <Stack.Screen name="transaction/[id]" options={{ title: 'Editar Movimentação' }} />
        <Stack.Screen name="saving/[id]" options={{ title: 'Meta' }} />
      </Stack>
    </AppProviders>
  );
}
