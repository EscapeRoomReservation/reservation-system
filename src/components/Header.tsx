'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

const Header = () => {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900 hover:text-blue-600 transition-colors">
          EscapeRoom
        </Link>
        <nav className="flex items-center space-x-8">
          <ul className="flex space-x-8 font-medium text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Pokoje
              </Link>
            </li>
            {session && (
              <>
                <li>
                  <Link href="/my-bookings" className="hover:text-blue-600 transition-colors">
                    Moje Rezerwacje
                  </Link>
                </li>
                {session.user.role === 'OWNER' && (
                  <li>
                    <Link href="/owner" className="hover:text-blue-600 transition-colors">
                      Panel Właściciela
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
          <div className="w-px h-6 bg-gray-200"></div>
          <div>
            {status === 'loading' ? (
              <div className="h-9 w-24 bg-gray-200 rounded-md animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Witaj, {session.user?.name || session.user?.email}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors text-sm"
                >
                  Wyloguj się
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => signIn()}
                  className="bg-transparent text-blue-600 font-semibold py-2 px-4 rounded-md hover:bg-blue-50 transition-colors text-sm"
                >
                  Zaloguj się
                </button>
                <Link href="/register" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm">
                  Zarejestruj się
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
