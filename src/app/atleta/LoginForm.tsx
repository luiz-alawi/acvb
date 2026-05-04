'use client'

import { loginPlayerCommand } from '@/app/actions/commands';
import { User, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function LoginForm() {
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    const result = await loginPlayerCommand(formData);
    
    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div className="grow flex items-center justify-center animate-fade-in-up w-full">
      <form onSubmit={handleSubmit} className="glass-card p-10 max-w-md w-full text-center border-acvb-gold/20">
        <User className="w-16 h-16 text-acvb-gold mx-auto mb-6 opacity-80" />
        <h1 className="font-heading text-2xl font-black text-white mb-2 uppercase tracking-widest">Portal do Atleta</h1>
        <p className="text-xs text-gray-500 mb-8">Faça login para gerenciar seu card de jogador.</p>
        
        {error && (
          <div className="flex items-center justify-center gap-2 text-red-500 text-xs font-bold bg-red-500/10 p-3 rounded-lg mb-6 border border-red-500/20">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <input required type="email" name="email" placeholder="E-mail" className="w-full p-4 rounded-xl border border-white/10 bg-[#050A14] text-white focus:border-acvb-gold focus:outline-none transition-colors" />
          <input required type="password" name="password" placeholder="Senha" className="w-full p-4 rounded-xl border border-white/10 bg-[#050A14] text-white focus:border-acvb-gold focus:outline-none transition-colors" />
        </div>
        
        <button type="submit" className="w-full bg-acvb-gold text-black font-bold text-sm tracking-widest uppercase py-4 rounded-xl hover:bg-white transition-all">
          Entrar na Quadra
        </button>
      </form>
    </div>
  );
}