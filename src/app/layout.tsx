import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter, Montserrat } from 'next/font/google';
import Navbar from './Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700', '900'], variable: '--font-montserrat' });

export const metadata: Metadata = {
  title: 'ACVB | Associação Clube de Voleibol',
  description: 'Dominando a quadra.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${montserrat.variable} scroll-smooth`}>
      <body className="flex flex-col min-h-screen relative">
        <Navbar />
        <main className="grow w-full flex flex-col pt-32 pb-16 px-6 z-10">
          {children}
        </main>
        <footer className="w-full border-t border-white/5 py-8 mt-auto relative z-10 text-center flex flex-col items-center gap-4">
          <p className="text-xs text-gray-600 font-medium tracking-widest uppercase">
            © {new Date().getFullYear()} ACVB — Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/admin" className="text-[10px] text-gray-700 hover:text-acvb-gold transition-colors tracking-widest uppercase">Admin</Link>
            <Link href="/atleta" className="text-[10px] text-gray-700 hover:text-acvb-gold transition-colors tracking-widest uppercase">Portal do Atleta</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}