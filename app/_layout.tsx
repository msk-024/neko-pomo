import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { configureNotificationHandler, requestNotificationPermissionAsync } from '@/utils/notifications';
import { useSettingsStore } from '@/stores/settingsStore';

SplashScreen.preventAutoHideAsync();
configureNotificationHandler();

export default function RootLayout() {
  const { _hasHydrated, hasOnboarded } = useSettingsStore();

  useEffect(() => {
    // ストアの水和が完了するまでスプラッシュを維持する
    if (!_hasHydrated) return;

    SplashScreen.hideAsync();
    requestNotificationPermissionAsync();

    if (!hasOnboarded) {
      router.replace('/onboarding');
    }
  }, [_hasHydrated, hasOnboarded]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
      </Stack>
    </>
  );
}
