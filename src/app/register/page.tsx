'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Wystąpił błąd podczas rejestracji.');
      }

      // Redirect to sign-in page with a success message
      router.push(`/auth/signin?success=Rejestracja pomyślna! Podaj e-mail, aby otrzymać link do logowania.`);

    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Zarejestruj się</h1>
      <p className="text-center text-gray-600 mb-8">Utwórz nowe konto, aby móc rezerwować pokoje.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Imię</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Jan Kowalski"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adres e-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-blue-500 focus:border-blue-500"
            placeholder="ty@example.com"
          />
        </div>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-bold text-lg transition-colors"
          >
            {isSubmitting ? 'Rejestrowanie...' : 'Zarejestruj się'}
          </button>
        </div>
      </form>
    </div>
  );
}
