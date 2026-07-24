'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="w-full text-white bg-slate-950 p-2">
      <h3 className="text-lg font-bold mb-4 text-center">Church Portal Sign In</h3>
      
      {errorMsg && <p className="bg-red-500/20 text-red-400 p-2 text-xs rounded mb-4 text-center border border-red-500/30">{errorMsg}</p>}

      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Email Address</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Password</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none" />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold p-2.5 rounded-lg text-xs tracking-widest uppercase transition-all shadow-md mt-2"
        >
          {loading ? 'Authorizing...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}
