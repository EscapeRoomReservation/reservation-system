import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import AddRoomForm from '@/components/owner/AddRoomForm';
import DeleteRoomButton from '@/components/owner/DeleteRoomButton';
import Link from 'next/link';

async function getLocationDetails(locationId: string, ownerId: string) {
  const location = await prisma.location.findUnique({
    where: {
      id: locationId,
      ownerId: ownerId, // Security check: ensure the owner owns this location
    },
    include: {
      rooms: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!location) {
    notFound();

  return location;
}

interface LocationDetailsPageProps {
  params: {
    locationId: string;
  };
}

export default async function LocationDetailsPage({ params }: LocationDetailsPageProps) {
  const session = await getServerSession(authOptions);

{{ ... }}
    notFound();
  }

  const location = await getLocationDetails(params.locationId, session.user.id);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{location.name}</h1>
        <p className="text-gray-500">{location.address}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Pokoje w tej lokalizacji</h2>
          <div className="space-y-4">
            {location.rooms.length > 0 ? (
              location.rooms.map((room) => (
                <div key={room.id} className="p-4 border rounded-lg shadow-sm bg-white flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{room.name}</h3>
                    <p className="text-gray-600">Cena: {room.price} PLN</p>
                    <p className="text-gray-600">Pojemność: {room.capacity} os.</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link href={`/owner/locations/${location.id}/rooms/${room.id}/edit`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Edytuj</Link>
                    <DeleteRoomButton roomId={room.id} />
                  </div>
                </div>
              ))
            ) : (
              <p>Nie dodałeś jeszcze żadnych pokoi w tej lokalizacji.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Dodaj nowy pokój</h2>
          <div className="p-6 border rounded-lg shadow-sm bg-white">
            <AddRoomForm locationId={location.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
