// Apaga do MongoDB as coleções das funcionalidades removidas (Elenco/Atletas e Pedidos de Manto).
// Uso: node --env-file=.env scripts/drop-removed-collections.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const COLLECTIONS = ['Player', 'Athlete', 'UniformOrder', 'JerseyOrder'];

async function main() {
  for (const name of COLLECTIONS) {
    const count = await prisma.$runCommandRaw({ count: name });
    try {
      await prisma.$runCommandRaw({ drop: name });
      console.log(`  ✓ ${name}: coleção apagada (${count.n ?? 0} documento(s))`);
    } catch (e) {
      if (String(e).includes('ns not found') || String(e).includes('NamespaceNotFound')) {
        console.log(`  - ${name}: não existe, nada a fazer`);
      } else {
        throw e;
      }
    }
  }
  console.log('\nLimpeza concluída.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
