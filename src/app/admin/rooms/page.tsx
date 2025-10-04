import { prisma } from '@/lib/prisma';
import { Room } from '@prisma/client';

// Define a more specific type for the room with its relations
type RoomWithDetails = Room & {
  location: {
    name: string;
    owner: {
      name: string | null;
    };
  };
};

async function getRooms(): Promise<RoomWithDetails[]> {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        location: {
          include: {
            owner: true,
          },
        },
      },
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
      <h1 className="text-3xl font-bold mb-6">Wszystkie pokoje</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Pokój
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Lokalizacja
              </th>
               <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Właściciel
              </th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{room.name}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{room.location.name}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{room.location.owner.name}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}