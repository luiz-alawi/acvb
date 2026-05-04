'use client'

import { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { createUniformOrderCommand, checkExistingEmailCommand } from '@/app/actions/commands';

export default function CamisetasPage() {
  const [type, setType] = useState('PRETA');
  const [showModal, setShowModal] = useState(false);
  const [pendingData, setPendingData] = useState<FormData | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    const exists = await checkExistingEmailCommand(email, 'uniform');
    if (exists) {
      setPendingData(formData);
      setShowModal(true);
    } else {
      await createUniformOrderCommand(formData);
      setDone(true);
    }
  };

  const confirmSubmit = async () => {
    if (pendingData) {
      await createUniformOrderCommand(pendingData);
      setShowModal(false);
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="max-w-4xl mx-auto w-full py-32 grow text-center animate-fade-in-up">
        <div className="inline-flex p-6 rounded-full bg-green-500/10 border border-green-500/30 mb-6">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="font-heading text-5xl font-black text-white mb-4 tracking-tighter">Reserva Confirmada!</h1>
        <p className="text-xl text-gray-400 font-light">A diretoria entrará em contato através do e-mail informado.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in-up mt-8">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
          <div className="glass-card p-8 max-w-md w-full border-red-500/30 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="font-heading text-2xl font-black text-white mb-2 uppercase tracking-widest">Atenção</h3>
            <p className="text-gray-400 text-sm mb-8 font-light leading-relaxed">
              Já identificamos um pedido pendente registrado com este e-mail. Enviar várias solicitações reduzirá as chances de aprovação. Tem certeza que deseja continuar?
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowModal(false)} type="button" className="w-1/2 p-4 rounded-xl bg-white/5 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors">Cancelar</button>
              <button onClick={confirmSubmit} type="button" className="w-1/2 p-4 rounded-xl bg-red-500 text-white font-bold uppercase tracking-widest text-xs hover:bg-red-600 transition-colors">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <div className="space-y-8 flex flex-col items-center text-center lg:text-left lg:items-start">
          <div className={`relative w-64 h-64 md:w-80 md:h-80 transition-all duration-700 rounded-[3rem] border ${type === 'PRETA' ? 'bg-linear-to-br from-[#0c1627] to-[#050A14] border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]' : 'bg-linear-to-br from-white/10 to-transparent border-white/30 shadow-[0_0_50px_rgba(255,255,255,0.1)]'}`}>
            <Image 
              src={type === 'PRETA' ? '/camisa-preta.png' : '/camisa-branca.png'} 
              alt={type === 'PRETA' ? 'Camisa Preta ACVB' : 'Camisa Branca ACVB'}
              fill
              className="object-contain p-6 drop-shadow-2xl hover:scale-110 transition-transform duration-500"
              priority
            />
          </div>
          
          <h1 className="font-heading text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">
            MANTO <br />
            <span className={`transition-colors duration-700 ${type === 'PRETA' ? 'text-gray-500' : 'text-white'}`}>
              {type === 'PRETA' ? 'PRETO.' : 'BRANCO.'}
            </span>
          </h1>
          <p className="text-lg text-gray-400 font-light max-w-sm leading-relaxed">
            Personalize os dados abaixo. A imagem ilustra o modelo da cor que será confeccionada para você.
          </p>
        </div>
        
        <div className="glass-card p-8 md:p-10 relative overflow-hidden">
          <div className={`absolute -top-20 -right-20 w-64 h-64 blur-[80px] rounded-full pointer-events-none transition-colors duration-700 ${type === 'PRETA' ? 'bg-black/50' : 'bg-white/10'}`}></div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Cor da Camiseta</label>
              <select name="type" value={type} onChange={(e) => setType(e.target.value)} className="input-premium appearance-none cursor-pointer border-acvb-gold/30 font-bold">
                <option value="PRETA" className="bg-[#050A14] text-white">Camiseta Preta</option>
                <option value="BRANCA" className="bg-[#050A14] text-white">Camiseta Branca</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nome nas costas</label>
              <input required type="text" name="name" className="input-premium" placeholder="EX: LUIZ" />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Número</label>
                <input required type="number" name="number" min="0" max="99" className="input-premium" placeholder="00" />
              </div>
              <div className="w-1/2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tamanho</label>
                <select required name="size" className="input-premium appearance-none cursor-pointer">
                  <option value="P" className="bg-[#050A14] text-white">Tamanho P</option>
                  <option value="M" className="bg-[#050A14] text-white">Tamanho M</option>
                  <option value="G" className="bg-[#050A14] text-white">Tamanho G</option>
                  <option value="GG" className="bg-[#050A14] text-white">Tamanho GG</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">E-mail para Contato</label>
              <input required type="email" name="email" className="input-premium" placeholder="contato@email.com" />
            </div>
            <button type="submit" className={`w-full mt-4 font-black uppercase tracking-widest text-sm py-5 rounded-xl transition-all duration-300 ${type === 'PRETA' ? 'bg-acvb-gold text-black hover:bg-yellow-400 shadow-[0_0_20px_-5px_rgba(185,141,59,0.5)]' : 'bg-white text-black hover:bg-gray-200'}`}>
              Confirmar Solicitação
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}