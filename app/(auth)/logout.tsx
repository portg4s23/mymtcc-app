import { APP_BASE_URL, APP_ID, SSO_URL_BASE } from "@/constants/app";
import { log } from "@/helpers";
import { clearToken } from "@/storage/secureStore";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

// export const SSO_URL = `${SSO_URL_BASE}/?returnUrl=https://my.mtcc.com.mv&type=employee&appId=${APP_ID}&kind=email`;
const LOGOUT_URL = `${SSO_URL_BASE}/logout/?returnUrl=${APP_BASE_URL}&type=employee&appId=${APP_ID}`;



export default function Logout() {
  const router = useRouter();
  const webviewRef = useRef<WebView>(null);

  const [loading, setLoading] = useState(true);
  const [authing, setAuthing] = useState(false);
  const [handled, setHandled] = useState(false);

  useEffect(() => {
    log('\nLogout> ', 'mounted');
  }, [])

  const handleComplete = async () => {
    log('> Logged out!');
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
            const { url, loading } = navState;

            // log('logout.nav', url);
            // log('logout.loading', loading);

            // Prevent multiple triggers
            if (handled) return;

            // Check final redirect
            if (url.startsWith(APP_BASE_URL)) {
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