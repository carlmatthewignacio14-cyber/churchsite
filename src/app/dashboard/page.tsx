'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ChurchUser {
  id: string;
  email: string;
  raw_user_meta_data: {
    role?: string;
  };
}

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('New');
  const [loading, setLoading] = useState(true);

  // States for the Management panel
  const [membersList, setMembersList] = useState<ChurchUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    // 1. Get logged-in user profile attributes
    const fetchUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/'; // Kick unauthenticated guests to home
        return;
      }
      setCurrentUser(session.user);
      const role = session.user?.user_metadata?.role || 'New';
      setUserRole(role);

      // 2. If user is a Leader or Pastor, fetch the list of church members
      if (role === 'Leaders' || role === 'Pastors') {
        fetchChurchMembers();
      } else {
        setLoading(false);
      }
    };

    fetchUserSession();
  }, []);

  const fetchChurchMembers = async () => {
    // NOTE: This basic code fetches accounts directly via Supabase Auth metadata lookup.
    // In a production app, you will ideally fetch this from a custom 'profiles' table.
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (!error && data?.users) {
      // Filter list to prioritize viewing standard Members or New users
      const filtered = data.users.filter(
        (u: any) => u.user_metadata?.role === 'Members' || u.user_metadata?.role === 'New'
      );
      setMembersList(filtered);
    }
    setLoading(false);
  };

  const handlePromoteToStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionMessage('');

    if (!selectedUserId || !selectedMonth || !taskDescription) {
      setActionMessage('❌ Please populate all assignment configurations.');
      return;
    }

    // 🛡️ Security Check: Ensure standard users can't trigger this manually
    if (userRole !== 'Leaders' && userRole !== 'Pastors') {
      setActionMessage('⛔ Unauthorized action configuration.');
      return;
    }

    // 🗄️ Update User Metadata via Supabase Admin API
    // Note: Updating roles typically requires custom Edge Functions or an internal profiles table.
    // Here we show how to assign the metadata parameters cleanly:
    const { error } = await supabase.auth.admin.updateUserById(selectedUserId, {
      user_metadata: { 
        role: 'Staff', 
        monthly_assignment: taskDescription,
        assignment_month: selectedMonth
      }
    });

    if (error) {
      setActionMessage(`❌ Update failed: ${error.message}`);
    } else {
      setActionMessage('🎉 Success! User role promoted to Staff with assignment active.');
      // Reset form controls
      setSelectedUserId('');
      setTaskDescription('');
      setSelectedMonth('');
      fetchChurchMembers(); // Refresh directory layout
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading portal database configurations...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Summary Strip */}
        <div className="border border-slate-800 bg-slate-900/50 p-6 rounded-xl backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display">Church Management Portal</h1>
            <p className="text-sm text-slate-400 mt-1">Logged in as: <span className="text-white font-medium">{currentUser?.email}</span></p>
          </div>
          <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
            Role Tier: {userRole}
          </span>
        </div>

        {/* 📋 SECTION A: Staff View Panel (Display unique tasks assigned to them) */}
        {userRole === 'Staff' && (
          <div className="border border-slate-800 bg-slate-900 p-6 rounded-xl">
            <h2 className="text-lg font-bold text-green-400 mb-2">📋 Your Monthly Schedule Assignment</h2>
            {currentUser?.user_metadata?.monthly_assignment ? (
              <div className="bg-slate-950 p-4 rounded border border-slate-800 mt-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Month: {currentUser.user_metadata.assignment_month}</p>
                <p className="text-white text-base mt-1 font-medium">{currentUser.user_metadata.monthly_assignment}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-400 mt-2">No task structures logged for this current cycle loop.</p>
            )}
          </div>
        )}

        {/* 🛠️ SECTION B: Leader & Pastor Administration Console */}
        {(userRole === 'Leaders' || userRole === 'Pastors') && (
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Left Column: Form Assignment Prompter */}
            <div className="md:col-span-2 border border-slate-800 bg-slate-900 p-6 rounded-xl space-y-4">
              <h2 className="text-lg font-bold text-amber-400">Promote Member to Monthly Staff</h2>
              <p className="text-xs text-slate-400">Select a church member below to grant them Staff access and set their schedule assignment for the month.</p>

              {actionMessage && <div className="text-sm p-3 rounded bg-slate-950 border border-slate-800 font-medium">{actionMessage}</div>}

              <form onSubmit={handlePromoteToStaff} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-400">Select Account</label>
                  <select 
                    value={selectedUserId} 
                    onChange={e => setSelectedUserId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-sm mt-1 focus:border-blue-500 outline-none"
                  >
                    <option value="">-- Choose an Available Member --</option>
                    {membersList.map(m => (
                      <option key={m.id} value={m.id}>{m.email} ({m.raw_user_meta_data?.role || 'Members'})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase text-slate-400">Target Month</label>
                    <input 
                      type="month" 
                      value={selectedMonth}
                      onChange={e => setSelectedMonth(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-sm mt-1 focus:border-blue-500 outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase text-slate-400">Task Schedule Details</label>
                  <textarea 
                    rows={3}
                    placeholder="e.g., Usher Duty Setup, Media Tech Operator, Greeter Team Lead"
                    value={taskDescription}
                    onChange={e => setTaskDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-sm mt-1 focus:border-blue-500 outline-none resize-none"
                  />
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg text-xs tracking-widest uppercase transition-all shadow-md">
                  Confirm Allocation & Update Status
                </button>
              </form>
            </div>

            {/* Right Column: Special Quick Management Switches for Pastor Tier */}
            <div className="border border-slate-800 bg-slate-900 p-6 rounded-xl space-y-4">
              <h2 className="text-lg font-bold text-purple-400">System Utilities</h2>
              <div className="space-y-2">
                <button className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-left text-xs font-semibold text-slate-300 hover:border-purple-500 transition-colors">
                  📁 Global Website Info Editor
                </button>
                
                {/* 👑 PASTOR ONLY EXCLUSIVE CONTROLS */}
                {userRole === 'Pastors' ? (
                  <>
                    <button className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-left text-xs font-semibold text-purple-400 hover:border-purple-500 transition-colors">
                      📤 Upload Media Library Files
                    </button>
                    <button className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-left text-xs font-semibold text-purple-400 hover:border-purple-500 transition-colors">
                      👑 Manage Leader Account Tiers
                    </button>
                  </>
                ) : (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-500 text-center">
                    🔒 Media uploading and Leader promotion parameters require Pastor access level permissions.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Fallback View for standard unregistered or New users */}
        {userRole === 'New' && (
          <div className="border border-slate-800 bg-slate-900 p-6 rounded-xl text-center">
            <h2 className="text-lg font-bold text-white mb-2">Welcome to the Church Portal!</h2>
            <p className="text-sm text-slate-400">
              Your account is active, but you do not have any specialized roles assigned to your identity yet. Please speak to a leader if you need staff portal assignments.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
