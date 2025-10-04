import BookingsCalendar from '@/components/owner/BookingsCalendar';

export default function OwnerCalendarPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Kalendarz Rezerwacji</h1>
      <p className="mb-6 text-gray-600">
        Tutaj możesz zobaczyć wszystkie rezerwacje dla Twoich pokoi. Kolory oznaczają status rezerwacji:
        <span className="ml-4 font-medium"><span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>Oczekująca</span>
        <span className="ml-4 font-medium"><span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>Potwierdzona</span>
      </p>
      <BookingsCalendar />
    </div>
  );
}
