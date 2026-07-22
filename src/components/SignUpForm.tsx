'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase'
; // Hooks up to your local lib/supabase configuration folder
import { ChurchRole } from '../contexts/auth-types';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<ChurchRole>('New'); // Default state is visitor 'New'
  
  // Passcode Fields
  const [masterCode, setMasterCode] = useState('');
  const [personalPasscode, setPersonalPasscode] = useState('');
  
  // System feedback states
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Validation Checks: Does input match master env keys?
  const isMasterLeaderCodeValid = role === 'Leaders' && masterCode === process.env.NEXT_PUBLIC_LEADER_MASTER_CODE;
  const isMasterPastorCodeValid = role === 'Pastors' && masterCode === process.env.NEXT_PUBLIC_PASTOR_MASTER_CODE;
  const masterUnlocked = isMasterLeaderCodeValid || isMasterPastorCodeValid;

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccess(false);

    // 🔒 1. Core Gate Check
    if ((role === 'Leaders' || role === 'Pastors') && !masterUnlocked) {
      setErrorMsg('The global church master registration code is incorrect.');
      return;
    }

    // 🔒 2. Strength Evaluation for Personal Key
    if ((role === 'Leaders' || role === 'Pastors') && personalPasscode.length < 6) {
      setErrorMsg('Your new unique personal passcode must be at least 6 characters.');
      return;
    }

    // 🗄️ 3. Push account securely straight to your Supabase engine
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role, 
          personal_code: personalPasscode || null // Persists personal code inside secure user metadata
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccess(true);
      alert('Registration successful! Your private passcode is now registered.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-slate-900 border border-slate-800 rounded-lg text-white shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-center">Create Church Account</h2>
      
      {errorMsg && <p className="bg-red-500/20 text-red-400 p-2 text-sm rounded mb-4 text-center border border-red-500/30">{errorMsg}</p>}
      {success && <p className="bg-green-500/20 text-green-400 p-2 text-sm rounded mb-4 text-center border border-green-500/30">Success! Check email configuration.</p>}

      <form onSubmit={handleSignUpSubmit} className="space-y-4">
        <div>
          <label className="text-sm block font-medium">Email Address</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-white mt-1" />
        </div>

        <div>
          <label className="text-sm block font-medium">Password</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-white mt-1" />
        </div>

        {/* 🎭 Core Role Dropdown */}
        <div>
          <label className="text-sm block font-medium">Position Status</label>
          <select 
            value={role} 
            onChange={e => { setRole(e.target.value as ChurchRole); setMasterCode(''); setPersonalPasscode(''); setErrorMsg(''); }} 
            className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-white mt-1 cursor-pointer"
          >
            <option value="New">New (Visitor / Guest)</option>
            <option value="Members">Members</option>
            <option value="Leaders">Leaders</option>
            <option value="Pastors">Pastors</option>
          </select>
        </div>

        {/* 🔑 STEP A: Insert Church Master Key */}
        {(role === 'Leaders' || role === 'Pastors') && (
          <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded space-y-3">
            <div>
              <label className="text-sm block font-semibold text-amber-400">Master Church Code</label>
              <input 
                type="password" 
                placeholder="Enter general master setup key"
                required 
                value={masterCode} 
                onChange={e => setMasterCode(e.target.value)} 
                className="w-full bg-slate-800 border border-amber-500/40 p-2 rounded text-white mt-1" 
              />
            </div>

            {/* 🔒 STEP B: Build Unique Personal Security Passcode */}
            {masterUnlocked && (
              <div className="border-t border-amber-500/20 pt-3">
                <label className="text-sm block font-semibold text-green-400">✅ Setup Your Personal Passcode</label>
                <input 
                  type="password" 
                  placeholder="Set your custom personal passcode"
                  required 
                  value={personalPasscode} 
                  onChange={e => setPersonalPasscode(e.target.value)} 
                  className="w-full bg-slate-800 border border-green-500/40 p-2 rounded text-white mt-1" 
                />
                <p className="text-xs text-slate-400 mt-1">This will replace the master key for all your future login sessions.</p>
              </div>
            )}
          </div>
        )}

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded transition mt-2">
          Create Secure Profile
        </button>
      </form>
    </div>
  );
}
