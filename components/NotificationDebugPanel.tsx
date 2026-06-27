import { resetWorkSettings } from '@/features/settings/work-settings';
import { formatNotificationTrigger } from '@/helpers/format-notification-trigger';
import { useTheme } from '@/hooks/use-theme-color';
import { getAllScheduledNotifications, resetWorkNotifications } from '@/notifications';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export const NotificationDebugPanel = () => {

  const theme = useTheme();
  const [notifications, setNotifications] = useState<any[]>([]);

  const load = async () => {
    const list = await getAllScheduledNotifications();
    setNotifications(list);
  };

  useEffect(() => {
    load();
  }, []);

  const clearNotifications = async () => {
    await resetWorkNotifications();
    await load();
  }

  const handleResetWorkSettings = async () => {
    await resetWorkSettings();
    await load();
  }

  return (
    <View style={{ flex: 1, marginTop: 0, padding: 12, backgroundColor: theme.backgroundSecondary, borderRadius: 8 }}>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <Text style={{ fontWeight: 'bold', color: theme.text }}>
          Debug Panel
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={load}>
            <Text style={{ color: theme.primary }}>Refresh</Text>
          </Pressable>
          <Pressable onPress={clearNotifications} style={{ marginLeft: 12 }}>
            <Text style={{ color: theme.primary }}>Clear</Text>
          </Pressable>
          <Pressable onPress={handleResetWorkSettings} style={{ marginLeft: 12 }}>
            <Text style={{ color: theme.primary }}>Reset WS</Text>
          </Pressable>
        </View>
      </View>

      {notifications.length === 0 ? (
        <Text style={{ color: theme.text }}>No scheduled notifications</Text>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          {notifications.map((n, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={{ color: theme.textSecondary }}>{`${n.content?.title} >> ${formatNotificationTrigger(n.trigger.dateComponents)}`}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};