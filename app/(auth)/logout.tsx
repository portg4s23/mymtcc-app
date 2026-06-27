import { env } from "@/config/env";
import { clearToken } from "@/storage/secureStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const LOGOUT_URL = `${env.SSO_URL_BASE}/logout/?returnUrl=${env.APP_BASE_URL}&type=employee&appId=${env.APP_ID}`;

export default function Logout() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [handled, setHandled] = useState(false);

  const handleComplete = async () => {
    await clearToken(); // extra safety
    router.replace("/(auth)/login");
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ alignItems: 'center', padding: 16, backgroundColor: '#000' }}>
        <Text style={{ color: 'white' }}>Logout</Text>
      </View>
      <View style={{ flex: 1 }}>
        {loading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <ActivityIndicator size="large" />
          </View>
        )}

        <WebView
          source={{ uri: LOGOUT_URL }}
          onNavigationStateChange={(navState) => {
            const { url } = navState;

            // Prevent multiple triggers
            if (handled) return;

            // Check final redirect
            if (url.startsWith(env.APP_BASE_URL!)) {
              setHandled(true);
              handleComplete();
            }
          }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      </View>
    </SafeAreaView>
  );
}