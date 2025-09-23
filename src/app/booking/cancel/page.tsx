import Link from 'next/link';

export default function BookingCancelPage() {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Płatność anulowana</h1>
      <p className="text-lg text-gray-700 mb-8">Twoja płatność została anulowana lub nie powiodła się. Twoja rezerwacja nie została potwierdzona.</p>
      <p className="text-gray-600 mb-8">Możesz spróbować ponownie lub wrócić na stronę główną.</p>
      <Link href="/" className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 font-semibold">
        Wróć na stronę główną
      </Link>
    </div>
  );
}
