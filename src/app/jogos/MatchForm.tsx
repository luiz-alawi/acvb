'use client'

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { createMatchRequestCommand, checkExistingEmailCommand } from '@/app/actions/commands';

export default function MatchForm() {
  const [showModal, setShowModal] = useState(false);
  const [pendingData, setPendingData] = useState<FormData | null>(null);
  const [done, setDone] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    const exists = await checkExistingEmailCommand(email);
    if (exists) {
      setPendingData(formData);
      setShowModal(true);
    } else {
      await createMatchRequestCommand(formData);
      setDone(true);
    }
  };

  const confirmSubmit = async () => {
    if (pendingData) {
      await createMatchRequestCommand(pendingData);
      setShowModal(false);
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="glass-card p-10 text-center border-green-500/30">
        <h3 className="font-heading text-2xl font-black text-green-500 mb-2 uppercase tracking-widest">Enviado!</h3>
        <p className="text-gray-400 text-sm font-light">A proposta foi encaminhada para a diretoria.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 md:p-10 sticky top-32">
      
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
          <div className="glass-card p-8 max-w-md w-full border-red-500/30 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="font-heading text-2xl font-black text-white mb-2 uppercase tracking-widest">Atenção</h3>
            <p className="text-gray-400 text-sm mb-8 font-light leading-relaxed">
              O sistema encontrou uma proposta pendente enviada por este e-mail. Enviar vários convites repetidos diminui as chances de agendamento. Confirmar novo envio?
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowModal(false)} type="button" className="w-1/2 p-4 rounded-xl bg-white/5 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors">Cancelar</button>
              <button onClick={confirmSubmit} type="button" className="w-1/2 p-4 rounded-xl bg-red-500 text-white font-bold uppercase tracking-widest text-xs hover:bg-red-600 transition-colors">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      <h2 className="font-heading text-3xl font-black text-white mb-2 tracking-tighter uppercase">Quer nos enfrentar?</h2>
      <p className="text-sm text-gray-400 mb-8 font-light">Envie sua proposta de amistoso e aguarde o retorno da diretoria.</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input required type="text" name="teamName" placeholder="Nome do seu Time" className="input-premium" />
        <input required type="text" name="location" placeholder="Local do Jogo" className="input-premium" />
        
        <div className="flex gap-4">
          <input required type="date" name="date" min={today} className="input-premium w-1/2 text-gray-400" />
          <input required type="time" name="time" className="input-premium w-1/2 text-gray-400" />
        </div>
        
        <input required type="email" name="email" placeholder="E-mail do Responsável" className="input-premium" />
        
        <button type="submit" className="w-full mt-4 bg-acvb-gold text-black font-black uppercase tracking-widest text-sm py-4 rounded-xl hover:bg-white transition-all duration-300 shadow-[0_0_20px_-5px_rgba(185,141,59,0.5)]">
          Enviar Convite
        </button>
      </form>
    </div>
  );
}