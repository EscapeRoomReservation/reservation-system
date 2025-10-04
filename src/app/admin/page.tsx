import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Panel Administratora</h1>
      <p className="mb-8">Witaj, {session?.user?.name}! Jesteś zalogowany jako {session?.user?.role}.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/users" className="block p-6 bg-white border rounded-lg shadow hover:bg-gray-50">
          <h2 className="text-xl font-bold mb-2">Zarządzaj użytkownikami</h2>
          <p className="text-gray-600">Przeglądaj, edytuj role i zarządzaj kontami użytkowników.</p>
        </Link>
        <Link href="/admin/locations" className="block p-6 bg-white border rounded-lg shadow hover:bg-gray-50">
          <h2 className="text-xl font-bold mb-2">Zarządzaj lokalizacjami</h2>
          <p className="text-gray-600">Przeglądaj wszystkie lokalizacje w systemie.</p>
        </Link>
        <Link href="/admin/rooms" className="block p-6 bg-white border rounded-lg shadow hover:bg-gray-50">
          <h2 className="text-xl font-bold mb-2">Zarządzaj pokojami</h2>
          <p className="text-gray-600">Przeglądaj wszystkie pokoje w systemie.</p>
        </Link>
      </div>
    </div>
  );
}
