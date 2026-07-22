'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { loginWithPasscodeOnly } from '../app/dashboard/passcodeAction';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passcodeOnly, setPasscodeOnly] = useState('');
  const [isLeaderOrPastor, setIsLeaderOrPastor] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (isLeaderOrPastor) {
      const result = await loginWithPasscodeOnly(passcodeOnly);
      if (!result.success) {
        setErrorMsg(result.message);
        setLoading(false);
      } else {
        alert('Passcode Verified! Entering Portal...');
        window.location.href = '/dashboard';
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
      } else {
        window.location.href = '/dashboard';
      }
    }
  };

  return (
    <div className="w-full text-white bg-slate-950 p-2">
      <h3 className="text-lg font-bold mb-4 text-center">Church Portal Sign In</h3>
      
      {errorMsg && <p className="bg-red-500/20 text-red-400 p-2 text-xs rounded mb-4 text-center border border-red-500/30">{errorMsg}</p>}

      <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800 mb-4">
        <span className="text-xs font-semibold text-slate-300">Are you a Leader or Pastor?</span>
        <button
          type="button"
          onClick={() => { setIsLeaderOrPastor(!isLeaderOrPastor); setErrorMsg(''); }}
          className={`text-xs font-bold px-3 py-1 rounded transition-all uppercase tracking-wider ${
            isLeaderOrPastor ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-400'
          }`}
        >
          {isLeaderOrPastor ? 'Yes (Passcode Only)' : 'No'}
        </button>
      </div>

      <form onSubmit={handleLoginSubmit} className="space-y-4">
        {!isLeaderOrPastor ? (
          <>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none" />
            </div>
          </>
        ) : (
          <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-lg space-y-2">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Enter Your Personal Passcode</label>
            <p className="text-[11px] text-slate-400 leading-normal">No email or password required. Type your private code to enter:</p>
            <input 
              type="password" 
              placeholder="••••••"
              required 
              value={passcodeOnly} 
              onChange={e => setPasscodeOnly(e.target.value)} 
              className="w-full bg-slate-900 border border-amber-500/30 p-3 rounded text-white text-center font-mono text-lg tracking-widest focus:border-amber-500 outline-none mt-1" 
            />
          </div>
        )}

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
