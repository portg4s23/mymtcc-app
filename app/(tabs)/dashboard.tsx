import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/use-theme-color";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Dashboard() {

  const { user, logout } = useAuth();
  const theme = useTheme()

  return (
    <View style={styles.container}>

      <View className="mb-4">
        <Text style={{ color: theme.text }}>Welcome, {user?.name || "User"}!</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={logout}
        style={{
          backgroundColor: theme.primary,
          paddingHorizontal: 20,
          paddingVertical: 14,
          borderRadius: 16,
          alignItems: "center",
          borderWidth: 1,
          flexDirection: "row",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Feather name="log-out" size={16} color={theme.text} />
        <Text style={{ color: theme.text }}>Logout</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  userInfo: {
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
});