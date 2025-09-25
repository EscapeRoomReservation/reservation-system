'use client';

import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { add, format } from 'date-fns';
import { useSession } from 'next-auth/react';

interface BookingFormProps {
  room: {
    id: string;
    price: number;
    duration: number;
  };
}

export default function BookingForm({ room }: BookingFormProps) {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      setCustomerName(session.user?.name || '');
      setCustomerEmail(session.user?.email || '');
    }
  }, [session]);

  useEffect(() => {
    if (selectedDate) {
      const generateTimeSlots = (date: Date) => {
        const slots = [];
        const dayStart = new Date(date);
        dayStart.setHours(9, 0, 0, 0); // Start at 9:00 AM
        const dayEnd = new Date(date);
        dayEnd.setHours(21, 0, 0, 0); // End at 9:00 PM
    
        let current = dayStart;
        while (current < dayEnd) {
          slots.push(format(current, 'HH:mm'));
          current = add(current, { minutes: room.duration });
        }
        return slots;
      };

      const fetchBookings = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/rooms/${room.id}/bookings?date=${format(selectedDate, 'yyyy-MM-dd')}`);
          if (!res.ok) throw new Error('Failed to fetch bookings');
          const bookedSlots: { startTime: string }[] = await res.json();
          const allSlots = generateTimeSlots(selectedDate);
          const bookedTimes = bookedSlots.map(slot => format(new Date(slot.startTime), 'HH:mm'));
          const available = allSlots.filter(slot => !bookedTimes.includes(slot));
          setAvailableTimes(available);
          setSelectedTime('');
        } catch {
          // Error is intentionally ignored. We're setting a generic error message.
          setError('Could not load available times.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchBookings();
    }
  }, [selectedDate, room.id, room.duration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time.');
      return;
    }
    setIsLoading(true);
    setError(null);

    const [hours, minutes] = selectedTime.split(':');
    const startTime = new Date(selectedDate);
    startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const bookingData: any = {
      roomId: room.id,
      startTime: startTime.toISOString(),
    };

    if (!session) {
      bookingData.customerName = customerName;
      bookingData.customerEmail = customerEmail;
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-gray-50 rounded-lg shadow-inner">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4">Wybierz datę</h3>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={{ before: new Date() }}
            className="bg-white rounded-md shadow p-4"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4">Wybierz godzinę</h3>
          {isLoading && <p>Loading times...</p>}
          <div className="grid grid-cols-3 gap-2">
            {availableTimes.map(time => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`p-3 rounded-md text-center text-sm font-medium transition-colors ${
                  selectedTime === time
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white hover:bg-blue-50 border border-gray-200'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!session && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Twoje dane</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Imię i nazwisko</label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">Adres e-mail</label>
              <input
                type="email"
                id="customerEmail"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

      <button
        type="submit"
        disabled={isLoading || !selectedTime}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-bold text-lg transition-transform transform hover:scale-105"
      >
        Zarezerwuj i zapłać ({room.price} PLN)
      </button>
    </form>
  );
}
