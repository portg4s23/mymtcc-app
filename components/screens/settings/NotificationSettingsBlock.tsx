import TimePicker from '@/components/shared/TimePicker';
import { getWorkSettings, saveWorkSettings } from '@/features/settings/work-settings';
import { parseHHmmToDate } from '@/helpers';
import { useTheme } from '@/hooks/use-theme-color';
import { syncNotifications } from '@/notifications/syncNotifications';
import { DEFAULT_WORK_SETTINGS } from '@/storage/defaults';
import { hapticMedium } from '@/utils/haptics';
import dayjs from 'dayjs';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { SettingRow } from './SettingsRow';

const NotificationSettingsBlock = () => {

  const theme = useTheme();

  const [enabled, setEnabled] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerType, setTimePickerType] = useState<"signIn" | "signOut">("signIn");

  const [signInTime, setSignInTime] = useState<Date | null>(null);
  const [signOutTime, setSignOutTime] = useState<Date | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getWorkSettings();

      setEnabled(settings.notificationsEnabled);

      setSignInTime(
        parseHHmmToDate(settings.signInTime)
      );

      setSignOutTime(
        parseHHmmToDate(settings.signOutTime)
      );
    };

    loadSettings();
  }, []);

  const openTimePicker = (type: "signIn" | "signOut") => {
    hapticMedium();
    setTimePickerType(type);
    setShowTimePicker(true);
  }

  const handleToggle = async (value: boolean) => {

    hapticMedium();

    // Notification permissions check
    if (value) {
      const { status } = await Notifications.getPermissionsAsync();

      let finalStatus = status;

      if (status !== 'granted') {
        const request = await Notifications.requestPermissionsAsync();
        finalStatus = request.status;
      }

      if (finalStatus !== 'granted') {
        setEnabled(false);
        return;
      }
    }

    // UI update
    setEnabled(value);

    const current = await getWorkSettings();

    const updated = {
      ...current,
      notificationsEnabled: value,
    };

    await saveWorkSettings(updated);

    await syncNotifications(updated);
  };

  return (
    <>

      <View style={[styles.card, { backgroundColor: theme.backgroundSecondary }]}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>Attendance Reminders</Text>
          <Switch
            value={enabled}
            onValueChange={handleToggle}
            trackColor={{ true: theme.primary }}
          />
        </View>

        {enabled && (
          <View style={styles.subContainer}>

            {/* SIGN IN */}
            <SettingRow
              label="Sign-in Reminder"
              value={dayjs(signInTime).format('HH:mm')}
              showSwitch={false}
              switchValue={enabled}
              onSwitchChange={setEnabled}
              onPress={() => openTimePicker("signIn")}
              theme={theme}
            />

            {/* SIGN OUT */}
            <SettingRow
              label="Sign-out Reminder"
              value={dayjs(signOutTime).format('HH:mm')}
              showSwitch={false}
              switchValue={enabled}
              onSwitchChange={setEnabled}
              onPress={() => openTimePicker("signOut")}
              theme={theme}
            />

            <Text style={[styles.subtext, { color: theme.textSecondary }]}>
              You will be reminded based on your work schedule (excluding weekends)
            </Text>

          </View>
        )}
      </View>

      <TimePicker
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onApply={async (date) => {

          let nextSignIn = signInTime;
          let nextSignOut = signOutTime;

          if (timePickerType === 'signIn') {
            setSignInTime(date);
            nextSignIn = date;
          } else {
            setSignOutTime(date);
            nextSignOut = date;
          }

          // build updated settings
          const current = await getWorkSettings();

          const updated = {
            ...current,
            notificationsEnabled: enabled,
            signInTime: dayjs(nextSignIn).format('HH:mm'),
            signOutTime: dayjs(nextSignOut).format('HH:mm'),
          };

          // persist
          await saveWorkSettings(updated);

          // sync notifications
          await syncNotifications(updated);
        }}
        value={timePickerType === "signIn" ? signInTime ?? parseHHmmToDate(DEFAULT_WORK_SETTINGS.signInTime) : signOutTime ?? parseHHmmToDate(DEFAULT_WORK_SETTINGS.signOutTime)}
        theme={theme}
      />
    </>
  );
}

export default NotificationSettingsBlock

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subContainer: {
    marginTop: 12,
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  subtext: {
    marginTop: 8,
    fontSize: 12,
  },
})