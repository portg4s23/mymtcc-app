import { useTheme } from '@/hooks/use-theme-color';
import { FontAwesome5, FontAwesome6, Octicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {

  const theme = useTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: theme.backgroundSecondary,
        },
        headerShown: false,
        headerStyle: {
          backgroundColor: theme.background
        },
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        headerLeft: () => null,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Octicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wfh"
        options={{
          title: 'Remote',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="laptop-code" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
