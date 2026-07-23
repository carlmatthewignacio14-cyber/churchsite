'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DashboardSettings({ currentUser }: { currentUser: any }) {
  const [username, setUsername] = useState(currentUser?.user_metadata?.username || '');
  const [newPassword, setNewPassword] = useState('');
  
  // Notification Toggle Switch States
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [scheduleAlerts, setScheduleAlerts] = useState(true);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    // 💾 1. Update Username in Supabase User Metadata
    const { error: metaError } = await supabase.auth.updateUser({
      data: { username: username }
    });

    if (metaError) {
      setMessage(`❌ Failed to update username: ${metaError.message}`);
      setLoading(false);
      return;
    }

    // 🔑 2. Update Password if typed in
    if (newPassword.trim()) {
      if (newPassword.length < 6) {
        setMessage('❌ New password must be at least 6 characters long.');
        setLoading(false);
        return;
      }
      const { error: passError } = await supabase.auth.updateUser({ password: newPassword });
      if (passError) {
        setMessage(`❌ Failed to update password: ${passError.message}`);
        setLoading(false);
        return;
      }
      setNewPassword('');
    }

    setMessage('🎉 Account information saved successfully! Please log out and back in to see changes.');
    setLoading(false);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <form onSubmit={handleUpdateProfile} className="md:col-span-2 border border-slate-800 bg-slate-900 p-6 rounded-xl space-y-4">
        <h2 className="text-base font-bold text-slate-100">Account Profile Configurations</h2>
        <p className="text-xs text-slate-400">Modify your basic account info cards or alter password credentials below.</p>

        {message && <div className="text-xs p-3 rounded bg-slate-950 border border-slate-800 font-medium text-slate-200">{message}</div>}

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-400 block mb-1">Display Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none" />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-slate-400 block mb-1">Email Address (Read Only)</label>
            <input type="email" disabled value={currentUser?.email || ''} className="w-full bg-slate-950/40 border border-slate-800/60 p-2.5 rounded text-slate-500 text-sm cursor-not-allowed outline-none" />
          </div>

          <div className="border-t border-slate-800 pt-3">
            <label className="text-xs font-semibold uppercase text-slate-400 block mb-1">Change Account Password</label>
            <input type="password" placeholder="Leave blank to keep current password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg text-xs tracking-widest uppercase transition-all shadow-md mt-2">
          {loading ? 'Saving Data...' : 'Save Settings Updates'}
        </button>
      </form>

      {/* Right Column Notifications Hub Card */}
      <div className="border border-slate-800 bg-slate-900 p-5 rounded-xl space-y-4 h-fit">
        <h3 className="text-sm font-bold text-slate-200">System Notifications</h3>
        <p className="text-[11px] text-slate-400 leading-normal">Control what kind of alerts and announcements are generated for your account profile.</p>
        
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-slate-800/40 pb-2">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">General Church Alerts</span>
              <span className="text-[10px] text-slate-400">Receive mass event update emails.</span>
            </div>
            <input type="checkbox" checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} className="w-4 h-4 accent-blue-500 cursor-pointer" />
          </div>

          <div className="flex items-center justify-between pb-1">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Duty Schedule Shifts</span>
              <span className="text-[10px] text-slate-400">Notify me when my role is updated.</span>
            </div>
            <input type="checkbox" checked={scheduleAlerts} onChange={() => setScheduleAlerts(!scheduleAlerts)} className="w-4 h-4 accent-blue-500 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}
