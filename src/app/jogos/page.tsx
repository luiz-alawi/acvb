import { createMatchRequestCommand } from '@/app/actions/commands';
import { prisma } from '@/lib/prisma';
import { MapPin, Swords } from 'lucide-react';

export default async function JogosPage() {
  const games = await prisma.calendarEvent.findMany({ orderBy: { date: 'asc' } });

  return (
    <div className="max-w-7xl mx-auto w-full animate-fade-in-up mt-8">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        
        {/* Calendario */}
        <div className="xl:col-span-7 flex flex-col h-full">
          <h2 className="font-heading text-4xl font-black text-white mb-8 tracking-tighter uppercase">Agenda Oficial</h2>
          
          <div className="flex-grow glass-card p-2 md:p-4 rounded-[2rem]">
            {games.length === 0 ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8">
                <Swords className="w-12 h-12 text-white/10 mb-4" />
                <p className="text-gray-500 font-medium">Temporada sem jogos marcados no momento.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {games.map((game) => (
                  <div key={game.id} className="group relative overflow-hidden bg-white/5 border border-white/5 hover:border-acvb-gold/40 p-5 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-6 transition-colors">
                    
                    {/* Efeito hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-acvb-gold/0 via-acvb-gold/5 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 pointer-events-none"></div>
                    
                    <div>
                      <div className="text-xs font-bold text-acvb-gold mb-1 tracking-widest">{game.date} • {game.time}</div>
                      <h3 className="font-heading font-black text-2xl text-white">vs {game.opponent}</h3>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4" /> {game.location}
                      </div>
                    </div>
                    
                    <div className="md:text-right">
                      <span className="inline-block px-4 py-2 rounded-lg bg-acvb-navy-light text-white text-xs font-bold uppercase tracking-widest border border-white/10">
                        Confirmado
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desafio */}
        <div className="xl:col-span-5">
          <div className="glass-card p-8 md:p-10 sticky top-32">
            <h2 className="font-heading text-3xl font-black text-white mb-2 tracking-tighter uppercase">Quer nos enfrentar?</h2>
            <p className="text-sm text-gray-400 mb-8 font-light">Envie sua proposta de amistoso e nossa diretoria entrará em contato.</p>
            
            <form action={createMatchRequestCommand} className="flex flex-col gap-5">
              <input required type="text" name="teamName" placeholder="Nome do seu Time" className="input-premium" />
              <input required type="text" name="location" placeholder="Local do Jogo" className="input-premium" />
              
              <div className="flex gap-4">
                <input required type="date" name="date" className="input-premium w-1/2 text-gray-400" />
                <input required type="time" name="time" className="input-premium w-1/2 text-gray-400" />
              </div>
              
              <input required type="email" name="email" placeholder="E-mail do Responsável" className="input-premium" />
              
              <button type="submit" className="w-full mt-4 bg-acvb-gold text-black font-black uppercase tracking-widest text-sm py-4 rounded-xl hover:bg-white transition-all duration-300 shadow-[0_0_20px_-5px_rgba(185,141,59,0.5)]">
                Enviar Convite
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}