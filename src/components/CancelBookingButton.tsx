'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookingStatus } from '@prisma/client';

interface CancelBookingButtonProps {
  bookingId: string;
  status: BookingStatus;
}

export default function CancelBookingButton({ bookingId, status }: CancelBookingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCancel = async () => {
    if (!confirm('Czy na pewno chcesz anulować tę rezerwację?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'CANCELLED') {
    return <span className="text-sm text-gray-500">Anulowano</span>;
  }

  return (
    <div>
      <button
        onClick={handleCancel}
        disabled={isLoading}
        className="text-sm font-medium text-red-600 hover:text-red-800 disabled:text-gray-400"
      >
        {isLoading ? 'Anulowanie...' : 'Anuluj rezerwację'}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
