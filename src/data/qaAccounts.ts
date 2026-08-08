/** Seeded QA accounts from `backend/prisma/seed.ts` — for local autofill only. */
export const QA_PASSENGER = {
  phone: '0550000111',
  password: 'admin123',
  label: 'Kofi Mensah',
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

function pick<T extends readonly string[]>(list: T): T[number] {
  return list[Math.floor(Math.random() * list.length)];
}

const FIRST_NAMES = [
  'Kwame',
  'Ama',
  'Kofi',
  'Abena',
  'Yaw',
  'Akosua',
  'Kojo',
  'Adwoa',
  'Kwesi',
  'Efua',
  'Fiifi',
  'Esi',
  'Nana',
  'Akua',
  'Yaw',
  'Serwaa',
] as const;

const LAST_NAMES = [
  'Mensah',
  'Owusu',
  'Boateng',
  'Asante',
  'Osei',
  'Appiah',
  'Darko',
  'Agyeman',
  'Frimpong',
  'Adjei',
  'Sarpong',
  'Ofori',
  'Amoah',
  'Nyarko',
  'Baffoe',
  'Tetteh',
] as const;

function randomPerson() {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  const slug = `${first}.${last}`.toLowerCase().replace(/\s+/g, '');
  return {
    name: `${first} ${last}`,
    emailLocal: slug,
  };
}

export function makePassengerSignupSample() {
  const n = uniqueDigits(7);
  const person = randomPerson();
  return {
    name: person.name,
    phone: `055${n}`,
    email: `${person.emailLocal}.${n}@example.com`,
    password: 'signup123',
  };
}

export function makeDriverSignupSample() {
  const n = uniqueDigits(7);
  const cardDigits = uniqueDigits(9);
  const person = randomPerson();
  const vehicle = makeVehicleSignupSample();
  return {
    name: person.name,
    phone: `024${n}`,
    email: `${person.emailLocal}.${n}@example.com`,
    password: 'signup123',
    ghanaCard: `GHA-${cardDigits}-${cardDigits.slice(-1)}`,
    license: `NAG-${uniqueDigits(8)}-${uniqueDigits(5)}`,
    ...vehicle,
  };
}

const VEHICLE_NAMES = [
  'Toyota Corolla',
  'Hyundai i10',
  'Honda Civic',
  'Kia Rio',
  'Nissan Almera',
  'Suzuki Swift',
  'Toyota Yaris',
  'Volkswagen Polo',
] as const;

const VEHICLE_COLORS = [
  'Silver',
  'White',
  'Black',
  'Blue',
  'Red',
  'Grey',
  'Wine',
  'Gold',
] as const;

const PLATE_PREFIXES = ['GR', 'ER', 'AS', 'GT', 'WR', 'CR'] as const;

/** Random car details only — does not touch account/ID fields. */
export function makeVehicleSignupSample() {
  const plate = `${pick(PLATE_PREFIXES)} ${uniqueDigits(4)}-${uniqueDigits(2)}`;
  return {
    vehicleName: pick(VEHICLE_NAMES),
    vehicleNumber: plate,
    vehicleColor: pick(VEHICLE_COLORS),
  };
}