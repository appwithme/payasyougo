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

  // Optional QA drivers (DB only — never shown as demo hints in the app UI)
  const passwordHash = await bcrypt.hash('driver123', 10);

  const kwame = await prisma.user.upsert({
    where: { phone: '0240000001' },
    update: {},
    create: {
      fullName: 'Kwame Owusu',
      phone: '0240000001',
      email: 'kwame@payasyougo.com',
      passwordHash,
      role: Role.DRIVER,
      driver: {
        create: {
          uniqueCode: 'DRV001',
          vehicleInfo: 'Toyota Yaris - ER 1234-21',
          rating: 4.8,
        },
      },
    },
  });

  const amaHash = await bcrypt.hash('driver456', 10);
  await prisma.user.upsert({
    where: { phone: '0200000002' },
    update: {},
    create: {
      fullName: 'Ama Asantewaa',
      phone: '0200000002',
      email: 'ama@payasyougo.com',
      passwordHash: amaHash,
      role: Role.DRIVER,
      driver: {
        create: {
          uniqueCode: 'DRV002',
          vehicleInfo: 'Hyundai i10 - GR 5678-22',
          rating: 4.9,
        },
      },
    },
  });

  const passengerHash = await bcrypt.hash('pass1234', 10);
  await prisma.user.upsert({
    where: { phone: '0551002000' },
    update: {},
    create: {
      fullName: 'Kofi Mensah',
      phone: '0551002000',
      email: 'kofi@example.com',
      passwordHash: passengerHash,
      role: Role.PASSENGER,
    },
  });

  console.log(`Seeded ${ROUTES.length} routes + QA users (Kwame=${kwame.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
