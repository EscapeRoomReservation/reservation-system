import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { id } = params;
    const { role } = (await req.json()) as { role: Role };

    if (!Object.values(Role).includes(role)) {
      return new NextResponse(JSON.stringify({ message: 'Invalid role' }), { status: 400 });
    }

    // Prevent admin from changing their own role
    if (session.user.id === id) {
        return new NextResponse(JSON.stringify({ message: 'Admin cannot change their own role' }), { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: { role },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
