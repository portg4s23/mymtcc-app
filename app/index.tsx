import { getToken } from "@/storage/secureStore";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    getToken().then((token) => {
      setHasToken(!!token);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return hasToken ? (
    <Redirect href="/(app)/wfh" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}