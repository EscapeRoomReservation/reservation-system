import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900 hover:text-blue-600 transition-colors">
          EscapeRoom Pro
        </Link>
        <nav>
          <ul className="flex space-x-8 font-medium text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Pokoje
              </Link>
            </li>
            <li>
              <Link href="/my-bookings" className="hover:text-blue-600 transition-colors">
                Moje Rezerwacje
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-600 transition-colors">
                Kontakt
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
