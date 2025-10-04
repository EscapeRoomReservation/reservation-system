import { prisma } from '@/lib/prisma';
import BookingForm from '@/components/BookingForm';
import { notFound } from 'next/navigation';

interface RoomDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
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
  const { id } = await params;
  const room = await getRoom(id);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative h-64 md:h-full">
          {/* Image Placeholder */}
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Zdjęcie pokoju</span>
          </div>
        </div>
        <div className="p-8 md:p-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{room.name}</h1>
          <p className="text-lg text-gray-600 mb-8">{room.description}</p>

          <div className="bg-gray-50/70 p-6 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Szczegóły</h2>
            <div className="space-y-4 text-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Cena:</span>
                <span className="font-bold text-xl text-blue-600">{room.price} PLN</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Pojemność:</span>
                <span className="font-semibold text-gray-900">do {room.capacity} osób</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Czas trwania:</span>
                <span className="font-semibold text-gray-900">{room.duration} minut</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-8 md:p-12 border-t border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Zarezerwuj termin</h2>
        <div className="max-w-3xl mx-auto">
          <BookingForm room={room} />
        </div>
      </div>
    </div>
  );
}
