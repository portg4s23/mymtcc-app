import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MeData {
  me: {
    id: string;
    fullName: string;
    email: string;
    rcno: string;
    division: string;
    divisionId: string;
    divisionCode: string;
    phoneMobile: string;
    phoneOffice: string;
    permissions: string[];
  };
}

export default function Dashboard() {
  const router = useRouter();

  const { user, logout } = useAuth();

  // Get me Query
  // const [me, { loading, data, error }] = useLazyQuery<MeData>(ME_QUERY, {
  //   client: aa2Client
  // });

  // // Fetch user data on mount
  // useEffect(() => {
  //   console.log("[Dashboard] Component mounted, fetching user data...");
  //   me()
  //     .then((result) => {
  //       console.log("[Dashboard] Query completed:", result);
  //     })
  //     .catch((err) => {
  //       console.log("[Dashboard] Query failed:", err);
  //     });
  // }, []);

  return (
    <View style={styles.container}>

      <View className="mb-4">
        <Text style={{ color: 'white' }}>Welcome, {user?.fullName || "User"}!</Text>
      </View>

      <TouchableOpacity
        onPress={logout}
        style={{
          backgroundColor: '#1677FF',
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: 'white' }}>Logout</Text>
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