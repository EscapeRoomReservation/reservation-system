import { prisma } from '@/lib/prisma';
import { Room } from '@prisma/client';
import RoomCard from '@/components/RoomCard';

async function getRooms(): Promise<Room[]> {
  return prisma.room.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export default async function HomePage() {
  const rooms = await getRooms();

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-10">
        Wybierz pokój i zarezerwuj przygodę!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </main>
  );
}

