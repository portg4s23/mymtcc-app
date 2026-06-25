import { useAuth } from '@/context/AuthContext';
import { getToken } from '@/storage/secureStore';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {

  const { user } = useAuth()

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();

      if (!token) return;

      const masked = `${token.slice(0, 4)}...${token.slice(-4)}`;

      setToken(masked);
    };

    fetchToken();
  }, []);

  const data = [
    { key: "authToken", label: "Auth Token:", value: token },
    { key: "id", label: "Id:", value: user?.id },
    { key: "fullname", label: "Full Name:", value: user?.fullName },
    { key: "rcno", label: "RCNO:", value: user?.rcno },
    { key: "email", label: "Email:", value: user?.email },
  ];

  return (
    <View style={styles.container}>

      <FlatList
        data={data}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ padding: 20 }}
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

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
