import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'OWNER') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, address } = body;

    if (!name || !address) {
      return new NextResponse('Name and address are required', { status: 400 });
    }

    const location = await prisma.location.create({
      data: {
        name,
        address,
        ownerId: session.user.id,
      },
    });

    return NextResponse.json(location);
  } catch (error) {
    console.error('Error creating location:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
