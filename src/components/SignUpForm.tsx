'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ChurchRole } from '../contexts/auth-types';
import { registerChurchLeader } from '../app/dashboard/signupAction';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<ChurchRole>('New');
  
  const [masterCode, setMasterCode] = useState('');
  const [personalPasscode, setPersonalPasscode] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Checks if input keys match your master configuration settings
  const isMasterLeaderCodeValid = role === 'Leaders' && masterCode === process.env.NEXT_PUBLIC_LEADER_MASTER_CODE;
  const isMasterPastorCodeValid = role === 'Pastors' && masterCode === process.env.NEXT_PUBLIC_PASTOR_MASTER_CODE;
  const masterUnlocked = isMasterLeaderCodeValid || isMasterPastorCodeValid;

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccess(false);
    setLoading(true);

    const isLeaderOrPastor = role === 'Leaders' || role === 'Pastors';

    // 🔒 1. Master Security Check Gate
    if (isLeaderOrPastor && !masterUnlocked) {
      setErrorMsg('The master registration activation code is incorrect.');
      setLoading(false);
      return;
    }

    // 🔒 2. Code Length Gate Check
    if (isLeaderOrPastor && personalPasscode.length < 4) {
      setErrorMsg('Your private passcode must be at least 4 digits long.');
      setLoading(false);
      return;
    }

    if (isLeaderOrPastor) {
      // 👑 ROUTE A: Use the safe server background builder for Leaders & Pastors
      const result = await registerChurchLeader(email, password, role, personalPasscode);
      if (!result.success) {
        setErrorMsg(result.message);
        setSuccess(false);
      } else {
        setSuccess(true);
        // Clear secret parameters
        setMasterCode('');
        setPersonalPasscode('');
      }
    } else {
      // ✉️ ROUTE B: Standard signup for general Visitors & Members
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role } }
      });
      if (error) setErrorMsg(error.message);
      else setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="w-full text-white bg-slate-950 p-2">
      <h3 className="text-lg font-bold mb-4 text-center">Create Church Account</h3>
      
      {errorMsg && <p className="bg-red-500/20 text-red-400 p-2 text-xs rounded mb-4 text-center border border-red-500/30">{errorMsg}</p>}
      {success && <p className="bg-green-500/20 text-green-400 p-2 text-xs rounded mb-4 text-center border border-green-500/30">🎉 Success! Account successfully registered.</p>}

      <form onSubmit={handleSignUpSubmit} className="space-y-4">
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
            onChange={e => { setRole(e.target.value as ChurchRole); setMasterCode(''); setPersonalPasscode(''); setErrorMsg(''); }}
            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none cursor-pointer bg-no-repeat"
          >
            <option value="New">New (Visitor / Guest)</option>
            <option value="Members">Members</option>
            <option value="Leaders">Leaders</option>
            <option value="Pastors">Pastors</option>
          </select>
        </div>

        {/* 🔑 STEP A: Input General Setup Key */}
        {(role === 'Leaders' || role === 'Pastors') && (
          <div className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-lg space-y-3">
            <div>
              <label className="text-xs font-semibold text-amber-400 block mb-1">Master Activation Code</label>
              <input 
                type="password" 
                placeholder="Enter master code to unlock setup"
                required 
                value={masterCode} 
                onChange={e => setMasterCode(e.target.value)} 
                className="w-full bg-slate-900 border border-amber-500/20 p-2.5 rounded text-white text-sm focus:border-amber-400 outline-none" 
              />
            </div>

            {/* 🔒 STEP B: Build Private Login Key */}
            {masterUnlocked && (
              <div className="border-t border-slate-800 pt-3 animate-fadeIn">
                <label className="text-xs font-semibold text-green-400 block mb-1">✅ Code Verified! Set Up Your Private Passcode</label>
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
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold p-2.5 rounded-lg text-xs tracking-widest uppercase transition-all shadow-md mt-2"
        >
          {loading ? 'Creating Profile...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
