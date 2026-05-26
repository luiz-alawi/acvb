'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split(':');
  if (parts.length !== 2) {
    return password === stored;
  }
  const [salt, hash] = parts;
  const hashBuffer = Buffer.from(hash, 'hex');
  try {
    const derived = scryptSync(password, salt, 64);
    return timingSafeEqual(hashBuffer, derived);
  } catch {
    return false;
  }
}

async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== 'authenticated') {
    throw new Error('Unauthorized');
  }
}

export async function createUniformOrderCommand(formData: FormData) {
  const name = formData.get('name') as string;
  const number = parseInt(formData.get('number') as string);
  const size = formData.get('size') as string;
  const type = formData.get('type') as string;
  const email = formData.get('email') as string;

  await prisma.uniformOrder.create({
    data: { name, number, size, type, email }
  });
  
  revalidatePath('/camisetas');
  revalidatePath('/admin');
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

export async function checkExistingEmailCommand(email: string, type: 'uniform' | 'match') {
  if (type === 'uniform') {
    const existing = await prisma.uniformOrder.findFirst({ where: { email, status: 'PENDENTE' } });
    return !!existing;
  } else {
    const existing = await prisma.matchRequest.findFirst({ where: { email, status: 'PENDENTE' } });
    return !!existing;
  }
}

// ADMIN

export async function loginAdminCommand(formData: FormData) {
  const password = formData.get('password') as string;

  if (password === process.env.ADMIN_PASSWORD) {
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

export async function updateOrderStatusCommand(id: string, status: string) {
  await requireAdmin();
  await prisma.uniformOrder.update({ where: { id }, data: { status } });
  revalidatePath('/admin');
}

export async function createPlayerCommand(formData: FormData) {
  await requireAdmin();
  const name = formData.get('name') as string;
  const number = parseInt(formData.get('number') as string);
  const position = formData.get('position') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  await prisma.player.create({
    data: { name, number, position, email, password: hashPassword(password) }
  });
  revalidatePath('/admin');
  revalidatePath('/elenco');
}

export async function deletePlayerCommand(id: string) {
  await requireAdmin();
  await prisma.player.delete({ where: { id } });
  revalidatePath('/admin');
  revalidatePath('/elenco');
}

// ATLETA

export async function loginPlayerCommand(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const player = await prisma.player.findFirst({ where: { email } });

  if (player && verifyPassword(password, player.password)) {
    if (!player.password.includes(':')) {
      await prisma.player.update({
        where: { id: player.id },
        data: { password: hashPassword(password) },
      });
    }
    const cookieStore = await cookies();
    cookieStore.set('player_session', player.id, {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'strict',
    });
    redirect('/atleta');
  } else {
    return { error: 'Credenciais inválidas' };
  }
}

export async function logoutPlayerCommand() {
  const cookieStore = await cookies();
  cookieStore.delete('player_session');
  redirect('/atleta');
}

export async function updatePlayerProfileCommand(formData: FormData) {
  const cookieStore = await cookies();
  const playerId = cookieStore.get('player_session')?.value;

  if (!playerId) return;

  const bio = formData.get('bio') as string;
  const instagram = formData.get('instagram') as string;
  const photoBase64 = formData.get('photoBase64') as string;

  const updateData: any = { bio, instagram };

  if (photoBase64 && photoBase64.startsWith('data:image')) {
    updateData.photoUrl = photoBase64;
  }

  await prisma.player.update({
    where: { id: playerId },
    data: updateData
  });

  revalidatePath('/atleta');
  revalidatePath('/elenco');
}