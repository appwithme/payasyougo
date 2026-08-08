/**
 * Dev-only screenshot tour targets. Used by deep link `…/--/shot/:id`
 * and `scripts/capture-screenshots.sh`.
 */
export type ShotRole = 'guest' | 'passenger' | 'driver';

export type ShotTarget = {
  id: string;
  title: string;
  role: ShotRole;
  /** Root stack screen when guest */
  root?: string;
  /** Nested navigation after auth */
  passenger?: {
    tab: 'HomeTab' | 'BookTab' | 'HistoryTab' | 'ProfileTab';
    screen: string;
    params?: Record<string, unknown>;
  };
  driver?: {
    tab: 'DashboardTab' | 'TxnTab' | 'WalletTab' | 'ProfileTab';
    screen?: string;
    params?: Record<string, unknown>;
  };
};

const demoRoute = {
  from: 'Science',
  to: 'Casford',
  fare: 3,
  routeId: 'r1',
};

const demoDriver = {
  id: 'drv-demo',
  name: 'Ama Asantewaa',
  uniqueCode: 'DRV002',
  vehicleInfo: 'Hyundai i10 - GR 5678-22',
  rating: 4.9,
  phone: '0200000002',
};

const demoTxn = {
  id: 'txn-demo',
  from: 'Science',
  to: 'Casford',
  amount: 3,
  status: 'SUCCESS',
  paymentRef: 'PSK_DEMO',
  createdAt: new Date().toISOString(),
};

export const SHOT_TARGETS: ShotTarget[] = [
  { id: 'onboarding', title: 'Onboarding', role: 'guest', root: 'Onboarding' },
  { id: 'welcome', title: 'Welcome', role: 'guest', root: 'Welcome' },
  { id: 'passenger-login', title: 'Passenger login', role: 'guest', root: 'PassengerLogin' },
  { id: 'passenger-signup', title: 'Passenger signup', role: 'guest', root: 'PassengerSignup' },
  { id: 'driver-login', title: 'Driver login', role: 'guest', root: 'DriverLogin' },
  { id: 'driver-signup', title: 'Driver signup', role: 'guest', root: 'DriverSignup' },

  {
    id: 'passenger-home',
    title: 'Passenger home',
    role: 'passenger',
    passenger: { tab: 'HomeTab', screen: 'PassengerDashboard' },
  },
  {
    id: 'book-trip',
    title: 'Select route',
    role: 'passenger',
    passenger: { tab: 'BookTab', screen: 'BookTrip' },
  },
  {
    id: 'enter-driver',
    title: 'Link driver',
    role: 'passenger',
    passenger: {
      tab: 'HomeTab',
      screen: 'EnterDriverId',
      params: { ...demoRoute },
    },
  },
  {
    id: 'scan-qr',
    title: 'Scan driver QR',
    role: 'passenger',
    passenger: {
      tab: 'HomeTab',
      screen: 'ScanDriverQr',
      params: { ...demoRoute },
    },
  },
  {
    id: 'confirm-trip',
    title: 'Confirm & pay',
    role: 'passenger',
    passenger: {
      tab: 'HomeTab',
      screen: 'ConfirmTrip',
      params: { ...demoRoute, driver: demoDriver },
    },
  },
  {
    id: 'payment-success',
    title: 'Payment success',
    role: 'passenger',
    passenger: {
      tab: 'HomeTab',
      screen: 'PaymentSuccess',
      params: { transaction: demoTxn, driver: demoDriver },
    },
  },
  {
    id: 'trip-history',
    title: 'Trip history',
    role: 'passenger',
    passenger: { tab: 'HistoryTab', screen: 'TripHistory' },
  },
  {
    id: 'passenger-profile',
    title: 'Passenger profile',
    role: 'passenger',
    passenger: { tab: 'ProfileTab', screen: 'PassengerProfile' },
  },
  {
    id: 'passenger-edit-profile',
    title: 'Edit profile',
    role: 'passenger',
    passenger: { tab: 'ProfileTab', screen: 'EditProfile' },
  },
  {
    id: 'passenger-settings',
    title: 'Settings',
    role: 'passenger',
    passenger: { tab: 'ProfileTab', screen: 'Settings' },
  },
  {
    id: 'passenger-notifications',
    title: 'Notifications',
    role: 'passenger',
    passenger: { tab: 'ProfileTab', screen: 'NotificationsSettings' },
  },

  {
    id: 'driver-home',
    title: 'Driver dashboard',
    role: 'driver',
    driver: { tab: 'DashboardTab', screen: 'DriverDashboard' },
  },
  {
    id: 'driver-txns',
    title: 'Driver transactions',
    role: 'driver',
    driver: { tab: 'TxnTab' },
  },
  {
    id: 'driver-wallet',
    title: 'Driver wallet',
    role: 'driver',
    driver: { tab: 'WalletTab' },
  },
  {
    id: 'driver-profile',
    title: 'Driver profile',
    role: 'driver',
    driver: { tab: 'ProfileTab', screen: 'DriverProfile' },
  },
  {
    id: 'driver-qr',
    title: 'Driver QR',
    role: 'driver',
    driver: { tab: 'ProfileTab', screen: 'DriverQr' },
  },
  {
    id: 'driver-edit-profile',
    title: 'Driver edit profile',
    role: 'driver',
    driver: { tab: 'ProfileTab', screen: 'EditProfile' },
  },
  {
    id: 'driver-settings',
    title: 'Driver settings',
    role: 'driver',
    driver: { tab: 'ProfileTab', screen: 'Settings' },
  },
  {
    id: 'driver-notifications',
    title: 'Driver notifications',
    role: 'driver',
    driver: { tab: 'ProfileTab', screen: 'NotificationsSettings' },
  },
];

export function getShot(id: string): ShotTarget | undefined {
  return SHOT_TARGETS.find((s) => s.id === id);
}

/** Module flag so splash can be skipped while capturing. */
let shotMode = false;
let pendingShotId: string | null = null;

export function enableShotMode() {
  shotMode = true;
}
export function isShotMode() {
  return shotMode;
}
export function setPendingShot(id: string | null) {
  pendingShotId = id;
}
export function consumePendingShot() {
  const id = pendingShotId;
  pendingShotId = null;
  return id;
}
export function peekPendingShot() {
  return pendingShotId;
}
