import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-grow flex items-center justify-center relative w-full max-w-7xl mx-auto">
      
      {/* background */ }
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-heading font-black text-[20vw] text-white/[0.02] pointer-events-none select-none tracking-tighter">
        ACVB
      </div>

      <div className="relative z-10 w-full flex flex-col items-center text-center animate-fade-in-up">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-acvb-gold/20 bg-acvb-gold/5 text-acvb-gold text-xs font-bold tracking-widest uppercase mb-8">
          <span className="w-2 h-2 rounded-full bg-acvb-gold animate-pulse-slow"></span>
          Temporada Oficial 2026
        </div>

        <h1 className="font-heading text-6xl md:text-8xl lg:text-[100px] font-black leading-[0.9] tracking-tighter text-white mb-6">
          A FORÇA DA <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-acvb-gold via-acvb-gold-light to-yellow-100">
            NOSSA REDE.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed mb-12">
          Não é apenas um jogo, é a nossa identidade. A Associação Clube de Voleibol é técnica, potência e paixão desenfreada pelas quadras.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
          <Link href="/camisetas" className="w-full sm:w-auto group flex items-center justify-center gap-3 bg-acvb-gold text-acvb-navy font-black text-sm uppercase tracking-widest py-4 px-10 rounded-full hover:bg-white transition-all duration-500 shadow-[0_0_40px_-10px_rgba(185,141,59,0.4)]">
            Garantir Uniforme
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link href="/jogos" className="w-full sm:w-auto group flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white font-bold text-sm uppercase tracking-widest py-4 px-10 rounded-full hover:bg-white/10 transition-all duration-300">
            <CalendarDays className="w-4 h-4 text-acvb-gold" />
            Agenda de Jogos
          </Link>
        </div>
      </div>
    </div>
  );
}