import { Room } from '@prisma/client';
import Link from 'next/link';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <Link href={`/rooms/${room.id}`} className="block border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Placeholder for an image */}
      <div className="h-48 bg-gray-300 flex items-center justify-center">
        <span className="text-gray-500">Zdjęcie pokoju</span>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2 truncate">{room.name}</h2>
        <p className="text-gray-700 mb-4 h-20 overflow-hidden text-ellipsis">{room.description}</p>
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>{room.price} PLN</span>
          <span className="text-gray-600 font-medium">{room.capacity} osób</span>
        </div>
        <div className="mt-4 text-center bg-blue-600 text-white py-2 rounded-md">
          Zobacz szczegóły i rezerwuj
        </div>
      </div>
    </Link>
  );
}
