import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { id: roomId } = params;

    if (!roomId) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        roomId: roomId,
        // Optional: you might want to only fetch future bookings
        startTime: {
          gte: new Date(),
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
