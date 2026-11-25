import {
  loginAdminCommand, logoutAdminCommand, acceptMatchRequestCommand, denyMatchRequestCommand
} from '@/app/actions/commands';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { Shield, Fingerprint } from 'lucide-react';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session) {
    return (
      <div className="grow flex items-center justify-center animate-fade-in-up">
        <form action={loginAdminCommand} className="glass-card p-10 max-w-md w-full text-center border-acvb-gold/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-acvb-gold to-transparent"></div>
          <Fingerprint className="w-16 h-16 text-acvb-gold mx-auto mb-6 opacity-80" />
          <h1 className="font-heading text-2xl font-black text-white mb-2 uppercase tracking-widest">Protocolo de Segurança</h1>
          <p className="text-xs text-gray-500 mb-8">Acesso restrito à diretoria ACVB</p>
          <input required type="password" name="password" placeholder="••••••••" className="w-full p-4 mb-6 rounded-xl border border-white/10 bg-[#050A14] text-center text-acvb-gold tracking-[0.5em] text-lg focus:border-acvb-gold focus:outline-none transition-colors" />
          <button type="submit" className="w-full bg-transparent border border-acvb-gold text-acvb-gold font-bold text-sm tracking-widest uppercase py-4 rounded-xl hover:bg-acvb-gold hover:text-black transition-all">
            Autorizar
          </button>
        </form>
      </div>
    );
  }

  const matches = await prisma.matchRequest.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="max-w-7xl mx-auto w-full animate-fade-in-up pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6 glass-card p-6 border-acvb-gold/10">
        <div className="flex items-center gap-4">
          <div className="bg-acvb-gold/10 p-3 rounded-xl border border-acvb-gold/20">
            <Shield className="w-8 h-8 text-acvb-gold" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-black text-white uppercase tracking-widest">Painel Administrativo</h1>
          </div>
        </div>
        <form action={logoutAdminCommand}>
          <button type="submit" className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">Desconectar</button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Desafios */}
        <div className="glass-card p-8 border-white/5">
          <h2 className="text-lg font-bold text-acvb-gold mb-6 uppercase tracking-widest">Avaliar Desafios</h2>
          <div className="space-y-4 max-h-112.5 overflow-y-auto pr-2 custom-scrollbar">
            {matches.length === 0 && <p className="text-gray-500 text-sm font-mono">Nenhuma solicitação.</p>}
            {matches.map(m => (
              <div key={m.id} className="p-5 bg-[#050A14] border border-white/5 rounded-2xl">
                <p className="font-black text-lg text-white mb-1">{m.teamName}</p>
                <p className="text-xs text-gray-400 font-mono mb-4">{m.location} | {m.date} às {m.time}</p>
                <div className="flex gap-3">
                  <form action={acceptMatchRequestCommand.bind(null, m.id)} className="w-1/2">
                    <button type="submit" className="w-full bg-green-500/10 text-green-500 border border-green-500/30 hover:bg-green-500 hover:text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">Aceitar</button>
                  </form>
                  <form action={denyMatchRequestCommand.bind(null, m.id)} className="w-1/2">
                    <button type="submit" className="w-full bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">Recusar</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}