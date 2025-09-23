# System Rezerwacji Escape Roomów

Kompletna aplikacja webowa do rezerwacji pokojów zagadek (escape room), zbudowana przy użyciu Next.js, Prisma i Stripe.

## Główne Technologie

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Baza Danych:** [SQLite](https://www.sqlite.org/index.html)
- **Płatności:** [Stripe](https://stripe.com/)
- **Język:** [TypeScript](https://www.typescriptlang.org/)

## Uruchomienie Projektu

Postępuj zgodnie z poniższymi instrukcjami, aby uruchomić projekt lokalnie.

### Wymagania

- [Node.js](https://nodejs.org/en/) (wersja 20 lub nowsza)
- [npm](https://www.npmjs.com/)

### Instalacja i Konfiguracja

1.  **Sklonuj repozytorium:**
    ```bash
    git clone <adres-repozytorium>
    cd reservation-system
    ```

2.  **Zainstaluj zależności:**
    ```bash
    npm install
    ```

3.  **Skonfiguruj zmienne środowiskowe:**

    Utwórz plik `.env` w głównym katalogu projektu i skopiuj do niego poniższą zawartość. Uzupełnij wartości dla kluczy Stripe.

    ```env
    # Adres URL bazy danych Prisma (domyślnie SQLite)
    DATABASE_URL="file:./dev.db"

    # Klucze Stripe
    # Znajdziesz je w panelu deweloperskim Stripe
    STRIPE_SECRET_KEY=sk_test_...
    STRIPE_WEBHOOK_SECRET=whsec_...
    ```

4.  **Uruchom migracje bazy danych:**

    To polecenie utworzy bazę danych SQLite i tabele na podstawie schematu w `prisma/schema.prisma`.
    ```bash
    npx prisma migrate dev
    ```

5.  **Wypełnij bazę danych przykładowymi danymi (opcjonalnie):**

    Uruchom skrypt seedujący, aby dodać do bazy kilka przykładowych pokojów.
    ```bash
    npx prisma db seed
    ```

6.  **Uruchom serwer deweloperski:**
    ```bash
    npm run dev
    ```

    Aplikacja będzie dostępna pod adresem [http://localhost:3000](http://localhost:3000).

## Dostępne Skrypty

- `npm run dev`: Uruchamia aplikację w trybie deweloperskim z Turbopack.
- `npm run build`: Buduje aplikację do wersji produkcyjnej.
- `npm run start`: Uruchamia zbudowaną aplikację produkcyjną.
- `npm run lint`: Uruchamia ESLint w celu analizy kodu.
- `npx prisma db seed`: Wypełnia bazę danych przykładowymi danymi.
