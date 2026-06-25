import { APP_ID } from "@/constants/app";
import { saveToken } from "@/storage/secureStore";
import { extractToken } from "@/utils/parseToken";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export const SSO_URL = `https://id.mtcc.com.mv/?returnUrl=https://my.mtcc.com.mv&type=employee&appId=${APP_ID}&kind=email`;

export default function Login() {
  const router = useRouter();
  const webviewRef = useRef<WebView>(null);

  const [loading, setLoading] = useState(true);
  const [authing, setAuthing] = useState(false);

  console.log('hit login')

  const handleToken = (url: string) => {
    if (authing) return false;

    const token = extractToken(url);

    if (token) {
      setAuthing(true);

      // Handle async token storage without blocking the return
      saveToken(token)
        .then(() => {
          console.log('Token saved successfully:', token);

          // stop WebView navigation
          webviewRef.current?.stopLoading();

          // small delay avoids race conditions
          setTimeout(() => {
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
          ref={webviewRef}
          source={{ uri: SSO_URL }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onShouldStartLoadWithRequest={(req) => {
            console.log('login.webview.request', req.url);
            return handleToken(req.url);
          }}
        />
      </View>
    </SafeAreaView>
  );
}