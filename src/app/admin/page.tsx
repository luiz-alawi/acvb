import { 
  loginAdminCommand, logoutAdminCommand, createCalendarEventCommand, 
  updateOrderStatusCommand, acceptMatchRequestCommand, denyMatchRequestCommand, 
  createPlayerCommand, deletePlayerCommand 
} from '@/app/actions/commands';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { Shield, Fingerprint, Users, X } from 'lucide-react';

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

  const [uniforms, matches, players] = await Promise.all([
    prisma.uniformOrder.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.matchRequest.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.player.findMany({ orderBy: { number: 'asc' } })
  ]);

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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="glass-card p-8 border-white/5 xl:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-acvb-gold" />
            <h2 className="text-lg font-bold text-acvb-gold uppercase tracking-widest">Gestão de Elenco & Acessos</h2>
          </div>
          
          <form action={createPlayerCommand} className="flex flex-col gap-4 mb-8 p-6 bg-[#050A14] rounded-2xl border border-white/5">
            <div className="flex flex-col md:flex-row gap-4">
              <input required type="text" name="name" placeholder="Nome do Jogador" className="input-premium bg-black/40! md:w-1/3" />
              <input required type="number" name="number" placeholder="Número" className="input-premium bg-black/40! md:w-1/4" />
              <select required name="position" className="input-premium bg-black/40! md:w-1/4 appearance-none cursor-pointer">
                <option value="Ponteiro">Ponteiro</option>
                <option value="Central">Central</option>
                <option value="Oposto">Oposto</option>
                <option value="Levantador">Levantador</option>
                <option value="Líbero">Líbero</option>
              </select>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <input required type="email" name="email" placeholder="E-mail de Acesso (Login do Atleta)" className="input-premium bg-black/40! md:w-1/2" />
              <input required type="text" name="password" placeholder="Senha Inicial do Atleta" className="input-premium bg-black/40! md:w-1/2" />
            </div>
            <button type="submit" className="w-full bg-white text-black font-bold uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-acvb-gold transition-colors mt-2">Cadastrar Atleta & Gerar Acesso</button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {players.map(p => (
              <div key={p.id} className="p-5 bg-linear-to-br from-[#0A1325] to-[#050A14] border border-white/5 hover:border-acvb-gold/30 transition-colors rounded-2xl flex justify-between items-start group">
                <div>
                  <div className="text-2xl font-black text-white mb-1"><span className="text-gray-500 font-light">#</span>{p.number}</div>
                  <div className="font-bold text-gray-300">{p.name}</div>
                  <div className="text-[10px] text-acvb-gold font-black uppercase tracking-widest mt-2">{p.position}</div>
                </div>
                <form action={deletePlayerCommand.bind(null, p.id)}>
                  <button type="submit" className="text-red-500/50 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-5 h-5" /></button>
                </form>
              </div>
            ))}
          </div>
        </div>

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

        {/* Camisetas */}
        <div className="glass-card p-8 border-white/5">
          <h2 className="text-lg font-bold text-acvb-gold mb-6 uppercase tracking-widest">Pedidos de Uniforme</h2>
          <div className="overflow-x-auto max-h-112.5 overflow-y-auto pr-2 custom-scrollbar">
            {uniforms.length === 0 && <p className="text-gray-500 text-sm font-mono">Nenhum pedido registrado.</p>}
            {uniforms.length > 0 && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase tracking-widest border-b border-white/10">
                    <th className="pb-4">Atleta</th>
                    <th className="pb-4">Detalhes</th>
                    <th className="pb-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {uniforms.map(u => (
                    <tr key={u.id} className={`text-sm ${u.status === 'RESPONDIDO' ? 'opacity-40' : 'text-white'}`}>
                      <td className="py-5">
                        <div className="font-bold">{u.name} <span className="text-gray-500 font-light ml-1">#{u.number}</span></div>
                      </td>
                      <td className="py-5">
                        <div className={`font-bold text-[10px] uppercase tracking-widest mb-1 ${u.type === 'LIBERO' ? 'text-acvb-gold' : 'text-blue-300'}`}>{u.type}</div>
                        <div className="font-mono text-gray-300">{u.size}</div>
                      </td>
                      <td className="py-5 text-right">
                        {u.status === 'PENDENTE' ? (
                          <form action={updateOrderStatusCommand.bind(null, u.id, 'RESPONDIDO')}>
                            <button type="submit" className="text-[10px] bg-white text-black px-4 py-2 rounded-lg font-bold uppercase tracking-widest hover:bg-acvb-gold transition-colors">Baixar</button>
                          </form>
                        ) : (
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Concluído</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}