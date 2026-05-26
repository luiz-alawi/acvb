import { PrismaClient } from '@prisma/client';
import { scryptSync, randomBytes } from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  const players = await prisma.player.findMany({ select: { id: true, name: true, email: true, password: true } });

  const legacy = players.filter(p => !p.password.includes(':'));

  if (legacy.length === 0) {
    console.log('Nenhuma senha em texto puro encontrada. Nada a fazer.');
    return;
  }

  console.log(`Migrando ${legacy.length} senha(s)...\n`);

  for (const player of legacy) {
    await prisma.player.update({
      where: { id: player.id },
      data: { password: hashPassword(player.password) },
    });
    console.log(`  ✓ ${player.name} (${player.email})`);
  }

  console.log('\nMigração concluída.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
