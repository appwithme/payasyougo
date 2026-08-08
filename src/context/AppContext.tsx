import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as authService from '../services/authService';
import { fetchMyWallet } from '../services/driversService';
import { fetchTransactions } from '../services/transactionsService';
import {
  initiateWithdrawal,
  waitForWithdrawal,
  type WithdrawalRecord,
} from '../services/withdrawalsService';
import { getToken } from '../services/apiClient';
import notificationService, {
  DEFAULT_NOTIFICATION_PREFS,
  NotificationPrefs,
  PendingPaymentNotification,
} from '../services/notificationService';
import { Passenger, Driver, Transaction, MoMoProvider } from '../types';

type Role = 'passenger' | 'driver';

interface AppContextType {
  currentUser: Passenger | Driver | null;
  userRole: Role | null;
  passengerTrips: Transaction[];
  driverTransactions: Transaction[];
  pendingNotification: PendingPaymentNotification | null;
  notificationPrefs: NotificationPrefs;
  bootstrapping: boolean;
  loginPassenger: (
    phone: string,
    password: string
  ) => Promise<{ success: boolean; passenger?: Passenger; error?: string }>;
  loginPassengerWithGoogle: (
    idToken: string
  ) => Promise<{ success: boolean; passenger?: Passenger; error?: string }>;
  loginPassengerWithGoogleCode: (
    code: string,
    redirectUri: string
  ) => Promise<{ success: boolean; passenger?: Passenger; error?: string }>;
  registerPassenger: (input: {
    name: string;
    phone: string;
    email?: string;
    password: string;
  }) => Promise<{ success: boolean; passenger?: Passenger; error?: string }>;
  loginDriver: (
    phone: string,
    password: string
  ) => Promise<{ success: boolean; driver?: Driver; error?: string }>;
  signupDriver: (input: {
    phone: string;
    name: string;
    email: string;
    vehicle: string;
    password: string;
    ghanaCardNumber: string;
    licenseNumber: string;
  }) => Promise<{ success: boolean; driver?: Driver; error?: string }>;
  withdrawDriverFunds: (input: {
    amount: number;
    provider: MoMoProvider;
    momoPhone: string;
    onStatus?: (msg: string) => void;
  }) => Promise<{
    success: boolean;
    error?: string;
    withdrawal?: WithdrawalRecord;
    demo?: boolean;
    walletBalance?: number;
  }>;
  logout: () => Promise<void>;
  updateAvatar: (avatarUrl: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (input: {
    fullName?: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateNotificationPrefs: (prefs: NotificationPrefs) => Promise<void>;
  notifyTripPaid: (trip: Pick<Transaction, 'from' | 'to' | 'amount'>) => Promise<void>;
  refreshTrips: () => Promise<void>;
  refreshDriverWallet: () => Promise<void>;
  clearNotification: () => void;
  getDriverData: () => Driver | null;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Passenger | Driver | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [passengerTrips, setPassengerTrips] = useState<Transaction[]>([]);
  const [driverTransactions, setDriverTransactions] = useState<Transaction[]>([]);
  const [pendingNotification, setPendingNotification] =
    useState<PendingPaymentNotification | null>(null);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>(
    DEFAULT_NOTIFICATION_PREFS
  );
  const [bootstrapping, setBootstrapping] = useState(true);
  const prefsRef = useRef(notificationPrefs);
  prefsRef.current = notificationPrefs;

  const applyUser = useCallback((user: authService.AuthUser) => {
    setCurrentUser(user);
    setUserRole(user.role);
  }, []);

  const refreshTrips = useCallback(async () => {
    if (!userRole) return;
    try {
      const list = await fetchTransactions();
      if (userRole === 'passenger') {
        setPassengerTrips(list);
        return;
      }

      setDriverTransactions(list);

      const userId = currentUser?.id;
      if (!userId) return;

      const fresh = await notificationService.detectNewDriverPayments(userId, list);
      if (fresh.length === 0) return;

      const latest = fresh[0];
      setPendingNotification(latest);
      await notificationService.notifyDriverPaymentReceived(prefsRef.current, latest);
      await fetchMyWallet()
        .then((wallet) => setCurrentUser(wallet))
        .catch(() => undefined);
    } catch {
      // keep previous list
    }
  }, [userRole, currentUser?.id]);

  const refreshDriverWallet = useCallback(async () => {
    if (userRole !== 'driver') return;
    try {
      const wallet = await fetchMyWallet();
      setCurrentUser(wallet);
    } catch {
      // ignore
    }
  }, [userRole]);

  useEffect(() => {
    (async () => {
      try {
        const prefs = await notificationService.loadNotificationPrefs();
        setNotificationPrefs(prefs);
        const token = await getToken();
        if (!token) return;
        const user = await authService.fetchMe();
        applyUser(user);
      } catch {
        await authService.logout();
      } finally {
        setBootstrapping(false);
      }
    })();
  }, [applyUser]);

  useEffect(() => {
    if (userRole) {
      refreshTrips();
      if (userRole === 'driver') refreshDriverWallet();
    }
  }, [userRole, refreshTrips, refreshDriverWallet]);

  // Poll for driver payment alerts while signed in
  useEffect(() => {
    if (userRole !== 'driver') return;
    const id = setInterval(() => {
      refreshTrips();
    }, 12000);
    return () => clearInterval(id);
  }, [userRole, refreshTrips]);

  const loginPassenger = async (phone: string, password: string) => {
    try {
      const { user } = await authService.login(phone, password);
      if (user.role !== 'passenger') {
        await authService.logout();
        return { success: false, error: 'This account is not a passenger account.' };
      }
      applyUser(user);
      return { success: true, passenger: user as Passenger };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Login failed' };
    }
  };

  const loginPassengerWithGoogle = async (idToken: string) => {
    try {
      const { user } = await authService.loginWithGoogle(idToken);
      if (user.role !== 'passenger') {
        await authService.logout();
        return { success: false, error: 'Google sign-in is only for passengers.' };
      }
      applyUser(user);
      return { success: true, passenger: user as Passenger };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Google sign-in failed' };
    }
  };

  const loginPassengerWithGoogleCode = async (code: string, redirectUri: string) => {
    try {
      const { user } = await authService.loginWithGoogleCode(code, redirectUri);
      if (user.role !== 'passenger') {
        await authService.logout();
        return { success: false, error: 'Google sign-in is only for passengers.' };
      }
      applyUser(user);
      return { success: true, passenger: user as Passenger };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Google sign-in failed' };
    }
  };

  const registerPassenger = async (input: {
    name: string;
    phone: string;
    email?: string;
    password: string;
  }) => {
    try {
      await authService.registerPassenger({
        fullName: input.name,
        phone: input.phone,
        email: input.email,
        password: input.password,
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Registration failed' };
    }
  };

  const loginDriver = async (phone: string, password: string) => {
    try {
      const { user } = await authService.login(phone, password);
      if (user.role !== 'driver') {
        await authService.logout();
        return { success: false, error: 'This account is not a driver account.' };
      }
      applyUser(user);
      return { success: true, driver: user as Driver };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Login failed' };
    }
  };

  const signupDriver = async (input: {
    phone: string;
    name: string;
    email: string;
    vehicle: string;
    password: string;
    ghanaCardNumber: string;
    licenseNumber: string;
  }) => {
    try {
      await authService.registerDriver({
        fullName: input.name,
        phone: input.phone,
        email: input.email,
        password: input.password,
        vehicleInfo: input.vehicle,
        ghanaCardNumber: input.ghanaCardNumber,
        licenseNumber: input.licenseNumber,
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Registration failed' };
    }
  };

  const withdrawDriverFunds = async (input: {
    amount: number;
    provider: MoMoProvider;
    momoPhone: string;
    onStatus?: (msg: string) => void;
  }) => {
    try {
      input.onStatus?.('Requesting withdrawal…');
      const started = await initiateWithdrawal({
        amount: input.amount,
        provider: input.provider,
        momoPhone: input.momoPhone,
      });

      if (started.wallet) {
        setCurrentUser(started.wallet);
      }

      if (started.status === 'completed') {
        input.onStatus?.('Withdrawal sent');
        await Promise.all([refreshDriverWallet(), refreshTrips()]);
        return {
          success: true,
          withdrawal: started.withdrawal,
          demo: started.demo,
          walletBalance: Number(started.wallet?.walletBalance ?? 0),
        };
      }

      if (started.status === 'failed') {
        await refreshDriverWallet();
        return {
          success: false,
          error:
            started.withdrawal.failureReason ||
            started.displayText ||
            'Withdrawal failed',
        };
      }

      input.onStatus?.(started.displayText || 'Processing MoMo payout…');
      const finished = await waitForWithdrawal(started.withdrawalId, {
        onTick: (status) => {
          if (status === 'pending') {
            input.onStatus?.('Waiting for MoMo payout…');
          }
        },
      });

      setCurrentUser(finished.wallet);
      await refreshTrips();
      return {
        success: true,
        withdrawal: finished.withdrawal,
        demo: started.demo,
        walletBalance: Number(finished.wallet?.walletBalance ?? 0),
      };
    } catch (err: any) {
      await refreshDriverWallet();
      return {
        success: false,
        error: err?.message || 'Withdrawal failed',
      };
    }
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setUserRole(null);
    setPassengerTrips([]);
    setDriverTransactions([]);
    setPendingNotification(null);
  };

  const updateAvatar = async (avatarUrl: string) => {
    try {
      const user = await authService.updateAvatar(avatarUrl);
      setCurrentUser(user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Could not update photo' };
    }
  };

  const updateProfile = async (input: {
    fullName?: string;
    phone?: string;
  }) => {
    try {
      const user = await authService.updateProfile(input);
      setCurrentUser(user);
      return { success: true };
    } catch (err: any) {
      if (err?.status === 401) {
        await authService.logout();
        setCurrentUser(null);
        setUserRole(null);
        return {
          success: false,
          error: 'Your session expired. Please sign in again.',
        };
      }
      return { success: false, error: err?.message || 'Could not update profile' };
    }
  };

  const updateNotificationPrefs = async (prefs: NotificationPrefs) => {
    setNotificationPrefs(prefs);
    await notificationService.saveNotificationPrefs(prefs);
  };

  const notifyTripPaid = async (trip: Pick<Transaction, 'from' | 'to' | 'amount'>) => {
    await notificationService.notifyPassengerTripPaid(prefsRef.current, trip);
  };

  const clearNotification = () => setPendingNotification(null);

  const getDriverData = (): Driver | null => {
    if (!currentUser || userRole !== 'driver') return null;
    return currentUser as Driver;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userRole,
        loginPassenger,
        loginPassengerWithGoogle,
        loginPassengerWithGoogleCode,
        registerPassenger,
        loginDriver,
        signupDriver,
        withdrawDriverFunds,
        logout,
        updateAvatar,
        updateProfile,
        updateNotificationPrefs,
        notifyTripPaid,
        passengerTrips,
        driverTransactions,
        refreshTrips,
        refreshDriverWallet,
        pendingNotification,
        notificationPrefs,
        clearNotification,
        getDriverData,
        bootstrapping,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
