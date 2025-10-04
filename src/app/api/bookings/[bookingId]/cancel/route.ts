import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { bookingId } = params;

    // Security Check: Ensure the booking belongs to the logged-in user
    const bookingToCancel = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!bookingToCancel || bookingToCancel.userId !== session.user.id) {
      return new NextResponse(
        JSON.stringify({ message: 'Booking not found or you do not have permission to cancel it' }),
        { status: 403 }
      );
    }

    // Optional: Add logic here to prevent cancellation of past or very recent bookings

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}