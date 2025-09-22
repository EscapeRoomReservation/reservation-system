import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rooms = await prisma.room.findMany();
    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, capacity, price, duration } = body;

    if (!name || !description || !capacity || !price || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newRoom = await prisma.room.create({
      data: {
        name,
        description,
        capacity: parseInt(capacity, 10),
        price: parseFloat(price),
        duration: parseInt(duration, 10),
      },
    });

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
