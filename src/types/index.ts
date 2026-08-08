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
}

export interface Transaction {
  id: string;
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

export type MoMoProvider = 'MTN' | 'VODAFONE' | 'AIRTELTIGO';

export interface RouteInfo {
  id: string;
  from: string;
  to: string;
  fare: number;
}
