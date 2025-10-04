import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'OWNER') {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const body = await req.json();
    const { locationId, name, description, capacity, price, duration, imageUrl } = body;

    if (!locationId || !name || !description || !capacity || !price || !duration) {
      return new NextResponse(JSON.stringify({ message: 'All fields except image are required' }), { status: 400 });
    }

    // Security check: ensure the location belongs to the owner
    const location = await prisma.location.findFirst({
      where: {
        id: locationId,
        ownerId: session.user.id,
      },
    });

    if (!location) {
      return new NextResponse(JSON.stringify({ message: 'Location not found or you do not have permission' }), { status: 403 });
    }

    const room = await prisma.room.create({
      data: {
        locationId,
        name,
        description,
        capacity,
        price,
        duration,
        imageUrl,
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