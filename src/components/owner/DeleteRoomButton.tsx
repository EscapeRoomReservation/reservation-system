'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteRoomButtonProps {
  roomId: string;
}

export default function DeleteRoomButton({ roomId }: DeleteRoomButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Czy na pewno chcesz usunąć ten pokój? Tej akcji nie można cofnąć.')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete room');
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={isLoading}
        className="text-sm font-medium text-red-600 hover:text-red-800 disabled:text-gray-400"
      >
        {isLoading ? 'Usuwanie...' : 'Usuń'}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
