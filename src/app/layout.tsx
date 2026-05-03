import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter, Montserrat } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700', '900'], variable: '--font-montserrat' });

export const metadata: Metadata = {
  title: 'ACVB | Associação Clube de Voleibol',
  description: 'Dominando a quadra.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${montserrat.variable} scroll-smooth`}>
      <body className="flex flex-col min-h-screen relative">
        
        {/* Navbar */}
        <div className="fixed top-6 left-0 w-full flex justify-center z-50 px-4">
          <header className="glass-card flex items-center justify-between px-6 py-3 w-full max-w-4xl rounded-full border-white/10">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-heading font-black tracking-tighter text-2xl text-white">
                AC<span className="text-acvb-gold">VB</span>
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">Início</Link>
              <Link href="/jogos" className="text-gray-400 hover:text-white transition-colors">Calendário & Desafios</Link>
              <Link href="/camisetas" className="px-5 py-2 rounded-full bg-white/5 text-acvb-gold border border-acvb-gold/30 hover:bg-acvb-gold hover:text-acvb-navy font-bold transition-all shadow-[0_0_15px_-3px_rgba(185,141,59,0.3)]">
                Comprar Manto
              </Link>
            </nav>
          </header>
        </div>

        <main className="flex-grow w-full flex flex-col pt-32 pb-16 px-6 z-10">
          {children}
        </main>

        <footer className="w-full border-t border-white/5 py-8 mt-auto relative z-10 text-center">
          <p className="text-xs text-gray-600 font-medium tracking-widest uppercase">
            © {new Date().getFullYear()} ACVB — Todos os direitos reservados.
          </p>
        </footer>
      </body>
    </html>
  );
}