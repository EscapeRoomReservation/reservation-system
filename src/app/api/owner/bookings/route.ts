import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'OWNER') {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }

  try {
    // Find all rooms owned by the current user
    const rooms = await prisma.room.findMany({
      where: {
        location: {
          ownerId: session.user.id,
        },
      },
    });

    const roomIds = rooms.map((room) => room.id);

    // Find all bookings for those rooms
    const bookings = await prisma.booking.findMany({
      where: {
        roomId: {
          in: roomIds,
        },
        // We don't want to show cancelled bookings on the calendar
        status: {
          not: 'CANCELLED',
        },
      },
      include: {
        room: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Format bookings for FullCalendar
    const events = bookings.map((booking) => ({
      id: booking.id,
      title: `${booking.room.name} (${booking.user.name || 'Użytkownik'})`,
      start: booking.startTime,
      end: booking.endTime,
      backgroundColor: booking.status === 'CONFIRMED' ? '#10B981' : '#F59E0B',
      borderColor: booking.status === 'CONFIRMED' ? '#059669' : '#D97706',
      extendedProps: {
        roomName: booking.room.name,
        userName: booking.user.name || 'Brak danych',
        userEmail: booking.user.email || 'Brak danych',
        status: booking.status,
      },
    }));

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching owner bookings:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
