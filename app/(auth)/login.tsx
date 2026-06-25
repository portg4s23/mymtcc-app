import { APP_ID, SSO_URL_BASE } from "@/constants/app";
import { useAuth } from "@/context/AuthContext";
import { log, maskJwtToken } from "@/helpers";
import { saveToken } from "@/storage/secureStore";
import { extractToken } from "@/utils/parseToken";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export const SSO_URL = `${SSO_URL_BASE}/?returnUrl=https://my.mtcc.com.mv&type=employee&appId=${APP_ID}&kind=email`;

export default function Login() {
  const router = useRouter();

  const { setToken } = useAuth();

  const webviewRef = useRef<WebView>(null);

  const [loading, setLoading] = useState(true);
  const [authing, setAuthing] = useState(false);

  useEffect(() => {
    log('\nLogin >', 'mounted');
  }, [])

  const handleToken = (url: string) => {
    if (authing) return false;

    const token = extractToken(url);

    if (token) {
      setAuthing(true);

      // Handle async token storage without blocking the return
      saveToken(token)
        .then(() => {
          log('Login > handleToken', maskJwtToken(token));

          // stop WebView navigation
          webviewRef.current?.stopLoading();

          // small delay avoids race conditions
          setTimeout(() => {
            setToken(token);
            router.replace("/");
          }, 200);
        })
        .catch(() => {
          setAuthing(false);
        });

      return false;
    }

    return true;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ alignItems: 'center', padding: 16, backgroundColor: '#000' }}>
        <Text style={{ color: 'white' }}>Login</Text>
      </View>
      <View style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}>
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
          ref={webviewRef}
          source={{ uri: SSO_URL }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onShouldStartLoadWithRequest={(req) => {
            return handleToken(req.url);
          }}
        />
      </View>
    </SafeAreaView>
  );
}