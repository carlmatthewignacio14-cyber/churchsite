'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [typedPersonalCode, setTypedPersonalCode] = useState('');
  const [showCodeField, setShowCodeField] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // 🕵️ Step 1: Sign in cleanly via traditional credentials
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setErrorMsg(authError.message);
      return;
    }

    // Extract User Metadata properties from database context
    const userRole = authData.user?.user_metadata?.role || 'New';
    const databaseSavedCode = authData.user?.user_metadata?.personal_code;

    // 🛑 Step 2: Intercept session validation if the role is a Leader or Pastor
    if (userRole === 'Leaders' || userRole === 'Pastors') {
      if (!showCodeField) {
        // Prompt them to supply their personal verification key
        setShowCodeField(true);
        // Temporarily log them out until code check resolves
        await supabase.auth.signOut();
        return;
      }

      // Check if user entry matches the private code saved during signup
      if (typedPersonalCode !== databaseSavedCode) {
        setErrorMsg('Invalid Personal Security Passcode.');
        setShowCodeField(false);
        setTypedPersonalCode('');
        return;
      }

      // Re-authenticate user session once passcode is cleared safely
      await supabase.auth.signInWithPassword({ email, password });
    }

    alert(`Successfully verified session! Access level granted: ${userRole}`);
    window.location.href = '/dashboard'; // Direct safely to your panel route layouts
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-slate-900 border border-slate-800 rounded-lg text-white shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-center">Sign In</h2>
      
      {errorMsg && <p className="bg-red-500/20 text-red-400 p-2 text-sm rounded mb-4 text-center border border-red-500/30">{errorMsg}</p>}

      <form onSubmit={handleLoginSubmit} className="space-y-4">
        {!showCodeField ? (
          <>
            <div>
              <label className="text-sm block font-medium">Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-white mt-1" />
            </div>
            <div>
              <label className="text-sm block font-medium">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-white mt-1" />
            </div>
          </>
        ) : (
          <div className="bg-green-500/10 border border-green-500/30 p-4 rounded animate-fadeIn">
            <label className="text-sm block font-semibold text-green-400">Security Challenge Required</label>
            <p className="text-xs text-slate-400 mb-2">Please verify your custom personal identity passcode:</p>
            <input 
              type="password" 
              placeholder="Enter your personal passcode"
              required 
              value={typedPersonalCode} 
              onChange={e => setTypedPersonalCode(e.target.value)} 
              className="w-full bg-slate-800 border border-green-500/40 p-2 rounded text-white mt-1" 
            />
          </div>
        )}

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded transition mt-2">
          {showCodeField ? 'Confirm Code & Enter' : 'Verify Credentials'}
        </button>
      </form>
    </div>
  );
}
