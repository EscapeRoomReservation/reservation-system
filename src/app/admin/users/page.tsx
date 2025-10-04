import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import RoleChanger from '@/components/admin/RoleChanger';

async function getUsers(): Promise<User[]> {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  const users = await getUsers();

  // This should not happen due to middleware, but as a safeguard
  if (!session || session.user.role !== 'ADMIN') {
    return <p>Access Denied</p>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Zarządzanie użytkownikami</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Użytkownik
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rola
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{user.name || 'Brak nazwy'}</p>
                  <p className="text-gray-600 whitespace-no-wrap">{user.email}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className={`relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight`}>
                    <span aria-hidden className={`absolute inset-0 ${user.role === 'ADMIN' ? 'bg-red-200' : user.role === 'OWNER' ? 'bg-yellow-200' : 'bg-green-200'} opacity-50 rounded-full`}></span>
                    <span className="relative">{user.role}</span>
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <RoleChanger user={user} currentUserId={session.user.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
