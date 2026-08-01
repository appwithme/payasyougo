import { Passenger, Driver, Transaction, RouteInfo } from '../types';

export const generateTransactionId = (): string => {
  return 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export const MOCK_PASSENGERS: Passenger[] = [
  {
    id: 'PSG_1',
    name: 'Kofi Mensah',
    phone: '0551002000',
    email: 'kofi@example.com',
    password: 'pass1234',
    avatar: null,
  }
];

export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'DRV001',
    name: 'Kwame Owusu',
    email: 'kwame@payasyougo.com',
    password: 'driver123',
    phone: '0240000001',
    vehicle: 'Toyota Yaris - ER 1234-21',
    rating: 4.8,
    walletBalance: 125.50,
    todayEarnings: 45.00,
    totalTrips: 15,
  },
  {
    id: 'DRV002',
    name: 'Ama Asantewaa',
    email: 'ama@payasyougo.com',
    password: 'driver456',
    phone: '0200000002',
    vehicle: 'Hyundai i10 - GR 5678-22',
    rating: 4.9,
    walletBalance: 80.00,
    todayEarnings: 25.00,
    totalTrips: 8,
  }
];

export const ROUTES: RouteInfo[] = [
  { id: 'r1', from: 'Science', to: 'Casford', fare: 3.00 },
  { id: 'r2', from: 'Science', to: 'Ayensu', fare: 3.00 },
  { id: 'r3', from: 'Ayensu', to: 'Science', fare: 3.00 },
  { id: 'r4', from: 'Ayensu', to: 'Casford', fare: 5.00 },
  { id: 'r5', from: 'Casford', to: 'Science', fare: 3.00 },
  { id: 'r6', from: 'Amissah Arthur', to: 'Science', fare: 4.00 },
  { id: 'r7', from: 'Amissah Arthur', to: 'Valco', fare: 4.00 },
  { id: 'r8', from: 'Amissah Arthur', to: 'KNH', fare: 5.00 },
  { id: 'r9', from: 'Science', to: 'Valco', fare: 3.00 },
];

export const LOCATIONS: string[] = [
  'Science',
  'Casford',
  'Ayensu',
  'Amissah Arthur',
  'Valco',
  'KNH',
];

export const MOCK_PASSENGER_TRIPS: Transaction[] = [
  {
    id: 'TXN123456789',
    driverName: 'Kwame Owusu',
    driverId: 'DRV001',
    amount: 3.00,
    from: 'Science',
    to: 'Casford',
    date: '2023-10-25',
    time: '08:30 AM',
    status: 'completed'
  },
  {
    id: 'TXN987654321',
    driverName: 'Ama Asantewaa',
    driverId: 'DRV002',
    amount: 5.00,
    from: 'Ayensu',
    to: 'Casford',
    date: '2023-10-24',
    time: '02:15 PM',
    status: 'completed'
  }
];

export const MOCK_DRIVER_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN123456789',
    passengerName: 'Kofi Mensah',
    passengerId: 'PSG_1',
    amount: 3.00,
    from: 'Science',
    to: 'Casford',
    date: '2023-10-25',
    time: '08:30 AM',
    status: 'completed'
  },
  {
    id: 'TXN456789123',
    passengerName: 'Akosua Serwaa',
    passengerId: 'PSG_2',
    amount: 4.00,
    from: 'Amissah Arthur',
    to: 'Science',
    date: '2023-10-25',
    time: '09:45 AM',
    status: 'completed'
  }
];
