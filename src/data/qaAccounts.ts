/** Seeded QA accounts from `backend/prisma/seed.ts` — for local autofill only. */
export const QA_PASSENGER = {
  phone: '0550000111',
  password: 'admin123',
  label: 'Admin Passenger',
} as const;

export const QA_DRIVERS = [
  {
    phone: '0240000001',
    password: 'driver123',
    label: 'Kwame Owusu',
    code: 'DRV001',
  },
  {
    phone: '0200000002',
    password: 'driver456',
    label: 'Ama Asantewaa',
    code: 'DRV002',
  },
  {
    phone: '0240000111',
    password: 'admin123',
    label: 'Kwame Asiamah',
    code: 'DRV100',
  },
] as const;

export const QA_DRIVER_DEFAULT = QA_DRIVERS[1];

/** Fresh signup samples — unique phone/ID each tap so re-registration works. */
function uniqueDigits(length: number) {
  const raw = `${Date.now()}${Math.floor(Math.random() * 1e6)}`.replace(/\D/g, '');
  return raw.slice(-length).padStart(length, '0');
}

export function makePassengerSignupSample() {
  const n = uniqueDigits(7);
  return {
    name: 'Kofi Mensah',
    phone: `055${n}`,
    email: `kofi.mensah.${n}@example.com`,
    password: 'signup123',
  };
}

export function makeDriverSignupSample() {
  const n = uniqueDigits(7);
  const cardDigits = uniqueDigits(9);
  return {
    name: 'Yaw Boateng',
    phone: `024${n}`,
    email: `yaw.boateng.${n}@example.com`,
    password: 'signup123',
    ghanaCard: `GHA-${cardDigits}-${cardDigits.slice(-1)}`,
    license: `NAG-${uniqueDigits(8)}-${uniqueDigits(5)}`,
    vehicleName: 'Toyota Corolla',
    vehicleNumber: 'GR 4321-25',
    vehicleColor: 'Silver',
  };
}