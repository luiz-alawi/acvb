import { loginAdminCommand, logoutAdminCommand, createCalendarEventCommand, updateOrderStatusCommand } from '@/app/actions/commands';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6 bg-acvb-navy">
        <form action={loginAdminCommand} className="glass-panel !bg-white/10 !border-white/20 p-10 rounded-[2rem] w-full max-w-md backdrop-blur-2xl">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-acvb-gold" />
          </div>
          <h1 className="text-3xl font-black mb-8 text-center text-white">Central de Comando</h1>
          <input required type="password" name="password" placeholder="Senha de Acesso" className="w-full p-4 mb-6 rounded-xl border-0 bg-black/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-acvb-gold outline-none text-center tracking-widest" />
          <button type="submit" className="w-full bg-acvb-gold text-acvb-navy font-black py-4 rounded-xl transition hover:bg-white hover:scale-105">
            Autenticar
          </button>
        </form>
      </div>
    );
  }

  const uniforms = await prisma.uniformOrder.findMany({ orderBy: { createdAt: 'desc' } });
  const matches = await prisma.matchRequest.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <ShieldAlert className="w-10 h-10 text-red-500" />
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Admin Hub</h1>
            <p className="text-sm font-bold text-red-500 uppercase tracking-widest">Acesso Restrito</p>
          </div>
        </div>
        <form action={logoutAdminCommand}>
          <button type="submit" className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-6 py-3 rounded-xl font-bold transition-all">Encerrar Sessão</button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Cadastrar Jogo */}
        <div className="glass-panel p-8 rounded-3xl">
          <h2 className="text-2xl font-black mb-6 text-gray-900 dark:text-white">Cadastrar Jogo</h2>
          <form action={createCalendarEventCommand} className="space-y-4">
            <input required type="text" name="opponent" placeholder="Adversário (ex: UFSM)" className="w-full p-4 rounded-xl border-0 bg-gray-100 dark:bg-[#0A1325] text-gray-900 dark:text-white" />
            <input required type="text" name="location" placeholder="Local" className="w-full p-4 rounded-xl border-0 bg-gray-100 dark:bg-[#0A1325] text-gray-900 dark:text-white" />
            <div className="flex gap-4">
              <input required type="date" name="date" className="w-1/2 p-4 rounded-xl border-0 bg-gray-100 dark:bg-[#0A1325] text-gray-500" />
              <input required type="time" name="time" className="w-1/2 p-4 rounded-xl border-0 bg-gray-100 dark:bg-[#0A1325] text-gray-500" />
            </div>
            <button type="submit" className="w-full bg-acvb-navy dark:bg-acvb-gold text-white dark:text-acvb-navy font-black py-4 rounded-xl">Lançar no Calendário</button>
          </form>
        </div>

        {/* Solicitacoes */}
        <div className="glass-panel p-8 rounded-3xl">
          <h2 className="text-2xl font-black mb-6 text-gray-900 dark:text-white">Desafios Recebidos</h2>
          <div className="max-h-[350px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {matches.length === 0 && <p className="text-gray-500 italic">Sem solicitações.</p>}
            {matches.map(m => (
              <div key={m.id} className="p-5 bg-gray-100 dark:bg-[#0A1325] rounded-2xl">
                <p className="font-black text-lg text-acvb-navy dark:text-white">{m.teamName}</p>
                <p className="text-sm font-medium text-gray-500 mb-2">{m.location} • {m.date} às {m.time}</p>
                <a href={`mailto:${m.email}`} className="text-sm font-bold text-acvb-gold hover:underline">{m.email}</a>
              </div>
            ))}
          </div>
        </div>

        {/* Pedidos Camisetas */}
        <div className="glass-panel p-8 rounded-3xl lg:col-span-2">
          <h2 className="text-2xl font-black mb-6 text-gray-900 dark:text-white">Pedidos de Uniforme</h2>
          <div className="overflow-x-auto">
            {uniforms.length === 0 && <p className="text-gray-500 italic">Nenhum pedido recebido.</p>}
            {uniforms.length > 0 && (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-sm uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                    <th className="pb-4 font-bold">Atleta</th>
                    <th className="pb-4 font-bold">Num</th>
                    <th className="pb-4 font-bold">Tam</th>
                    <th className="pb-4 font-bold">Contato</th>
                    <th className="pb-4 font-bold">Status</th>
                    <th className="pb-4 font-bold text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {uniforms.map(u => (
                    <tr key={u.id} className="text-gray-900 dark:text-gray-200">
                      <td className="py-4 font-black">{u.name}</td>
                      <td className="py-4 font-bold text-acvb-gold">{u.number}</td>
                      <td className="py-4 font-bold">{u.size}</td>
                      <td className="py-4 font-medium text-sm text-gray-500">{u.email}</td>
                      <td className="py-4">
                        {u.status === 'PENDENTE' ? (
                          <span className="bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-500 px-3 py-1 rounded-full text-xs font-black">PENDENTE</span>
                        ) : (
                          <span className="bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-500 px-3 py-1 rounded-full text-xs font-black flex items-center w-max gap-1">
                            <CheckCircle2 className="w-3 h-3" /> OK
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        {u.status === 'PENDENTE' && (
                          <form action={updateOrderStatusCommand.bind(null, u.id, 'RESPONDIDO')}>
                            <button type="submit" className="text-xs bg-acvb-navy text-white dark:bg-acvb-gold dark:text-acvb-navy px-4 py-2 rounded-lg font-bold hover:scale-105 transition-transform">
                              Concluir
                            </button>
                          </form>
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