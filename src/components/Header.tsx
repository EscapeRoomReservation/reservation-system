import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-2xl font-bold tracking-tight hover:text-gray-300 transition-colors">
          EscapeRoom Pro
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="hover:text-gray-300 transition-colors">
                Pokoje
              </Link>
            </li>
            <li>
              <Link href="/my-bookings" className="hover:text-gray-300 transition-colors">
                Moje Rezerwacje
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gray-300 transition-colors">
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
