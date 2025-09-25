'use client';

import { signIn } from 'next-auth/react';
import { useState, FormEvent, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const successMessage = searchParams.get('success');
    if (successMessage) {
      setSuccess(successMessage);
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signIn('email', { email, redirect: false, callbackUrl: '/' });
      if (result?.error) {
        throw new Error(result.error);
      }
      // On success, NextAuth will redirect to the verify-request page automatically
    } catch (err: any) {
      setError('Wystąpił błąd. Spróbuj ponownie.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Zaloguj się lub Zarejestruj</h1>
      <p className="text-center text-gray-600 mb-8">Podaj swój adres e-mail, aby otrzymać link do logowania.</p>

      {success && <p className="bg-green-100 text-green-800 p-4 rounded-md text-center mb-6">{success}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
            {isSubmitting ? 'Wysyłanie...' : 'Wyślij link do logowania'}
          </button>
        </div>
      </form>
    </div>
  );
}
