import { NotificationDebugPanel } from '@/components/NotificationDebugPanel';
import { AppHeader } from '@/components/ui/AppHeader';
import { useTheme } from '@/hooks/use-theme-color';
import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NotificationSettingsBlock from './NotificationSettingsBlock';


type SettingsState = {
  enabled: boolean;
  signInTime: string;
  signOutTime: string;
};

const SettingsScreen = () => {

  const theme = useTheme();

  const sections = [
    {
      title: "Notifications",
      data: ["notifications_main"],
    },
    // {
    //   title: "Attendance",
    //   data: ["work_schedule"], // future
    // },
    // {
    //   title: "Account",
    //   data: ["profile", "security"], // future
    // },
  ];

  const renderItem = ({ item }: any) => {
    switch (item) {
      case "notifications_main":
        return <NotificationSettingsBlock />;

      // case "work_schedule":
      //   return <WorkScheduleBlock />;

      // case "profile":
      //   return <ProfileSettingsBlock />;

      default:
        return null;
    }
  };

  const renderSectionHeader = ({ section }: any) => {
    return <Text style={styles.sectionTitle}>{section.title}</Text>;
  };

  const insets = useSafeAreaInsets()

  return (
    <>
      <AppHeader title="Settings" style={{ paddingTop: insets.top + 14 }} />

      <View style={[styles.container, { backgroundColor: theme.background }]}>

        <View style={{}}>
          <SectionList
            sections={sections}
            keyExtractor={(item, index) => item + index}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            // contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <NotificationDebugPanel />

      </View>

    </>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 0, // for testing
    paddingBottom: 12
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 20,
    marginBottom: 8,
    textTransform: "uppercase",
  },

  placeholder: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
})