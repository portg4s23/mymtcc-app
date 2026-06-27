import { AppHeader } from '@/components/ui/AppHeader';
import { useAuth } from '@/context/AuthContext';
import { maskJwtToken } from '@/helpers';
import { useTheme } from '@/hooks/use-theme-color';
import { Feather } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {

  const theme = useTheme()
  const { user, logout, token } = useAuth()

  const data = [
    { key: "authToken", label: "Auth Token:", value: token ? maskJwtToken(token) : "N/A" },
    { key: "id", label: "Id:", value: user?.id },
    { key: "fullname", label: "Full Name:", value: user?.fullName },
    { key: "rcno", label: "RCNO:", value: user?.rcno },
    { key: "email", label: "Email:", value: user?.email },
  ];

  return (
    <>

      <AppHeader title="Profile (WIP)" />

      <View style={styles.container}>

        <FlatList
          data={data}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ padding: 20, backgroundColor: theme.backgroundSecondary, borderRadius: 12, marginBottom: 20 }}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  color: "white",
                  width: 100,
                }}
              >
                {item.label}
              </Text>

              <Text style={{ color: "white", flex: 1, textAlign: "right" }}>
                {item.value}
              </Text>
            </View>
          )}
        />

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={logout}
            style={{
              backgroundColor: theme.error,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 12,
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

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
