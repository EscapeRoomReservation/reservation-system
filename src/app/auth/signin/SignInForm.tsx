'use client';

import { signIn } from 'next-auth/react';
import { useState, FormEvent, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type SignInMethod = 'credentials' | 'email';

export default function SignInForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [method, setMethod] = useState<SignInMethod>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const successMessage = searchParams.get('success');
    if (successMessage) {
      setSuccess(successMessage);
    }
    const errorFromCredentials = searchParams.get('error');
    if (errorFromCredentials) {
      setError('Nieprawidłowy e-mail lub hasło.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (method === 'credentials') {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result?.error) {
        setError('Nieprawidłowy e-mail lub hasło.');
        setIsSubmitting(false);
      } else {
        router.push('/');
      }
    } else {
      try {
        const result = await signIn('email', { email, redirect: false, callbackUrl: '/' });
        if (result?.error) {
          throw new Error(result.error);
        }
        setSuccess('Link do logowania został wysłany! Sprawdź swoją skrzynkę e-mail.');
      } catch (err: any) {
        setError('Wystąpił błąd. Spróbuj ponownie.');
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Zaloguj się</h1>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setMethod('credentials')}
          className={`flex-1 py-3 text-center font-medium text-sm transition-colors ${
            method === 'credentials' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Hasło
        </button>
        <button
          onClick={() => setMethod('email')}
          className={`flex-1 py-3 text-center font-medium text-sm transition-colors ${
            method === 'email' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Link w e-mailu
        </button>
      </div>

      {success && <p className="bg-green-100 text-green-800 p-4 rounded-md text-center mb-6">{success}</p>}
      {error && <p className="bg-red-100 text-red-800 p-4 rounded-md text-center mb-6">{error}</p>}

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

        {method === 'credentials' && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Hasło</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-bold text-lg transition-colors"
          >
            {isSubmitting ? 'Logowanie...' : (method === 'credentials' ? 'Zaloguj się' : 'Wyślij link do logowania')}
          </button>
        </div>
      </form>
    </div>
  );
}
