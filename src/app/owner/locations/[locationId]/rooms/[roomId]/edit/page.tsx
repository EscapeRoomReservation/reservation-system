import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import EditRoomForm from '@/components/owner/EditRoomForm';

async function getRoomDetails(roomId: string, ownerId: string) {
  const room = await prisma.room.findFirst({
    where: {
      id: roomId,
      location: {
        ownerId: ownerId,
      },
    },
  });

  if (!room) {
    notFound();
  }

  return room;
}

interface EditRoomPageProps {
  params: {
    roomId: string;
  };
}

export default async function EditRoomPage({ params }: EditRoomPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'OWNER') {
    notFound();
  }

  const room = await getRoomDetails(params.roomId, session.user.id);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Edytuj pokój: {room.name}</h1>
      <div className="p-6 border rounded-lg shadow-md bg-white">
        <EditRoomForm room={room} />
      </div>
    </div>
  );
}
