import { apsClient } from '@/api/apsClient';
import { ApolloProvider } from "@apollo/client/react";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import 'react-native-reanimated';

import { AuthProvider } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { KeyboardProvider } from "react-native-keyboard-controller";

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ApolloProvider client={apsClient}>
          <AuthProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              {/* <AppGate> */}
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
              {/* </AppGate> */}
            </ThemeProvider>
          </AuthProvider>
        </ApolloProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
