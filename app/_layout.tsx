import { useEffect } from "react";
import { Stack } from "expo-router";
import Head from "expo-router/head";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  configureNotificationHandler,
  requestNotificationPermissionAsync,
} from "@/utils/notifications";
import { useSettingsStore } from "@/stores/settingsStore";
import { APP_TITLE } from "@/constants/meta";

SplashScreen.preventAutoHideAsync();
configureNotificationHandler();

export default function RootLayout() {
  const { _hasHydrated } = useSettingsStore();

  useEffect(() => {
    if (!_hasHydrated) return;
    SplashScreen.hideAsync();
    requestNotificationPermissionAsync();
  }, [_hasHydrated]);

  return (
    <>
      <Head>
        <title>{APP_TITLE}</title>
      </Head>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
      </Stack>
    </>
  );
}
