import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Clear existing data in the correct order
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create users
  const hashedPassword = await bcrypt.hash('Test123!@#', 12);

  const adminUser = await prisma.user.create({
    data: {
      email: 'luk.gaw@o2.pl',
      name: 'Łukasz Gaw',
      hashedPassword: hashedPassword,
      role: 'ADMIN',
    },
  });

  const ownerUser = await prisma.user.create({
    data: {
      email: 'owner@example.com',
      name: 'Jan Właściciel',
      hashedPassword: hashedPassword, // Using the same password for simplicity
      role: 'OWNER',
    },
  });

  console.log(`Created admin: ${adminUser.email} and owner: ${ownerUser.email}`);

  // 3. Create a location for the owner
  const location = await prisma.location.create({
    data: {
      name: 'Escape Room Center',
      address: 'ul. Tajemnicza 1, 00-001 Warszawa',
      ownerId: ownerUser.id,
    },
  });

  console.log(`Created location: ${location.name}`);

  // 4. Create rooms and associate them with the location
  await prisma.room.create({
    data: {
      locationId: location.id,
      name: 'The Alchemist\'s Lab',
      description: 'Uncover the secrets of the philosopher\'s stone before the time runs out. A room full of puzzles and magical artifacts.',
      capacity: 4,
      price: 120.50,
      duration: 60,
    },
  });

  await prisma.room.create({
    data: {
      locationId: location.id,
      name: 'Space Odyssey',
      description: 'Your spaceship has been damaged. Repair the systems and escape the black hole. A futuristic adventure for sci-fi lovers.',
      capacity: 6,
      price: 150.00,
      duration: 75,
    },
  });

  await prisma.room.create({
    data: {
      locationId: location.id,
      name: 'Mayan Tomb Raider',
      description: 'Explore the ancient tomb of a Mayan king. Avoid traps and find the hidden treasure. An adventure for the brave.',
      capacity: 8,
      price: 180.00,
      duration: 90,
    },
  });

  console.log('Created 3 rooms.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
