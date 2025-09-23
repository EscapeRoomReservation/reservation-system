'use client';

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, isBefore, addMinutes, setHours, setMinutes, isSameDay } from 'date-fns';
import { Booking, Room } from '@prisma/client';
import { loadStripe } from '@stripe/stripe-js';

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<Date | undefined>();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
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
    <div className="p-6 border rounded-lg bg-white shadow-md">
      <h2 className="text-2xl font-bold mb-4">Zarezerwuj termin</h2>
      {submitError && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">Błąd: {submitError}</p>}
      {isLoading ? (
        <p>Ładowanie kalendarza...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">1. Wybierz datę</h3>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={{ before: new Date() }}
                className="rounded-md border"
              />
            </div>
            <div>
              {selectedDate && (
                <div>
                  <h3 className="font-semibold mb-2">2. Wybierz godzinę</h3>
                  <p className="text-center font-medium mb-4">
                    Wybrano: {format(selectedDate, 'dd.MM.yyyy')}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <button
                          key={slot.toISOString()}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`p-2 border rounded-md text-center text-sm font-semibold transition-colors ${
                            selectedTime?.getTime() === slot.getTime()
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 hover:bg-blue-100'
                          }`}>
                          {format(slot, 'HH:mm')}
                        </button>
                      ))
                    ) : (
                      <p className="col-span-3 text-center text-gray-500">Brak wolnych terminów w tym dniu.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {selectedTime && (
            <div className="col-span-1 md:col-span-2 mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-4 text-lg">3. Podaj swoje dane</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Imię i nazwisko</label>
                  <input
                    type="text"
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">Adres e-mail</label>
                  <input
                    type="email"
                    id="customerEmail"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={!selectedDate || !selectedTime || !customerName || !customerEmail || isSubmitting}
                className="mt-6 w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 font-semibold text-lg"
              >
                {isSubmitting ? 'Przetwarzanie...' : 'Zarezerwuj i przejdź do płatności'}
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
