import { createUniformOrderCommand } from '@/app/actions/commands';
import { Shirt } from 'lucide-react';

export default function CamisetasPage() {
  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in-up mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Lado Esquerdo */}
        <div className="space-y-8">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-acvb-gold/20 to-transparent border border-acvb-gold/30">
            <Shirt className="w-10 h-10 text-acvb-gold" />
          </div>
          <h1 className="font-heading text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
            VISTA O <br />
            <span className="text-acvb-gold">NOSSO MANTO.</span>
          </h1>
          <p className="text-xl text-gray-400 font-light leading-relaxed">
            Feito para respirar, esticar e vencer. Reserve a sua camisa oficial da temporada e carregue as cores da ACVB no peito.
          </p>
        </div>
        
        {/* Lado Direito */}
        <div className="glass-card p-8 md:p-10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-acvb-gold/10 blur-[80px] rounded-full pointer-events-none"></div>

          <form action={createUniformOrderCommand} className="flex flex-col gap-6 relative z-10">
            
            <div>
              <label className="block text-xs font-bold text-acvb-gold uppercase tracking-widest mb-2">Nome nas costas</label>
              <input required type="text" name="name" className="input-premium" placeholder="EX: LUIZ" />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-xs font-bold text-acvb-gold uppercase tracking-widest mb-2">Número</label>
                <input required type="number" name="number" min="0" max="99" className="input-premium" placeholder="00" />
              </div>
              <div className="w-1/2">
                <label className="block text-xs font-bold text-acvb-gold uppercase tracking-widest mb-2">Tamanho</label>
                <select required name="size" className="input-premium appearance-none cursor-pointer">
                  <option value="P" className="bg-acvb-navy text-white">Tamanho P</option>
                  <option value="M" className="bg-acvb-navy text-white">Tamanho M</option>
                  <option value="G" className="bg-acvb-navy text-white">Tamanho G</option>
                  <option value="GG" className="bg-acvb-navy text-white">Tamanho GG</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-acvb-gold uppercase tracking-widest mb-2">E-mail</label>
              <input required type="email" name="email" className="input-premium" placeholder="contato@email.com" />
            </div>

            <button type="submit" className="w-full mt-4 bg-white text-black font-black uppercase tracking-widest text-sm py-5 rounded-xl hover:bg-acvb-gold transition-all duration-300">
              Confirmar Reserva
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}