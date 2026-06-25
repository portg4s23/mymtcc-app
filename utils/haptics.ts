import * as Haptics from 'expo-haptics';

/**
 * Light tap feedback (buttons, toggles)
 */
export const hapticLight = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

/**
 * Medium tap feedback (actions, selections)
 */
export const hapticMedium = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

/**
 * Heavy tap feedback (destructive actions, confirmations)
 */
export const hapticHeavy = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
};

/**
 * Success / warning / error feedback
 */
export const hapticNotification = (
  type: 'success' | 'warning' | 'error'
) => {
  const map = {
    success: Haptics.NotificationFeedbackType.Success,
    warning: Haptics.NotificationFeedbackType.Warning,
    error: Haptics.NotificationFeedbackType.Error,
  } as const;

  return Haptics.notificationAsync(map[type]);
};

/**
 * Selection change (like picker, tab switch)
 */
export const hapticSelection = () => {
  Haptics.selectionAsync();
};