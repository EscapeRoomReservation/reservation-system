import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  await prisma.room.deleteMany();

  await prisma.room.create({
    data: {
      name: 'The Alchemist\'s Lab',
      description: 'Uncover the secrets of the philosopher\'s stone before the time runs out. A room full of puzzles and magical artifacts.',
      capacity: 4,
      price: 120.50,
      duration: 60,
    },
  });

  await prisma.room.create({
    data: {
      name: 'Space Odyssey',
      description: 'Your spaceship has been damaged. Repair the systems and escape the black hole. A futuristic adventure for sci-fi lovers.',
      capacity: 6,
      price: 150.00,
      duration: 75,
    },
  });

  await prisma.room.create({
    data: {
      name: 'Mayan Tomb Raider',
      description: 'Explore the ancient tomb of a Mayan king. Avoid traps and find the hidden treasure. An adventure for the brave.',
      capacity: 8,
      price: 180.00,
      duration: 90,
    },
  });

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
