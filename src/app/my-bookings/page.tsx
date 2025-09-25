import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function MyBookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/my-bookings');
  }

  const bookings = await prisma.booking.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      room: true, // Include room details in the query
    },
    orderBy: {
      startTime: 'desc',
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Moje rezerwacje</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-600">Nie masz jeszcze żadnych rezerwacji.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{booking.room.name}</h2>
                <p className="text-gray-600 mt-1">
                  {new Date(booking.startTime).toLocaleString('pl-PL')} - {new Date(booking.endTime).toLocaleString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-gray-500 mt-2">Status: <span className="font-medium">{booking.status}</span></p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">{(booking.room.price).toFixed(2)} PLN</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
