import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Wszystkie pola są wymagane.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Użytkownik o tym adresie e-mail już istnieje.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    return NextResponse.json({ message: 'Rejestracja pomyślna! Zostaniesz przekierowany na stronę logowania.' }, { status: 201 });

  } catch (error) {
    console.error('Błąd rejestracji:', error);
    return NextResponse.json({ message: 'Wystąpił nieoczekiwany błąd.' }, { status: 500 });
  }
}
