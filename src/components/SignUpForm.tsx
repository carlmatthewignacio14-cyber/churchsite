'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ChurchRole } from '../contexts/auth-types';
import { registerChurchLeader } from '../app/dashboard/signupAction';

export default function SignUpForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<ChurchRole>('New');
  const [ministry, setMinistry] = useState('');
  
  const [tierCode, setTierCode] = useState(''); // Replaced masterCode with Tier Code
  const [personalPasscode, setPersonalPasscode] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccess(false);
    setLoading(true);

    const isLeaderOrPastor = role === 'Leaders' || role === 'Pastors';

    try {
      // 🔒 1. Check Roster Verification for Members, Leaders, or Pastors
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

      if (isLeaderOrPastor) {
        // 🔒 Code Length Gate Check
        if (personalPasscode.length < 4) {
          setErrorMsg('Your private passcode must be at least 4 digits long.');
          setLoading(false);
          return;
        }

        // 👑 ROUTE A: Use the safe server background builder for Leaders & Pastors
        const result = await registerChurchLeader(
          email,
          password,
          role,
          tierCode,
          username,
          ministry,
          firstName, // 👈 Make sure this is passed here
          lastName   // 👈 Make sure this is passed here
        );
        
        if (!result.success) {
          setErrorMsg(result.message);
          setSuccess(false);
        } else {
          setSuccess(true);
          setTierCode('');
          setPersonalPasscode('');
          setUsername('');
          setMinistry('');
          setFirstName('');
          setLastName('');
        }
      } else {
        // ✉️ ROUTE B: Standard signup for Visitors & Members
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { role, username, firstName, lastName } }
        });
        if (error) throw error;
        setSuccess(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-white bg-slate-950 p-4 rounded-xl border border-slate-800">
      <h3 className="text-lg font-bold mb-4 text-center">Create Church Account</h3>
      
      {errorMsg && <p className="bg-red-500/20 text-red-400 p-2.5 text-xs rounded mb-4 text-center border border-red-500/30">{errorMsg}</p>}
      {success && <p className="bg-green-500/20 text-green-400 p-2.5 text-xs rounded mb-4 text-center border border-green-500/30">🎉 Success! Account successfully registered.</p>}

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
            onChange={e => { setRole(e.target.value as ChurchRole); setTierCode(''); setPersonalPasscode(''); setErrorMsg(''); }}
            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none cursor-pointer"
          >
            <option value="New">New (Visitor / Guest)</option>
            <option value="Members">Members</option>
            <option value="Leaders">Leaders</option>
            <option value="Pastors">Pastors</option>
          </select>
        </div>

        {/* ➕ Conditional Ministry Dropdown for Leaders */}
        {role === 'Leaders' && (
          <div className="animate-fadeIn">
            <label className="text-xs font-semibold text-amber-400 block mb-1">Ministry Assignment</label>
            <select value={ministry} onChange={e => setMinistry(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-amber-500 outline-none cursor-pointer">
              <option value="">-- Select Your Ministry Team --</option>
              <option value="Pastoral Team">Pastoral Team</option>
              <option value="Men's Ministry">Men's Ministry</option>
              <option value="Women's Ministry">Women's Ministry</option>
              <option value="Youth Ministry">Youth Ministry</option>
              <option value="Kids Ministry">Kids Ministry</option>
              <option value="Multimedia Ministry">Multimedia Ministry</option>
            </select>
          </div>
        )}
        
        {/* 🔑 STEP A: Input Tier Code for Members, Leaders, or Pastors */}
        {role !== 'New' && (
          <div className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-lg space-y-3">
            <div>
              <label className="text-xs font-semibold text-amber-400 block mb-1">Church Membership / Tier Code</label>
              <input 
                type="text" 
                placeholder="e.g. MEMBER2026, LEAD2026, PASTOR2026"
                required 
                value={tierCode} 
                onChange={e => setTierCode(e.target.value)} 
                className="w-full bg-slate-900 border border-amber-500/20 p-2.5 rounded text-white text-sm focus:border-amber-400 outline-none uppercase font-mono" 
              />
            </div>

            {/* 🔒 STEP B: Build Private Login Key for Leaders/Pastors */}
            {(role === 'Leaders' || role === 'Pastors') && (
              <div className="border-t border-slate-800 pt-3 animate-fadeIn">
                <label className="text-xs font-semibold text-green-400 block mb-1">Set Up Your Private Passcode</label>
                <input 
                  type="password" 
                  placeholder="Create your personal login passcode"
                  required 
                  value={personalPasscode} 
                  onChange={e => setPersonalPasscode(e.target.value)} 
                  className="w-full bg-slate-900 border border-green-500/20 p-2.5 rounded text-white text-sm focus:border-green-400 outline-none font-mono tracking-widest text-center" 
                />
                <p className="text-[10px] text-slate-400 mt-1 leading-normal">You will use this private passcode to log in from now on.</p>
              </div>
            )}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold p-2.5 rounded-lg text-xs tracking-widest uppercase transition-all shadow-md mt-2 cursor-pointer"
        >
          {loading ? 'Verifying Roster...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
