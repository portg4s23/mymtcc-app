import { WorkSettings } from '@/types/work-settings.type';
import { resetWorkNotifications, scheduleSignInReminder, scheduleSignOutReminder } from '.';

/**
 * Clears all scheduled notifications and sets up new ones based on the provided settings.
 * If notifications are disabled in the settings, it will only clear existing notifications without scheduling new ones.
 */
export async function syncNotifications(
  settings: WorkSettings,
) {

  await resetWorkNotifications();

  if (!settings.notificationsEnabled) {
    return;
  }

  // Test notifications to ensure they are working
  // await triggerInNext1Minute()

  await scheduleSignInReminder(
    settings.signInTime,
  );

  await scheduleSignOutReminder(
    settings.signOutTime,
  );
}