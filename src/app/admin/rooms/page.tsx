import { prisma } from '@/lib/prisma';
import { Room } from '@prisma/client';
import AddRoomForm from '@/components/admin/AddRoomForm';

async function getRooms(): Promise<Room[]> {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return rooms;
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    return [];
  }
}

export default async function AdminRoomsPage() {
  const rooms = await getRooms();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Zarządzanie pokojami</h1>

      <div className="mb-10 p-6 border rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-semibold mb-4">Dodaj nowy pokój</h2>
        <AddRoomForm />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Lista istniejących pokoi</h2>
        <div className="space-y-4">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div key={room.id} className="border p-4 rounded-lg shadow-sm bg-white">
                <h3 className="font-bold text-xl">{room.name}</h3>
                <p className="text-gray-600 mt-1">{room.description}</p>
                <div className="flex space-x-4 mt-2 text-sm text-gray-800">
                  <span>Pojemność: <strong>{room.capacity} os.</strong></span>
                  <span>Cena: <strong>{room.price} PLN</strong></span>
                  <span>Czas trwania: <strong>{room.duration} min.</strong></span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Nie dodano jeszcze żadnych pokoi.</p>
          )}
        </div>
      </div>
    </div>
  );
}
