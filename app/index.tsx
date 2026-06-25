import CustomSpinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { View } from "react-native";

export default function Index() {
  const { ready, authenticated } = useAuth();

  if (!ready) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <CustomSpinner />
    </View>
  );

  return authenticated
    ? <Redirect href="/(tabs)/dashboard" />
    : <Redirect href="/(auth)/login" />;
}