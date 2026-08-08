import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ROUTES = [
  { fromLocation: 'Science', toLocation: 'Casford', fare: 3.0 },
  { fromLocation: 'Science', toLocation: 'Ayensu', fare: 3.0 },
  { fromLocation: 'Ayensu', toLocation: 'Science', fare: 3.0 },
  { fromLocation: 'Ayensu', toLocation: 'Casford', fare: 5.0 },
  { fromLocation: 'Casford', toLocation: 'Science', fare: 3.0 },
  { fromLocation: 'Amissah Arthur', toLocation: 'Science', fare: 4.0 },
  { fromLocation: 'Amissah Arthur', toLocation: 'Valco', fare: 4.0 },
  { fromLocation: 'Amissah Arthur', toLocation: 'KNH', fare: 5.0 },
  { fromLocation: 'Science', toLocation: 'Valco', fare: 3.0 },
];

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
    fullName: 'Admin Driver',
    email: 'admin.driver@payasyougo.com',
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
          rating: 5.0,
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
        rating: 5.0,
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

  console.log('Seeded routes + admin test accounts:');
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
