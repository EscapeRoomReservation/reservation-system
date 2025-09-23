import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
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
      },
    });

    // Create a Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'p24'],
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: room.name,
              description: `Rezerwacja pokoju na dzień ${bookingStartTime.toLocaleDateString()} o godzinie ${bookingStartTime.toLocaleTimeString()}`,
            },
            unit_amount: room.price * 100, // Price in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/rooms/${room.id}`,
      metadata: {
        bookingId: newBooking.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
