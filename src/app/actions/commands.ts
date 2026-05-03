'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createUniformOrderCommand(formData: FormData) {
  const name = formData.get('name') as string;
  const number = parseInt(formData.get('number') as string);
  const size = formData.get('size') as string;
  const email = formData.get('email') as string;

  await prisma.uniformOrder.create({
    data: { name, number, size, email }
  });
  
  revalidatePath('/camisetas');
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
}

export async function loginAdminCommand(formData: FormData) {
  const password = formData.get('password') as string;
  
  if (password === 'admin123') {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'authenticated', { httpOnly: true, secure: true, path: '/' });
  }
  redirect('/admin');
}

export async function logoutAdminCommand() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin');
}

export async function createCalendarEventCommand(formData: FormData) {
  const opponent = formData.get('opponent') as string;
  const location = formData.get('location') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;

  await prisma.calendarEvent.create({
    data: { opponent, location, date, time }
  });

  revalidatePath('/admin');
  revalidatePath('/jogos');
}

export async function updateOrderStatusCommand(id: string, status: string) {
  await prisma.uniformOrder.update({
    where: { id },
    data: { status }
  });
  revalidatePath('/admin');
}