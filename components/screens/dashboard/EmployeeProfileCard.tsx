import { env } from '@/config/env';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/use-theme-color';
import { User } from '@/models/User.model';
import { Image } from "expo-image";
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


const EmployeeProfileCard = ({ user }: { user: User | null }) => {

  const theme = useTheme()
  const { token } = useAuth()

  const hasProfile = !!user?.rcno;

  const size = 64

  return (
    <View style={{ ...styles.container, backgroundColor: theme.backgroundSecondary }}>
      <Image
        source={hasProfile
          ? {
            uri: `${env.APS_API_URL}/employee/photo/${user.rcno}`,
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
          : undefined}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={400}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          marginBottom: 12,
          borderWidth: 1.5,
          borderColor: theme.backgroundTertiary,
        }}
      />
      <Text style={{ ...styles.name, color: theme.text }}>{user?.fullName}</Text>
      <Text style={{ color: theme.textSecondary }}>{user?.email}</Text>
      <Text style={{ ...styles.rcno, color: theme.textSecondary, backgroundColor: theme.backgroundTertiary }}>{user?.rcno}</Text>
    </View>
  )
}

export default EmployeeProfileCard

const styles = StyleSheet.create({
  container: {
    padding: 20, borderRadius: 16,
    alignItems: "center",
    width: "100%",
    gap: 8,
  },
  name: {
    fontWeight: "bold",
    fontSize: 22,
  },
  rcno: {
    // fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
  }
})