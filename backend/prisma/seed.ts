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
const TEST_PASSENGER = {
  phone: '0550000111',
  password: 'admin123',
  fullName: 'Kofi Mensah',
  email: 'kofi.mensah@payasyougo.com',
};

const TEST_DRIVERS = [
  {
    phone: '0240000001',
    password: 'driver123',
    fullName: 'Kwame Owusu',
    email: 'kwame.owusu@payasyougo.com',
    uniqueCode: 'DRV001',
    vehicleInfo: 'Toyota Yaris - ER 1234-21',
    ghanaCardNumber: 'GHA-100000001-1',
    licenseNumber: 'DL100001',
  },
  {
    phone: '0200000002',
    password: 'driver456',
    fullName: 'Ama Asantewaa',
    email: 'ama.asantewaa@payasyougo.com',
    uniqueCode: 'DRV002',
    vehicleInfo: 'Hyundai i10 - GR 5678-22',
    ghanaCardNumber: 'GHA-200000002-2',
    licenseNumber: 'DL200002',
  },
  {
    phone: '0240000111',
    password: 'admin123',
    fullName: 'Kwame Asiamah',
    email: 'kwame.asiamah@payasyougo.com',
    uniqueCode: 'DRV100',
    vehicleInfo: 'Toyota Corolla - GR 1000-24',
    ghanaCardNumber: 'GHA-300000003-3',
    licenseNumber: 'DL300100',
  },
] as const;

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

  const passengerHash = await bcrypt.hash(TEST_PASSENGER.password, 10);
  await prisma.user.upsert({
    where: { phone: TEST_PASSENGER.phone },
    update: {
      fullName: TEST_PASSENGER.fullName,
      email: TEST_PASSENGER.email,
      passwordHash: passengerHash,
      role: Role.PASSENGER,
    },
    create: {
      fullName: TEST_PASSENGER.fullName,
      phone: TEST_PASSENGER.phone,
      email: TEST_PASSENGER.email,
      passwordHash: passengerHash,
      role: Role.PASSENGER,
    },
  });

  for (const account of TEST_DRIVERS) {
    const driverHash = await bcrypt.hash(account.password, 10);
    const driverUser = await prisma.user.upsert({
      where: { phone: account.phone },
      update: {
        fullName: account.fullName,
        email: account.email,
        passwordHash: driverHash,
        role: Role.DRIVER,
      },
      create: {
        fullName: account.fullName,
        phone: account.phone,
        email: account.email,
        passwordHash: driverHash,
        role: Role.DRIVER,
        driver: {
          create: {
            uniqueCode: account.uniqueCode,
            vehicleInfo: account.vehicleInfo,
            ghanaCardNumber: account.ghanaCardNumber,
            ghanaCardVerified: true,
            licenseNumber: account.licenseNumber,
            licenseVerified: true,
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
          uniqueCode: account.uniqueCode,
          vehicleInfo: account.vehicleInfo,
          ghanaCardNumber: account.ghanaCardNumber,
          ghanaCardVerified: true,
          licenseNumber: account.licenseNumber,
          licenseVerified: true,
          rating: 0,
          ratingCount: 0,
        },
      });
    } else {
      await prisma.driver.update({
        where: { userId: driverUser.id },
        data: {
          uniqueCode: account.uniqueCode,
          vehicleInfo: account.vehicleInfo,
          ghanaCardNumber: account.ghanaCardNumber,
          ghanaCardVerified: true,
          licenseNumber: account.licenseNumber,
          licenseVerified: true,
        },
      });
    }
  }

  console.log(
    `Seeded ${ROUTES.length} routes across ${LOCATIONS.length} stops + admin test accounts:`
  );
  console.log(
    `  Passenger  phone=${TEST_PASSENGER.phone}  password=${TEST_PASSENGER.password}`
  );
  for (const account of TEST_DRIVERS) {
    console.log(
      `  Driver     phone=${account.phone}  password=${account.password}  code=${account.uniqueCode}`
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
