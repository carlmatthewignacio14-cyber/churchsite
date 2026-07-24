'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ChurchRole } from '../contexts/auth-types';

export default function SignUpForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<ChurchRole>('New');
  
  const [tierCode, setTierCode] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // 🔒 1. Check Roster Verification for Members, Leaders, and Pastors
      if (role !== 'New') {
        const { data: verification, error: rpcError } = await supabase.rpc('signup_church_member', {
          p_first_name: firstName,
          p_last_name: lastName,
          p_code: tierCode,
        });

        if (rpcError) throw rpcError;

        if (!verification.success) {
          setErrorMsg(verification.message);
          setLoading(false);
          return;
        }
      }

      // ✉️ Standard signup for all statuses
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role, username, firstName, lastName } }
      });
      if (error) throw error;
      
      // Automatically signed in by Supabase session, redirect straight to dashboard
      window.location.href = '/dashboard';
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during signup.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-white bg-slate-950 p-4 rounded-xl border border-slate-800">
      <h3 className="text-lg font-bold mb-4 text-center">Create Church Account</h3>
      
      {errorMsg && <p className="bg-red-500/20 text-red-400 p-2.5 text-xs rounded mb-4 text-center border border-red-500/30">{errorMsg}</p>}

      <form onSubmit={handleSignUpSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">First Name</label>
            <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Last Name</label>
            <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Username</label>
          <input type="text" required value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter unique username" className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none" />
        </div>
        
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Email Address</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none" />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Password</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none" />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Your Position Status</label>
          <select 
            value={role} 
            onChange={e => { setRole(e.target.value as ChurchRole); setTierCode(''); setErrorMsg(''); }}
            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none cursor-pointer"
          >
            <option value="New">New (Visitor / Guest)</option>
            <option value="Member">Member</option>
            <option value="Leader">Leader</option>
            <option value="Pastor">Pastor</option>
          </select>
        </div>
        
        {role !== 'New' && (
          <div className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-lg space-y-3">
            <div>
              <label className="text-xs font-semibold text-amber-400 block mb-1">Church Membership / Tier Code</label>
              <input 
                type="text" 
                placeholder="e.g. CODE2026"
                required 
                value={tierCode} 
                onChange={e => setTierCode(e.target.value)} 
                className="w-full bg-slate-900 border border-amber-500/20 p-2.5 rounded text-white text-sm focus:border-amber-400 outline-none uppercase font-mono" 
              />
            </div>
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold p-2.5 rounded-lg text-xs tracking-widest uppercase transition-all shadow-md mt-2 cursor-pointer"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
