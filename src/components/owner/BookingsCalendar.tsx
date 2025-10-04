'use client';

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import BookingDetailsModal from './BookingDetailsModal';


interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
}

const BookingsCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/owner/bookings');
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p>Ładowanie kalendarza...</p>;
  }

  if (error) {
    return <p className="text-red-500">Błąd: {error}</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
                events={events}
        locale="pl" // Set locale to Polish
        eventClick={handleEventClick} // Handle event click
        firstDay={1} // Start week on Monday
        buttonText={{
          today: 'Dzisiaj',
          month: 'Miesiąc',
          week: 'Tydzień',
          day: 'Dzień',
        }}
        allDaySlot={false} // We don't need the 'all-day' slot
        slotMinTime="08:00:00" // Calendar starts at 8 AM
        slotMaxTime="23:00:00" // Calendar ends at 11 PM
                height="auto" // Adjust height to content
      />
      <BookingDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
};

export default BookingsCalendar;
