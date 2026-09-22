/**
 * Notification preferences.
 *
 * The backend has no notification-preferences endpoint yet, so preferences are kept in the
 * browser, per gym. The Settings screen tells the user this so it is not mistaken for a
 * server-side setting.
 */

export interface NotificationPrefs {
  newMember: boolean;
  payment: boolean;
  maintenance: boolean;
  classChanges: boolean;
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  newMember: true,
  payment: true,
  maintenance: true,
  classChanges: false,
};

const key = (gymId: string) => `gymmate_notification_prefs_${gymId}`;

export function loadNotificationPrefs(gymId: string): NotificationPrefs {
  try {
    const raw = localStorage.getItem(key(gymId));
    if (!raw) return { ...DEFAULT_NOTIFICATION_PREFS };
    const parsed = JSON.parse(raw) as Partial<NotificationPrefs>;
    return {
      newMember: typeof parsed.newMember === "boolean" ? parsed.newMember : DEFAULT_NOTIFICATION_PREFS.newMember,
      payment: typeof parsed.payment === "boolean" ? parsed.payment : DEFAULT_NOTIFICATION_PREFS.payment,
      maintenance: typeof parsed.maintenance === "boolean" ? parsed.maintenance : DEFAULT_NOTIFICATION_PREFS.maintenance,
      classChanges: typeof parsed.classChanges === "boolean" ? parsed.classChanges : DEFAULT_NOTIFICATION_PREFS.classChanges,
    };
  } catch {
    return { ...DEFAULT_NOTIFICATION_PREFS };
  }
}

/** @returns false if the browser refused the write (private mode, quota). */
export function saveNotificationPrefs(gymId: string, prefs: NotificationPrefs): boolean {
  try {
    localStorage.setItem(key(gymId), JSON.stringify(prefs));
    return true;
  } catch {
    return false;
  }
}
