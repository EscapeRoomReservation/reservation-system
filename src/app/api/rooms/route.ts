import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'OWNER') {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const body = await req.json();
    const { locationId, name, description, capacity, price, duration } = body;

    if (!locationId || !name || !description || !capacity || !price || !duration) {
      return new NextResponse(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
    }

    const location = await prisma.location.findFirst({
      where: {
        id: locationId,
        ownerId: session.user.id,
      },
    });

    if (!location) {
      return new NextResponse(JSON.stringify({ message: 'Location not found or you do not have permission to access it' }), { status: 403 });
    }

    const room = await prisma.room.create({
      data: {
        locationId,
        name,
        description,
        capacity,
        price,
        duration,
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

export async function GET() {
  const rooms = await prisma.room.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json(rooms);
}
