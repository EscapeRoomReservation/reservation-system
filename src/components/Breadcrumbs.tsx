'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Breadcrumbs = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((segment) => segment);

  if (pathSegments.length === 0) {
    return null; // Don't show on the homepage
  }

  // Simple mapping for segment names
  const getBreadcrumbName = (segment: string) => {
    const mappings: { [key: string]: string } = {
      owner: 'Panel Właściciela',
      admin: 'Panel Admina',
      users: 'Użytkownicy',
      locations: 'Lokalizacje',
      rooms: 'Pokoje',
      edit: 'Edycja',
      'my-bookings': 'Moje Rezerwacje',
    };
    return mappings[segment] || 'Szczegóły'; // Default for dynamic IDs
  };

  return (
    <nav aria-label="breadcrumb" className="mb-6 text-sm text-gray-500">
      <ol className="list-none p-0 inline-flex space-x-2">
        <li className="flex items-center">
          <Link href="/" className="hover:text-blue-600">Strona główna</Link>
        </li>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <li key={href} className="flex items-center">
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="text-gray-700 font-medium">{getBreadcrumbName(segment)}</span>
              ) : (
                <Link href={href} className="hover:text-blue-600">
                  {getBreadcrumbName(segment)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
