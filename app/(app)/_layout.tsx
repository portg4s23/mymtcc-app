import { AppHeader } from '@/components/ui/AppHeader';
import UserAvatar from '@/components/ui/UserAvatar';
import { useAuth } from '@/context/AuthContext';
import { Stack } from 'expo-router';
import { Alert } from 'react-native';

export default function AppLayout() {

  const { user } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: ({ children }) => (
          <AppHeader title={children} />
        ),
        headerRight: () => (
          <UserAvatar
            user={user}
            onPress={() => Alert.alert('Profile Clicked', user?.fullName || 'Unknown User')}
            size={34}
          />
        ),
        headerStyle: {
          backgroundColor: '#000606',
        },
        headerShadowVisible: false,

        headerTitleAlign: 'left',

        headerLeft: () => null,
      }}
    >
      <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Stack.Screen name="wfh" options={{ title: 'Work From Home' }} />
    </Stack>
  );
}