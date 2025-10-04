import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { Location } from '@prisma/client';
import AddLocationForm from '@/components/owner/AddLocationForm';
import Link from 'next/link';

async function getOwnerLocations(ownerId: string): Promise<Location[]> {
  if (!ownerId) return [];

  try {
    const locations = await prisma.location.findMany({
      where: {
        ownerId: ownerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return locations;
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    return [];
  }
}

export default async function OwnerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'OWNER') {
    // This should be handled by middleware, but as a fallback:
    return <p>Access Denied</p>;
  }

  const locations = await getOwnerLocations(session.user.id);

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Panel Właściciela</h1>
        <p className="text-gray-600">Witaj, {session.user.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Twoje lokalizacje</h2>
          <div className="space-y-4">
            {locations.length > 0 ? (
              locations.map((location) => (
                <Link href={`/owner/locations/${location.id}`} key={location.id} className="block p-4 border rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors">
                  <h3 className="text-xl font-bold">{location.name}</h3>
                  <p className="text-gray-500">{location.address}</p>
                </Link>
              ))
            ) : (
              <p>Nie dodałeś jeszcze żadnej lokalizacji.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Dodaj nową lokalizację</h2>
          <div className="p-6 border rounded-lg shadow-sm bg-white">
            <AddLocationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
