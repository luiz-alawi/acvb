import { loginPlayerCommand, logoutPlayerCommand, updatePlayerProfileCommand } from '@/app/actions/commands';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { User, MessageSquare } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import LoginForm from './LoginForm';
import AvatarCropper from './AvatarCropper';

export default async function AtletaPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('player_session');

  if (!session) {
    return <LoginForm />;
  }

  const player = await prisma.player.findUnique({
    where: { id: session.value }
  });

  if (!player) {
    return <LoginForm />;
  }

  return (
    <div className="max-w-4xl mx-auto w-full animate-fade-in-up mt-8">
      <div className="glass-card p-8 md:p-12 border-acvb-gold/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-acvb-gold/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 relative z-10 border-b border-white/10 pb-8">
          <div className="flex items-center gap-6">
            {player.photoUrl ? (
              <img src={player.photoUrl} alt="Perfil" className="w-24 h-24 rounded-full object-cover border-4 border-acvb-gold/30 shadow-xl" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-black/50 border-4 border-white/10 flex items-center justify-center shadow-xl">
                <User className="w-10 h-10 text-gray-500" />
              </div>
            )}
            <div>
              <h1 className="font-heading text-4xl font-black text-white tracking-tighter">{player.name}</h1>
              <div className="flex gap-3 mt-2">
                <span className="bg-acvb-gold text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Camisa {player.number}</span>
                <span className="bg-white/10 text-gray-300 border border-white/10 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">{player.position}</span>
              </div>
            </div>
          </div>
          <form action={logoutPlayerCommand}>
            <button type="submit" className="text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-widest transition-colors">Sair da Conta</button>
          </form>
        </div>

        <form action={updatePlayerProfileCommand} className="space-y-8 relative z-10">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-acvb-gold uppercase tracking-widest mb-3">
              <MessageSquare className="w-4 h-4" /> Biografia do Atleta
            </label>
            <textarea name="bio" defaultValue={player.bio || ''} rows={4} className="input-premium resize-none" placeholder="Conte um pouco sobre sua trajetória no vôlei..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            <AvatarCropper />
            
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-acvb-gold uppercase tracking-widest mb-3">
                <FaInstagram className="w-4 h-4" /> Instagram (Apenas o @)
              </label>
              <input type="text" name="instagram" defaultValue={player.instagram || ''} className="input-premium" placeholder="@seunome" />
            </div>
          </div>

          <button type="submit" className="w-full bg-acvb-gold text-black font-black uppercase tracking-widest text-sm py-5 rounded-xl hover:bg-white transition-all duration-300 shadow-[0_0_20px_-5px_rgba(185,141,59,0.5)]">
            Atualizar Meu Perfil
          </button>
        </form>

      </div>
    </div>
  );
}