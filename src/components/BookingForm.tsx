'use client';

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, isBefore, addMinutes, setHours, setMinutes, isSameDay } from 'date-fns';
import { Booking, Room } from '@prisma/client';
import { loadStripe } from '@stripe/stripe-js';
import { useSession } from 'next-auth/react';

interface BookingFormProps {
  room: Room;
}

const generateTimeSlots = (date: Date, duration: number, existingBookings: Booking[]) => {
  const startTime = setMinutes(setHours(date, 10), 0);
  const endTime = setMinutes(setHours(date, 22), 0);
  const slots = [];
  let currentTime = startTime;

  while (currentTime < endTime) {
    const slotEndTime = addMinutes(currentTime, duration);
    const isBooked = existingBookings.some(booking => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      return (currentTime >= bookingStart && currentTime < bookingEnd) || (slotEndTime > bookingStart && slotEndTime <= bookingEnd);
    });

    if (!isBooked) {
      slots.push(currentTime);
    }
    currentTime = addMinutes(currentTime, 30);
  }
  return slots;
};

export default function BookingForm({ room }: BookingFormProps) {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<Date | undefined>();
  const [customerName, setCustomerName] = useState(session?.user?.name ?? '');
  const [customerEmail, setCustomerEmail] = useState(session?.user?.email ?? '');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/rooms/${room.id}/bookings`);
        if (!response.ok) throw new Error('Failed to fetch bookings');
        setBookings(await response.json());
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [room.id]);

  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    const dayBookings = bookings.filter(b => isSameDay(new Date(b.startTime), selectedDate));
    return generateTimeSlots(selectedDate, room.duration, dayBookings);
  }, [selectedDate, bookings, room.duration]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isBefore(date, new Date())) {
      setSelectedDate(date);
      setSelectedTime(undefined);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedTime) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: room.id,
          startTime: selectedTime.toISOString(),
          customerName,
          customerEmail,
          userId: session?.user?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const { url } = await response.json();

      if (!url) {
        throw new Error('Failed to create Stripe Checkout session');
      }

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: url.split('?session_id=')[1] });
      }

    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {submitError && <p className="text-red-600 bg-red-100 p-4 rounded-lg text-center font-semibold">Błąd: {submitError}</p>}
      {isLoading ? (
        <div className="text-center text-gray-600">Ładowanie kalendarza...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">1. Wybierz datę</h3>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={{ before: new Date() }}
                className="rounded-lg border shadow-sm bg-white p-4"
                classNames={{
                  head_cell: 'w-10 font-semibold text-gray-500',
                  cell: 'w-10 h-10 text-center',
                  day_selected: 'bg-blue-600 text-white hover:bg-blue-700 rounded-full',
                  day_today: 'bg-blue-100 text-blue-700 font-bold rounded-full',
                  day: 'rounded-full'
                }}
              />
            </div>
            <div className="flex flex-col items-center">
              {selectedDate && (
                <div className="w-full max-w-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">2. Wybierz godzinę</h3>
                  <p className="text-center font-medium text-gray-600 mb-4">
                    Wybrano: {format(selectedDate, 'dd.MM.yyyy')}
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <button
                          key={slot.toISOString()}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`p-3 border rounded-lg text-center font-semibold transition-all duration-200 ${
                            selectedTime?.getTime() === slot.getTime()
                              ? 'bg-blue-600 text-white scale-105 shadow-lg'
                              : 'bg-gray-100 hover:bg-blue-100 hover:shadow-md'
                          }`}>
                          {format(slot, 'HH:mm')}
                        </button>
                      ))
                    ) : (
                      <p className="col-span-full text-center text-gray-500 py-4">Brak wolnych terminów w tym dniu.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {selectedTime && (
            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">3. Podaj swoje dane</h3>
              <div className="max-w-lg mx-auto grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Imię i nazwisko</label>
                  <input
                    type="text"
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">Adres e-mail</label>
                  <input
                    type="email"
                    id="customerEmail"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-8 text-center">
                <button
                  type="submit"
                  disabled={!selectedDate || !selectedTime || !customerName || !customerEmail || isSubmitting}
                  className="w-full max-w-md bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold text-lg transition-transform transform hover:scale-105"
                >
                  {isSubmitting ? 'Przetwarzanie...' : 'Zarezerwuj i przejdź do płatności'}
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
