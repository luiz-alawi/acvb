'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHash, timingSafeEqual } from 'crypto';

async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== 'authenticated') {
    throw new Error('Unauthorized');
  }
}

function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export async function createMatchRequestCommand(formData: FormData) {
  const teamName = formData.get('teamName') as string;
  const location = formData.get('location') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const email = formData.get('email') as string;

  await prisma.matchRequest.create({
    data: { teamName, location, date, time, email }
  });

  revalidatePath('/jogos');
  revalidatePath('/admin');
}

export async function acceptMatchRequestCommand(id: string) {
  await requireAdmin();
  const request = await prisma.matchRequest.findUnique({ where: { id } });
  if (request) {
    await prisma.calendarEvent.create({
      data: { opponent: request.teamName, location: request.location, date: request.date, time: request.time }
    });
    await prisma.matchRequest.delete({ where: { id } });
  }
  revalidatePath('/admin');
  revalidatePath('/jogos');
}

export async function denyMatchRequestCommand(id: string) {
  await requireAdmin();
  await prisma.matchRequest.delete({ where: { id } });
  revalidatePath('/admin');
}

export async function checkExistingEmailCommand(email: string) {
  const existing = await prisma.matchRequest.findFirst({ where: { email, status: 'PENDENTE' } });
  return !!existing;
}

// ADMIN

export async function loginAdminCommand(formData: FormData) {
  const password = formData.get('password') as string;
  const expected = process.env.ADMIN_PASSWORD;

  if (expected && password && safeEqual(password, expected)) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 8,
      sameSite: 'strict',
    });
  }
  redirect('/admin');
}

export async function logoutAdminCommand() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin');
}

export async function createCalendarEventCommand(formData: FormData) {
  await requireAdmin();
  const opponent = formData.get('opponent') as string;
  const location = formData.get('location') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  await prisma.calendarEvent.create({ data: { opponent, location, date, time } });
  revalidatePath('/admin');
  revalidatePath('/jogos');
}
