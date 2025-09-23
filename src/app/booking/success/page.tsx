import Link from 'next/link';

export default function BookingSuccessPage() {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Dziękujemy za rezerwację!</h1>
      <p className="text-lg text-gray-700 mb-8">Twoja płatność została pomyślnie przetworzona, a rezerwacja jest potwierdzona.</p>
      <p className="text-gray-600 mb-8">Wkrótce otrzymasz e-mail z potwierdzeniem i szczegółami rezerwacji.</p>
      <Link href="/" className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 font-semibold">
        Wróć na stronę główną
      </Link>
    </div>
  );
}
