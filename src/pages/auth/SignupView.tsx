import React, { useState } from 'react';
import { sound } from '../../utils/audio';

interface SignupViewProps {
  onSignup: () => void;
  onNavigateToLogin: () => void;
}

export function SignupView({ onSignup, onNavigateToLogin }: SignupViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    onSignup();
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-extrabold text-slate-800">Sign up</h2>
      <p className="mt-3 text-sm text-slate-500">
        Create a new account to get started.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400">Email</label>
          <input
            type="email"
            placeholder="username@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400">Password</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-[#8B5CF6] py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-500/30 transition-all hover:bg-purple-600 active:scale-[0.98]"
        >
          Create Account
        </button>
      </form>

      <div className="mt-8 text-center text-xs font-medium text-slate-400">
        Already have an account?{' '}
        <button 
          onClick={onNavigateToLogin}
          className="font-bold text-[#8B5CF6] hover:text-purple-700 transition-colors"
        >
          Login
        </button>
      </div>
    </div>
  );
}
