import { prisma } from '@/lib/prisma';
import { User } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';

export default async function ElencoPage() {
  const players = await prisma.player.findMany({
    orderBy: { number: 'asc' }
  });

  return (
    <div className="max-w-7xl mx-auto w-full animate-fade-in-up mt-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-acvb-gold/30 bg-acvb-gold/10 text-acvb-gold text-xs font-bold tracking-widest uppercase mb-4">
          Temporada 2026
        </div>
        <h1 className="font-heading text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
          NOSSOS <span className="text-acvb-gold">ATLETAS.</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light mt-4">
          Conheça os atletas que defendem as cores da ACVB dentro de quadra.
        </p>
      </div>

      {players.length === 0 ? (
        <div className="glass-card p-12 text-center border-dashed border-white/10">
          <p className="text-gray-500 font-medium">O elenco ainda está sendo formado pela comissão técnica.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {players.map((player) => (
            <div key={player.id} className="group relative overflow-hidden glass-card p-1 hover:border-acvb-gold/50 transition-all duration-500 rounded-4xl">
              
              <div className="bg-[#050A14] h-full rounded-[1.8rem] overflow-hidden flex flex-col">
                
                <div className="relative aspect-square bg-linear-to-b from-white/5 to-transparent flex items-center justify-center p-6">
                  <div className="absolute top-4 left-4 font-heading text-4xl font-black text-white/10 pointer-events-none group-hover:text-acvb-gold/20 transition-colors">
                    #{player.number}
                  </div>
                  
                  {player.photoUrl ? (
                    <img src={player.photoUrl} alt={player.name} className="w-40 h-40 object-cover rounded-full border-4 border-white/5 group-hover:border-acvb-gold/30 transition-colors shadow-2xl relative z-10" />
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-black/50 border-4 border-white/5 flex items-center justify-center relative z-10">
                      <User className="w-16 h-16 text-gray-700" />
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col grow border-t border-white/5 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#050A14] px-4">
                    <span className="bg-white/10 text-acvb-gold border border-acvb-gold/20 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                      {player.position}
                    </span>
                  </div>
                  
                  <h3 className="font-heading text-2xl font-black text-white text-center mt-4 mb-2">{player.name}</h3>
                  
                  <p className="text-sm text-gray-400 text-center font-light leading-relaxed line-clamp-3 mb-6 grow">
                    {player.bio || 'Atleta da Associação Clube de Voleibol.'}
                  </p>
                  
                  {player.instagram && (
                    <a href={`https://instagram.com/${player.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-acvb-gold hover:text-black text-gray-400 transition-colors text-xs font-bold tracking-widest uppercase">
                      <FaInstagram className="w-4 h-4" /> Seguir
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}