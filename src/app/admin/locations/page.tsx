import { prisma } from '@/lib/prisma';
import { Location } from '@prisma/client';

async function getLocations(): Promise<Location[]> {
  try {
    const locations = await prisma.location.findMany({
      include: {
        owner: true, // Include owner details
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

export default async function AdminLocationsPage() {
  const locations = await getLocations();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Wszystkie lokalizacje</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Lokalizacja
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Właściciel
              </th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr key={location.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{location.name}</p>
                  <p className="text-gray-600 whitespace-no-wrap">{location.address}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{location.owner.name}</p>
                  <p className="text-gray-600 whitespace-no-wrap">{location.owner.email}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
