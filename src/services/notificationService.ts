import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Transaction } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const PREFS_KEY = 'payasyougo_notification_prefs';
const SEEN_TXN_KEY = 'payasyougo_seen_txn_ids';

export type NotificationPrefs = {
  enabled: boolean;
  paymentAlerts: boolean;
  tripUpdates: boolean;
};

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  enabled: true,
  paymentAlerts: true,
  tripUpdates: true,
};

export type PendingPaymentNotification = {
  id: string;
  passengerName: string;
  from: string;
  to: string;
  amount: number;
};

let permissionAsked = false;

export async function loadNotificationPrefs(): Promise<NotificationPrefs> {
  try {
    const raw = await AsyncStorage.getItem(PREFS_KEY);
    if (!raw) return { ...DEFAULT_NOTIFICATION_PREFS };
    return { ...DEFAULT_NOTIFICATION_PREFS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_NOTIFICATION_PREFS };
  }
}

export async function saveNotificationPrefs(
  prefs: NotificationPrefs
): Promise<void> {
  await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export async function ensureNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const current = await Notifications.getPermissionsAsync();
  if (current.granted || current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }

  if (permissionAsked && !current.canAskAgain) return false;
  permissionAsked = true;

  const requested = await Notifications.requestPermissionsAsync();
  return (
    requested.granted ||
    requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

async function presentLocalNotification(title: string, body: string, data?: Record<string, string>) {
  const granted = await ensureNotificationPermission();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
      sound: true,
    },
    trigger: null,
  });
}

export async function notifyPassengerTripPaid(
  prefs: NotificationPrefs,
  trip: Pick<Transaction, 'from' | 'to' | 'amount'>
) {
  if (!prefs.enabled || !prefs.tripUpdates) return;

  const amount = Number(trip.amount).toFixed(2);
  await presentLocalNotification(
    'Payment successful',
    `GH₵${amount} paid for ${trip.from} → ${trip.to}`
  );
}

export async function notifyDriverPaymentReceived(
  prefs: NotificationPrefs,
  trip: PendingPaymentNotification
) {
  if (!prefs.enabled || !prefs.paymentAlerts) return;

  const amount = Number(trip.amount).toFixed(2);
  await presentLocalNotification(
    'Payment received',
    `${trip.passengerName} paid GH₵${amount} · ${trip.from} → ${trip.to}`
  );
}

async function loadSeenTxnIds(userId: string): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(`${SEEN_TXN_KEY}:${userId}`);
    if (!raw) return new Set();
    const list = JSON.parse(raw) as string[];
    return new Set(Array.isArray(list) ? list : []);
  } catch {
    return new Set();
  }
}

async function saveSeenTxnIds(userId: string, ids: Set<string>) {
  const trimmed = Array.from(ids).slice(-200);
  await AsyncStorage.setItem(`${SEEN_TXN_KEY}:${userId}`, JSON.stringify(trimmed));
}

/** First call seeds seen IDs. Later calls return newly completed driver payments. */
export async function detectNewDriverPayments(
  userId: string,
  transactions: Transaction[]
): Promise<PendingPaymentNotification[]> {
  const seen = await loadSeenTxnIds(userId);
  const completed = transactions.filter((t) => t.status === 'completed');
  const isFirstSeed = seen.size === 0;

  const fresh: PendingPaymentNotification[] = [];

  for (const t of completed) {
    if (seen.has(t.id)) continue;
    seen.add(t.id);
    if (!isFirstSeed) {
      fresh.push({
        id: t.id,
        passengerName: t.passengerName || 'Passenger',
        from: t.from,
        to: t.to,
        amount: Number(t.amount),
      });
    }
  }

  await saveSeenTxnIds(userId, seen);
  return fresh;
}

export default {
  loadNotificationPrefs,
  saveNotificationPrefs,
  ensureNotificationPermission,
  notifyPassengerTripPaid,
  notifyDriverPaymentReceived,
  detectNewDriverPayments,
};
