import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addMinutes } from 'date-fns';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      roomId,
      startTime,
      customerName,
      customerEmail,
    } = body;

    if (!roomId || !startTime || !customerName || !customerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const bookingStartTime = new Date(startTime);
    const bookingEndTime = addMinutes(bookingStartTime, room.duration);

    // Check for booking conflicts
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        roomId,
        AND: [
          {
            startTime: {
              lt: bookingEndTime,
            },
          },
          {
            endTime: {
              gt: bookingStartTime,
            },
          },
        ],
      },
    });

    if (conflictingBooking) {
      return NextResponse.json({ error: 'This time slot is no longer available' }, { status: 409 });
    }

    const newBooking = await prisma.booking.create({
      data: {
        roomId,
        startTime: bookingStartTime,
        endTime: bookingEndTime,
        customerName,
        customerEmail,
        // Status will be PENDING by default
      },
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
