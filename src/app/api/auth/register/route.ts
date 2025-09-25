import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ message: 'Imię i e-mail są wymagane.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Użytkownik o tym adresie e-mail już istnieje.' }, { status: 409 });
    }

    await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    return NextResponse.json({ message: 'Rejestracja pomyślna! Zostaniesz przekierowany na stronę logowania.' }, { status: 201 });

  } catch (error) {
    console.error('Błąd rejestracji:', error);
    return NextResponse.json({ message: 'Wystąpił nieoczekiwany błąd.' }, { status: 500 });
  }
}

