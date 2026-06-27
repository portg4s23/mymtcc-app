import { apsClient } from '@/api/apsClient';
import { ApolloProvider } from "@apollo/client/react";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import 'react-native-reanimated';

import { AuthProvider } from '@/context/AuthContext';
import { getWorkSettings } from '@/features/settings/work-settings';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getAllScheduledNotifications } from '@/notifications';
import { syncNotifications } from '@/notifications/syncNotifications';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as Notifications from "expo-notifications";
import { useEffect } from 'react';
import { KeyboardProvider } from "react-native-keyboard-controller";

export const unstable_settings = {
  anchor: '(tabs)',
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();


  // Initialize notifications on app start by checking if notifications are already scheduled. If not, schedule them based on the saved settings.
  useEffect(() => {
    const initNotifications = async () => {
      const scheduledNotifications = await getAllScheduledNotifications();

      if (scheduledNotifications.length > 0) {
        return;
      }

      const settings = await getWorkSettings();

      await syncNotifications(settings);
    };

    initNotifications();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ApolloProvider client={apsClient}>
          <AuthProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <KeyboardProvider>
                <Stack screenOptions={{
                  headerShown: false,
                }}
                  initialRouteName="(tabs)"
                >
                  <Stack.Screen
                    name="(tabs)"
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="request-remote-attendance"
                    options={{
                      presentation: "modal",
                      headerShown: false,
                    }}
                  />
                </Stack>
                <StatusBar style="auto" />
              </KeyboardProvider>
            </ThemeProvider>
          </AuthProvider>
        </ApolloProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
