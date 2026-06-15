import { saveToken } from "@/storage/secureStore";
import { extractToken } from "@/utils/parseToken";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export const SSO_URL = "https://id.mtcc.com.mv/?returnUrl=https://my.mtcc.com.mv&type=employee&appId=9434025C-F2F3-4D93-B974-16743962AE46&kind=email";

export default function Login() {
  const router = useRouter();
  const webviewRef = useRef<WebView>(null);

  const [loading, setLoading] = useState(true);
  const [authing, setAuthing] = useState(false);

  const handleToken = (url: string) => {
    if (authing) return false;

    const token = extractToken(url);

    console.log('\nToken extracted:', token);

    if (token) {
      setAuthing(true);

      // Handle async token storage without blocking the return
      saveToken(token)
        .then(() => {
          // stop WebView navigation
          webviewRef.current?.stopLoading();

          // small delay avoids race conditions
          setTimeout(() => {
            router.replace("/(app)/wfh");
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
            return handleToken(req.url);
          }}
        />
      </View>
    </SafeAreaView>
  );
}