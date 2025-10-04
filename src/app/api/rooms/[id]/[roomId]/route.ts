import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'OWNER') {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { roomId } = params;
    const body = await req.json();
    const { name, description, capacity, price, duration } = body;

    // Security Check
    const roomToUpdate = await prisma.room.findUnique({
      where: { id: roomId },
      include: { location: true },
    });

    if (!roomToUpdate || roomToUpdate.location.ownerId !== session.user.id) {
      return new NextResponse(
        JSON.stringify({ message: 'Room not found or you do not have permission to edit it' }),
        { status: 403 }
      );
    }

    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        name,
        description,
        capacity,
        price,
        duration,
      },
    });

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error('Error updating room:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'OWNER') {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { roomId } = params;

    // Security Check: Ensure the room belongs to a location owned by the user
    const roomToDelete = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        location: true,
      },
    });

    if (!roomToDelete || roomToDelete.location.ownerId !== session.user.id) {
      return new NextResponse(
        JSON.stringify({ message: 'Room not found or you do not have permission to delete it' }),
        { status: 403 }
      );
    }

    await prisma.room.delete({
      where: {
        id: roomId,
      },
    });

    return new NextResponse(null, { status: 204 }); // 204 No Content for successful deletion
  } catch (error) {
    console.error('Error deleting room:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
