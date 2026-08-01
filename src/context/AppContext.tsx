// ============================================================
// APP CONTEXT (TypeScript)
// ============================================================
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_DRIVERS, MOCK_PASSENGERS, MOCK_PASSENGER_TRIPS, MOCK_DRIVER_TRANSACTIONS } from '../data/mockData';
import transactionService from '../services/transactionService';
import notificationService from '../services/notificationService';
import { Passenger, Driver, Transaction, User } from '../types';

interface AppContextType {
  currentUser: Passenger | Driver | null;
  userRole: 'passenger' | 'driver' | null;
  passengerTrips: Transaction[];
  driverTransactions: Transaction[];
  pendingNotification: any | null;
  loginPassenger: (phone: string, password: string, name?: string, email?: string) => { success: boolean; passenger?: Passenger; error?: string };
  loginDriver: (phone: string, password: string) => { success: boolean; driver?: Driver; error?: string };
  signupDriver: (phone: string, name: string, email: string, vehicle: string, password: string) => { success: boolean; driver?: Driver; error?: string };
  withdrawDriverFunds: (amount: number) => { success: boolean; error?: string };
  logout: () => void;
  finalizePaymentTransaction: (args: any) => { success: boolean; transaction?: Transaction; driver?: Driver; error?: string };
  clearNotification: () => void;
  getDriverData: () => Driver | null;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Passenger | Driver | null>(null);
  const [userRole, setUserRole] = useState<'passenger' | 'driver' | null>(null);
  const [passengerTrips, setPassengerTrips] = useState<Transaction[]>(MOCK_PASSENGER_TRIPS);
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [driverTransactions, setDriverTransactions] = useState<Transaction[]>(MOCK_DRIVER_TRANSACTIONS);
  const [pendingNotification, setPendingNotification] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe('app_context', (event: any) => {
      if (
        event.type === 'PAYMENT_RECEIVED' &&
        userRole === 'driver' &&
        currentUser?.id === event.driverId
      ) {
        setPendingNotification(event.payload);
      }
    });
    return unsubscribe;
  }, [userRole, currentUser]);

  const loginPassenger = (phone: string, password: string, name?: string, email?: string): { success: boolean; passenger?: Passenger; error?: string } => {
    let passenger = MOCK_PASSENGERS.find(p => p.phone === phone);
    if (passenger) {
      // Existing passenger — validate password
      if (passenger.password && passenger.password !== password) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }
    } else if (name) {
      // New passenger from signup — create account with password
      passenger = { id: 'PSG_' + Date.now(), name, phone, email: email || '', password, avatar: null };
    } else {
      return { success: false, error: 'No passenger account found with this phone number.' };
    }
    setCurrentUser(passenger);
    setUserRole('passenger');
    return { success: true, passenger };
  };

  const loginDriver = (phone: string, password: string) => {
    const driver = drivers.find(d => d.phone === phone);
    if (!driver) {
      return { success: false, error: 'No driver account found with this phone number' };
    }
    if (driver.password && driver.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }
    setCurrentUser(driver);
    setUserRole('driver');
    return { success: true, driver };
  };

  const signupDriver = (phone: string, name: string, email: string, vehicle: string, password: string) => {
    const existing = drivers.find(d => d.phone === phone);
    if (existing) {
      return { success: false, error: 'A driver with this phone number already exists' };
    }
    const nextIdNum = drivers.length + 1;
    const driverId = 'DRV' + String(nextIdNum).padStart(3, '0');
    const newDriver: Driver = {
      id: driverId,
      name,
      phone,
      email,
      vehicle,
      password,
      rating: 5.0,
      walletBalance: 0.00,
      todayEarnings: 0.00,
      totalTrips: 0,
    };
    setDrivers(prev => [...prev, newDriver]);
    setCurrentUser(newDriver);
    setUserRole('driver');
    return { success: true, driver: newDriver };
  };

  const withdrawDriverFunds = (amount: number) => {
    if (!currentUser || userRole !== 'driver') {
      return { success: false, error: 'No authenticated driver session found' };
    }
    const driver = drivers.find(d => d.id === currentUser.id);
    if (!driver) {
      return { success: false, error: 'Driver not found' };
    }
    if (driver.walletBalance < amount) {
      return { success: false, error: 'Insufficient balance' };
    }

    setDrivers(prev => prev.map(d => {
      if (d.id === driver.id) {
        return {
          ...d,
          walletBalance: d.walletBalance - amount,
        };
      }
      return d;
    }));

    setCurrentUser(prev => {
      if (prev && 'walletBalance' in prev) {
        return {
          ...prev,
          walletBalance: prev.walletBalance - amount,
        };
      }
      return prev;
    });

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRole(null);
    setPendingNotification(null);
  };

  const finalizePaymentTransaction = ({ driverId, passengerId, passengerName, from, to, fare, paymentRef, provider }: any) => {
    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return { success: false, error: 'Driver ID not found' };

    const { driverRecord, passengerRecord } = transactionService.createTransactionRecord({
      passengerId,
      passengerName,
      driverId,
      driverName: driver.name,
      from,
      to,
      fare,
      paymentRef,
      provider,
    });

    setDriverTransactions(prev => [driverRecord, ...prev]);
    setPassengerTrips(prev => [passengerRecord, ...prev]);

    setDrivers(prev => prev.map(d => {
      if (d.id === driverId) {
        return {
          ...d,
          walletBalance: d.walletBalance + fare,
          todayEarnings: d.todayEarnings + fare,
          totalTrips: d.totalTrips + 1,
        };
      }
      return d;
    }));

    notificationService.pushPaymentNotification({
      driverId,
      payload: {
        passengerName,
        amount: fare,
        from,
        to,
        date: driverRecord.date,
        time: driverRecord.time,
        txnId: driverRecord.id,
      },
    });

    return { success: true, transaction: passengerRecord, driver };
  };

  const clearNotification = () => setPendingNotification(null);

  const getDriverData = (): Driver | null => {
    if (!currentUser || userRole !== 'driver') return null;
    return drivers.find(d => d.id === currentUser.id) || (currentUser as Driver);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      userRole,
      loginPassenger,
      loginDriver,
      signupDriver,
      withdrawDriverFunds,
      logout,
      passengerTrips,
      driverTransactions,
      finalizePaymentTransaction,
      pendingNotification,
      clearNotification,
      getDriverData,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
