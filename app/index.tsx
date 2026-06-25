import CustomSpinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { View } from "react-native";

export default function Index() {
  const { initializingToken, ready, loading: userLoading, user, token } = useAuth();

  const hasToken = !!token;

  // 1. still bootstrapping auth/user
  if (initializingToken || !ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <CustomSpinner />
      </View>
    );
  }

  // 2. no token → auth flow
  if (!hasToken) {
    return <Redirect href="/(auth)/login" />;
  }

  // 3. authenticated + ready → dashboard
  return <Redirect href="/(tabs)/dashboard" />;

}