import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as authService from '../services/authService';
import { fetchMyWallet } from '../services/driversService';
import { fetchTransactions } from '../services/transactionsService';
import { getToken } from '../services/apiClient';
import { Passenger, Driver, Transaction } from '../types';

type Role = 'passenger' | 'driver';

interface AppContextType {
  currentUser: Passenger | Driver | null;
  userRole: Role | null;
  passengerTrips: Transaction[];
  driverTransactions: Transaction[];
  pendingNotification: any | null;
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
  }) => Promise<{ success: boolean; driver?: Driver; error?: string }>;
  withdrawDriverFunds: (amount: number) => { success: boolean; error?: string };
  logout: () => Promise<void>;
  updateAvatar: (avatarUrl: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (input: {
    fullName?: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
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
  const [pendingNotification, setPendingNotification] = useState<any | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  const applyUser = useCallback((user: authService.AuthUser) => {
    setCurrentUser(user);
    setUserRole(user.role);
  }, []);

  const refreshTrips = useCallback(async () => {
    if (!userRole) return;
    try {
      const list = await fetchTransactions();
      if (userRole === 'passenger') setPassengerTrips(list);
      else setDriverTransactions(list);
    } catch {
      // keep previous list
    }
  }, [userRole]);

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
      const { user } = await authService.registerPassenger({
        fullName: input.name,
        phone: input.phone,
        email: input.email,
        password: input.password,
      });
      applyUser(user);
      return { success: true, passenger: user as Passenger };
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
  }) => {
    try {
      const { user } = await authService.registerDriver({
        fullName: input.name,
        phone: input.phone,
        email: input.email,
        password: input.password,
        vehicleInfo: input.vehicle,
      });
      applyUser(user);
      return { success: true, driver: user as Driver };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Registration failed' };
    }
  };

  const withdrawDriverFunds = (_amount: number) => {
    return {
      success: false,
      error: 'Withdrawals are not available yet. Coming soon.',
    };
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
        passengerTrips,
        driverTransactions,
        refreshTrips,
        refreshDriverWallet,
        pendingNotification,
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
