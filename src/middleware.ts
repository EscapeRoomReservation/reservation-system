import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // Jeśli użytkownik nie jest zalogowany, withAuth przekieruje go na stronę logowania

    // Ochrona panelu admina
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return new NextResponse('You are not authorized to access this page.', { status: 403 });
    }

    // Ochrona panelu właściciela
    if (pathname.startsWith('/owner') && token?.role !== 'OWNER') {
      return new NextResponse('You are not authorized to access this page.', { status: 403 });
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/owner/:path*', '/my-bookings'],
};
