import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const LOCATIONS = [
  'Science',
  'Casford',
  'Ayensu',
  'Amissah Arthur',
  'Valco',
  'KNH',
] as const;

/** Undirected campus fares — seed expands each pair both ways */
const FARE_EDGES: Array<[string, string, number]> = [
  ['Science', 'Casford', 3],
  ['Science', 'Ayensu', 3],
  ['Science', 'Valco', 3],
  ['Science', 'Amissah Arthur', 4],
  ['Science', 'KNH', 4],
  ['Casford', 'Ayensu', 5],
  ['Casford', 'Valco', 4],
  ['Casford', 'Amissah Arthur', 5],
  ['Casford', 'KNH', 5],
  ['Ayensu', 'Valco', 4],
  ['Ayensu', 'Amissah Arthur', 4],
  ['Ayensu', 'KNH', 5],
  ['Valco', 'Amissah Arthur', 4],
  ['Valco', 'KNH', 4],
  ['Amissah Arthur', 'KNH', 5],
];

const ROUTES = FARE_EDGES.flatMap(([a, b, fare]) => [
  { fromLocation: a, toLocation: b, fare },
  { fromLocation: b, toLocation: a, fare },
]);

/** Fixed accounts for QA / Paystack test runs */
const TEST_ACCOUNTS = {
  passenger: {
    phone: '0550000111',
    password: 'admin123',
    fullName: 'Admin Passenger',
    email: 'admin.passenger@payasyougo.com',
  },
  driver: {
    phone: '0240000111',
    password: 'admin123',
    fullName: 'Kwame Asiamah',
    email: 'kwame.asiamah@payasyougo.com',
    uniqueCode: 'DRV100',
    vehicleInfo: 'Toyota Corolla - GR 1000-24',
  },
};

async function main() {
  for (const route of ROUTES) {
    await prisma.route.upsert({
      where: {
        fromLocation_toLocation: {
          fromLocation: route.fromLocation,
          toLocation: route.toLocation,
        },
      },
      update: { fare: route.fare, active: true },
      create: route,
    });
  }

  const passengerHash = await bcrypt.hash(TEST_ACCOUNTS.passenger.password, 10);
  await prisma.user.upsert({
    where: { phone: TEST_ACCOUNTS.passenger.phone },
    update: {
      fullName: TEST_ACCOUNTS.passenger.fullName,
      email: TEST_ACCOUNTS.passenger.email,
      passwordHash: passengerHash,
      role: Role.PASSENGER,
    },
    create: {
      fullName: TEST_ACCOUNTS.passenger.fullName,
      phone: TEST_ACCOUNTS.passenger.phone,
      email: TEST_ACCOUNTS.passenger.email,
      passwordHash: passengerHash,
      role: Role.PASSENGER,
    },
  });

  const driverHash = await bcrypt.hash(TEST_ACCOUNTS.driver.password, 10);
  const driverUser = await prisma.user.upsert({
    where: { phone: TEST_ACCOUNTS.driver.phone },
    update: {
      fullName: TEST_ACCOUNTS.driver.fullName,
      email: TEST_ACCOUNTS.driver.email,
      passwordHash: driverHash,
      role: Role.DRIVER,
    },
    create: {
      fullName: TEST_ACCOUNTS.driver.fullName,
      phone: TEST_ACCOUNTS.driver.phone,
      email: TEST_ACCOUNTS.driver.email,
      passwordHash: driverHash,
      role: Role.DRIVER,
      driver: {
        create: {
          uniqueCode: TEST_ACCOUNTS.driver.uniqueCode,
          vehicleInfo: TEST_ACCOUNTS.driver.vehicleInfo,
          rating: 0,
          ratingCount: 0,
        },
      },
    },
    include: { driver: true },
  });

  if (!driverUser.driver) {
    await prisma.driver.create({
      data: {
        userId: driverUser.id,
        uniqueCode: TEST_ACCOUNTS.driver.uniqueCode,
        vehicleInfo: TEST_ACCOUNTS.driver.vehicleInfo,
        rating: 0,
        ratingCount: 0,
      },
    });
  } else {
    await prisma.driver.update({
      where: { userId: driverUser.id },
      data: {
        uniqueCode: TEST_ACCOUNTS.driver.uniqueCode,
        vehicleInfo: TEST_ACCOUNTS.driver.vehicleInfo,
      },
    });
  }

  console.log(
    `Seeded ${ROUTES.length} routes across ${LOCATIONS.length} stops + admin test accounts:`
  );
  console.log(
    `  Passenger  phone=${TEST_ACCOUNTS.passenger.phone}  password=${TEST_ACCOUNTS.passenger.password}`
  );
  console.log(
    `  Driver     phone=${TEST_ACCOUNTS.driver.phone}  password=${TEST_ACCOUNTS.driver.password}  code=${TEST_ACCOUNTS.driver.uniqueCode}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
