import '../global.css';
import 'react-native-gesture-handler';
import React from 'react';
import { Stack } from 'expo-router';
import { AppProviders } from '../src/core/providers/AppProviders';
import { useAuth } from '../src/core/providers/AuthProvider';
import { colors } from '../src/core/theme';
import { Loading } from '../src/shared/components';

/**
 * Precisa ser um componente separado (não direto dentro de
 * `RootLayout`) porque `useAuth()` só funciona corretamente para
 * componentes renderizados DENTRO do `<AuthProvider>` — e o
 * `<AuthProvider>` só existe a partir de `<AppProviders>` pra baixo.
 * Se a gente chamasse `useAuth()` direto em `RootLayout`, pegaríamos
 * sempre o valor padrão do contexto (usuário nulo), nunca o valor real.
 */
function RootLayoutNav() {
  const { user, isLoading } = useAuth();

  // Enquanto o Firebase ainda não determinou se existe uma sessão
  // salva (ver AuthProvider), evita qualquer flash de tela errada.
  if (isLoading) {
    return <Loading fullScreen label="Carregando..." />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      {/* Só acessível logado */}
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="transaction/new"
          options={{ title: 'Nova Movimentação', presentation: 'modal' }}
        />
        <Stack.Screen name="transaction/[id]" options={{ title: 'Editar Movimentação' }} />
        <Stack.Screen name="saving/[id]" options={{ title: 'Meta' }} />
        <Stack.Screen name="analytics" options={{ title: 'Análises' }} />
      </Stack.Protected>

      {/* Só acessível deslogado */}
      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootLayoutNav />
    </AppProviders>
  );
}
