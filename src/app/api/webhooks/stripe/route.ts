import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === 'checkout.session.completed') {
    if (!session?.metadata?.bookingId) {
      return NextResponse.json({ error: 'Missing bookingId in session metadata' }, { status: 400 });
    }

    try {
      await prisma.booking.update({
        where: {
          id: session.metadata.bookingId,
        },
        data: {
          status: 'CONFIRMED',
        },
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
