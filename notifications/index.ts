import { WORK_DAYS } from "@/constants/notifications";
import { parseNotificationTime } from "@/helpers";
import * as Notifications from "expo-notifications";

export async function resetWorkNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getAllScheduledNotifications() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled;
}

export async function scheduleSignInReminder(
  time: string,
) {

  const parsedTime = parseNotificationTime(time);

  if (!parsedTime) {
    console.warn(`Invalid sign-in reminder time: ${time}`);
    return;
  }

  const { hour, minute } = parsedTime;

  for (const weekday of WORK_DAYS) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Sign In Reminder',
        body: "Don't forget to check in.",
        sound: 'reminder.wav'
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        weekday,
        hour,
        minute,
      },
    });
  }
}

export async function scheduleSignOutReminder(
  time: string,
) {

  const parsedTime = parseNotificationTime(time);

  if (!parsedTime) {
    console.warn(`Invalid sign-out reminder time: ${time}`);
    return;
  }

  const { hour, minute } = parsedTime;

  for (const weekday of WORK_DAYS) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Sign Out Reminder',
        body: "Don't forget to check out.",
        sound: 'reminder.wav'
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        weekday,
        hour,
        minute,
      },
    });
  }
}

export async function ensureNotificationPermission() {
  const settings = await Notifications.getPermissionsAsync();

  if (!settings.granted) {
    const request = await Notifications.requestPermissionsAsync();
    if (!request.granted) {
      throw new Error("Notification permission not granted");
    }
  }
}

// Fn for testing notifications, triggers a notification in the next 1 minute
export async function triggerInNext1Minute() {
  // const now = dayjs();
  // const nextMinute = now.add(1, 'minute');

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "1 Minute Test",
      body: "Time interval trigger",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60,
    },
  });
}