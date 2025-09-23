import { Room } from '@prisma/client';
import Link from 'next/link';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <Link href={`/rooms/${room.id}`} className="group block bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
      <div className="relative overflow-hidden h-48">
        {/* Placeholder for an image */}
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">Zdjęcie pokoju</span>
        </div>
      </div>
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 truncate group-hover:text-blue-600 transition-colors">{room.name}</h2>
          <p className="text-gray-600 text-sm mb-4 h-20 overflow-hidden">{room.description}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center text-sm font-medium text-gray-500 mb-4">
            <span>Pojemność: <span className="font-bold text-gray-800">{room.capacity} osób</span></span>
            <span>Czas: <span className="font-bold text-gray-800">{room.duration} min</span></span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-blue-600">{room.price} PLN</span>
            <span className="inline-block bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-lg group-hover:bg-blue-700 transition-colors">
              Rezerwuj
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
