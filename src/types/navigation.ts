import { ComponentProps } from 'react';
import { ViewStyle, TextStyle } from 'react-native';

export type RootStackParamList = {
  PassengerApp: undefined;
  DriverApp: undefined;
  Onboarding: undefined;
  Welcome: undefined;
  PassengerSignup: undefined;
  PassengerLogin: undefined;
  DriverLogin: undefined;
  DriverSignup: undefined;
};

export type PassengerTabParamList = {
  HomeTab: undefined;
  BookTab: undefined;
  HistoryTab: undefined;
  ProfileTab: undefined;
};

export type PassengerHomeStackParamList = {
  PassengerDashboard: undefined;
  BookTrip: undefined;
  EnterDriverId: {
    from: string;
    to: string;
    fare: number;
    routeId: string;
    prefillDriverId?: string;
  };
  ConfirmTrip: {
    from: string;
    to: string;
    fare: number;
    driver: any; // typed properly in screens
  };
  PaymentSuccess: {
    transaction: any;
    driver: any;
  };
  TripHistory: undefined;
  PassengerProfile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  NotificationsSettings: undefined;
};

export type PassengerBookStackParamList = {
  BookTrip: undefined;
  EnterDriverId: {
    from: string;
    to: string;
    fare: number;
    routeId: string;
    prefillDriverId?: string;
  };
  ConfirmTrip: {
    from: string;
    to: string;
    fare: number;
    driver: any;
  };
  PaymentSuccess: {
    transaction: any;
    driver: any;
  };
};

export type DriverTabParamList = {
  DashboardTab: undefined;
  TxnTab: undefined;
  WalletTab: undefined;
  ProfileTab: undefined;
};

export type DriverDashboardStackParamList = {
  DriverDashboard: undefined;
  TransactionHistory: undefined;
  DriverProfile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  NotificationsSettings: undefined;
};
