import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import BookingForm from '@/components/BookingForm';
import { Room } from '@prisma/client';

interface RoomDetailsPageProps {
  params: {
    id: string;
  };
}

async function getRoom(id: string) {
  const room = await prisma.room.findUnique({
    where: { id },
  });

  if (!room) {
    notFound();
  }

  return room;
}

export default async function RoomDetailsPage({ params }: RoomDetailsPageProps) {
  const room = await getRoom(params.id);

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          {/* Image Placeholder */}
          <div className="w-full h-96 bg-gray-300 rounded-lg shadow-lg flex items-center justify-center">
            <span className="text-gray-500">Zdjęcie pokoju</span>
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold mb-4">{room.name}</h1>
          <p className="text-lg text-gray-700 mb-6">{room.description}</p>

          <div className="bg-gray-50 p-6 rounded-lg border">
            <h2 className="text-2xl font-bold mb-4">Szczegóły</h2>
            <div className="space-y-3 text-lg">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Cena:</span>
                <span className="font-bold text-blue-600">{room.price} PLN</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Pojemność:</span>
                <span className="font-bold">do {room.capacity} osób</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Czas trwania:</span>
                <span className="font-bold">{room.duration} minut</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Zarezerwuj termin</h2>
            <BookingForm room={room} />
          </div>
        </div>
      </div>
    </div>
  );
}
