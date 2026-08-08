// ============================================================
// TYPES
// ============================================================

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Passenger extends User {
  password?: string;
  avatar: string | null;
}

export interface Driver extends User {
  password?: string;
  vehicle: string;
  rating: number;
  ratingCount: number;
  walletBalance: number;
  todayEarnings: number;
  totalTrips: number;
  avatar?: string | null;
  ghanaCardNumber?: string;
  ghanaCardVerified?: boolean;
  licenseNumber?: string;
  licenseVerified?: boolean;
}

export interface Transaction {
  id: string;
  /** Trip fare vs wallet cash-out. Defaults to trip when omitted. */
  kind?: 'trip' | 'withdrawal';
  amount: number;
  from: string;
  to: string;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  paymentRef?: string;
  provider?: string;
  // Passenger perspective
  driverName?: string;
  driverId?: string;
  // Driver perspective
  passengerName?: string;
  passengerId?: string;
  passengerRating?: number;
}

export type MoMoProvider = 'MTN' | 'TELECEL';

export interface RouteInfo {
  id: string;
  from: string;
  to: string;
  fare: number;
}
