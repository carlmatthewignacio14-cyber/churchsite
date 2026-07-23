'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardChat from '@/components/DashboardChat';
import DashboardSettings from '@/components/DashboardSettings';

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('New');
  const [loading, setLoading] = useState(true);

  // Default active tab: 'chat' for members, 'management' for leaders/pastors
  const [activeTab, setActiveTab] = useState<'management' | 'pages' | 'chat' | 'settings'>('chat');
  const [contentTab, setContentTab] = useState<'events' | 'recent' | 'sermons'>('events');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const monthlyRoster = [
    { name: 'John Doe', role: 'Staff', assignment: 'Praise & Worship Guitarist', date: 'August 2026' },
    { name: 'Sarah Smith', role: 'Staff', assignment: 'Sunday School Teacher', date: 'August 2026' },
    { name: 'David Lee', role: 'Staff', assignment: 'Media & Tech Operator', date: 'August 2026' },
    { name: 'Maria Santos', role: 'Staff', assignment: 'Main Entrance Greeter', date: 'August 2026' },
  ];

  useEffect(() => {
    const fetchUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/';
        return;
      }
      setCurrentUser(session.user);
      const role = session.user?.user_metadata?.role || 'Member';
      setUserRole(role);

      // Set initial tab based on role
      const lowerRole = role.toLowerCase();
      if (lowerRole === 'leader' || lowerRole === 'pastor') {
        setActiveTab('management');
      } else {
        setActiveTab('chat'); // Members default straight to Chat
      }

      setLoading(false);
    };
    fetchUserSession();
  }, []);

  const handleContentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActionMessage('Uploading data to database...');
    setTimeout(() => {
      alert(`Successfully published item to ${contentTab.toUpperCase()} layout!`);
      setActionMessage(`🎉 New ${contentTab.slice(0, -1)} entry added successfully!`);
      setTitle('');
      setDescription('');
      setMediaUrl('');
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-mono tracking-widest text-xs">
        LOADING PORTAL STRUCTURE...
      </div>
    );
  }

  // Deny unregistered / new users
  if (userRole === 'New') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h2 className="text-xl font-bold text-red-400">Access Denied</h2>
          <p className="text-sm text-slate-400 mt-2">This workspace environment is strictly reserved for Church Staff, Leaders, Pastors, and Members.</p>
          <button onClick={() => window.location.href = '/'} className="mt-4 bg-blue-600 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider">Back to Homepage</button>
        </div>
      </div>
    );
  }

  const normalizedRole = userRole.toLowerCase();
  const isLeaderOrPastor = normalizedRole === 'leader' || normalizedRole === 'pastor';
  const isStaff = normalizedRole === 'staff';

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-6 px-4 pb-28">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* 🏠 TOP BAR */}
        <div className="flex justify-start mb-2">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold px-4 py-2 rounded-lg border border-slate-800 transition-colors uppercase tracking-wider shadow-md"
          >
            ← Back to Homepage
          </button>
        </div>

        {/* ---------------- MEMBER VIEW (Only Chat and Settings) ---------------- */}
        {!isLeaderOrPastor && !isStaff ? (
          <div className="space-y-6">
            {/* 📱 MEMBER NAVIGATION BAR */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 shadow-2xl backdrop-blur-md px-2 py-2 flex justify-around items-center max-w-4xl mx-auto md:rounded-t-2xl">
              <button 
                onClick={() => setActiveTab('chat')}
                className={`flex flex-col items-center justify-center w-16 py-1 text-center transition-all focus:outline-none ${
                  activeTab === 'chat' ? 'text-green-400 font-bold scale-105' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xl">💬</span>
                <span className="text-[10px] tracking-wider uppercase mt-1 font-medium">Chat</span>
              </button>

              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex flex-col items-center justify-center w-16 py-1 text-center transition-all focus:outline-none ${
                  activeTab === 'settings' ? 'text-blue-400 font-bold scale-105' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xl">⚙️</span>
                <span className="text-[10px] tracking-wider uppercase mt-1 font-medium">Settings</span>
              </button>
            </div>

            {/* MEMBER TAB CONTENT */}
            {activeTab === 'chat' && <DashboardChat currentUser={currentUser} />}
            {activeTab === 'settings' && <DashboardSettings currentUser={currentUser} />}
          </div>
        ) : (

          /* ---------------- STAFF, LEADER & PASTOR DASHBOARD ---------------- */
          <div className="space-y-6">

            {/* 📱 APP-STYLE BOTTOM NAVIGATION BAR */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 shadow-2xl backdrop-blur-md px-2 py-2 flex justify-around items-center max-w-4xl mx-auto md:rounded-t-2xl">
              
              {/* Roster / Staff Tab */}
              <button 
                onClick={() => setActiveTab('management')}
                className={`flex flex-col items-center justify-center w-16 py-1 text-center transition-all focus:outline-none ${
                  activeTab === 'management' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xl">👥</span>
                <span className="text-[10px] tracking-wider uppercase mt-1 font-medium">Staff</span>
              </button>
              
              {/* Chat Tab */}
              <button 
                onClick={() => setActiveTab('chat')}
                className={`flex flex-col items-center justify-center w-16 py-1 text-center transition-all focus:outline-none ${
                  activeTab === 'chat' ? 'text-green-400 font-bold scale-105' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xl">💬</span>
                <span className="text-[10px] tracking-wider uppercase mt-1 font-medium">Chat</span>
              </button>

              {/* Manage Website Tab (Leaders & Pastors only) */}
              {isLeaderOrPastor && (
                <button 
                  onClick={() => setActiveTab('pages')}
                  className={`flex flex-col items-center justify-center w-16 py-1 text-center transition-all focus:outline-none ${
                    activeTab === 'pages' ? 'text-purple-400 font-bold scale-105' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xl">🖥️</span>
                  <span className="text-[10px] tracking-wider uppercase mt-1 font-medium">Manage</span>
                </button>
              )}

              {/* Settings Tab */}
              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex flex-col items-center justify-center w-16 py-1 text-center transition-all focus:outline-none ${
                  activeTab === 'settings' ? 'text-blue-400 font-bold scale-105' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xl">⚙️</span>
                <span className="text-[10px] tracking-wider uppercase mt-1 font-medium">Settings</span>
              </button>
            </div>
            
            {/* TAB PANEL 1: Roster Management */}
            {activeTab === 'management' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Header Summary Strip */}
                <div className="border border-slate-800 bg-slate-900/50 p-6 rounded-xl backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-widest">Active Profile Dashboard</span>
                    <h1 className="text-2xl font-bold mt-1 text-slate-100">
                      Welcome, {currentUser?.user_metadata?.username || currentUser?.user_metadata?.name || 'Church Member'}
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">Account Email: {currentUser?.email}</p>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-1.5">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider shadow-sm">
                      {currentUser?.user_metadata?.ministry 
                        ? `Role: ${currentUser.user_metadata.ministry.replace(" Ministry", "")} Leader` 
                        : `Role Tier: ${userRole}`}
                    </span>
                    {currentUser?.user_metadata?.ministry && (
                      <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-semibold px-2.5 py-0.5 rounded">
                        📍 {currentUser.user_metadata.ministry}
                      </span>
                    )}
                  </div>
                </div>

                {/* Personal Deployment Status Box */}
                <div className="border border-green-500/20 bg-green-500/5 p-5 rounded-xl border-l-4 border-l-green-500">
                  <h2 className="text-sm font-bold tracking-wider text-green-400 uppercase">Your Personal Deployment Status</h2>
                  {currentUser?.user_metadata?.monthly_assignment ? (
                    <div className="mt-2">
                      <p className="text-xs text-slate-400">Assigned Schedule Window: <span className="text-slate-200 font-semibold">{currentUser.user_metadata.assignment_month}</span></p>
                      <p className="text-base text-white font-medium mt-1">🎯 {currentUser.user_metadata.monthly_assignment}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-300 mt-1">You are logged on as active <span className="font-semibold">{userRole}</span>. No individual tactical duty restriction is logged for your profile today.</p>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 border border-slate-800 bg-slate-900 p-6 rounded-xl space-y-4">
                    <h2 className="text-base font-bold text-amber-400">Current Monthly Management Overview</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Duty Assignment</th>
                            <th className="p-3">Schedule</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {monthlyRoster.map((item, idx) => (
                            <tr key={idx}>
                              <td className="p-3 text-white font-medium">{item.name}</td>
                              <td className="p-3 text-slate-300">{item.assignment}</td>
                              <td className="p-3 text-slate-400">{item.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {isLeaderOrPastor && (
                    <div className="border border-slate-800 bg-slate-900 p-5 rounded-xl h-fit space-y-3">
                      <h3 className="text-sm font-bold text-slate-200">Quick Allocation Forms</h3>
                      <p className="text-xs text-slate-400">Select church accounts from your registry directory to update their roles dynamically to active Staff.</p>
                      <button
                        onClick={() => alert('Opening roster picker console...')}
                        className="w-full bg-amber-500 text-slate-950 font-bold py-2 rounded text-xs tracking-wider uppercase hover:bg-amber-400 transition-colors"
                      >
                        Assign Staff for Month
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB PANEL 2: Website Layout Updates (Leaders & Pastors) */}
            {activeTab === 'pages' && isLeaderOrPastor && (
              <div className="grid md:grid-cols-4 gap-6">
                <div className="md:col-span-1 border border-slate-800 bg-slate-900 p-4 rounded-xl space-y-2 h-fit">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Content Type</h3>
                  <button
                    onClick={() => { setContentTab('events'); setActionMessage(''); }}
                    className={`w-full text-left p-3 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${contentTab === 'events' ? 'bg-purple-600/20 text-purple-400 font-bold border border-purple-500/20' : 'hover:bg-slate-800 text-slate-400'}`}
                  >
                    Upcoming Events
                  </button>
                  <button
                    onClick={() => { setContentTab('recent'); setActionMessage(''); }}
                    className={`w-full text-left p-3 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${contentTab === 'recent' ? 'bg-purple-600/20 text-purple-400 font-bold border border-purple-500/20' : 'hover:bg-slate-800 text-slate-400'}`}
                  >
                    Recent Activities
                  </button>
                  <button
                    onClick={() => { setContentTab('sermons'); setActionMessage(''); }}
                    className={`w-full text-left p-3 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${contentTab === 'sermons' ? 'bg-purple-600/20 text-purple-400 font-bold border border-purple-500/20' : 'hover:bg-slate-800 text-slate-400'}`}
                  >
                    Sermons &amp; Media
                  </button>
                </div>

                <div className="md:col-span-3 border border-slate-800 bg-slate-900 p-6 rounded-xl space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-purple-400 capitalize">Publish to Website: {contentTab}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Fill in the values below to push modifications to the live public screen layout modules.</p>
                  </div>

                  {actionMessage && (
                    <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-2 rounded">{actionMessage}</p>
                  )}

                  <form onSubmit={handleContentSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Title Heading</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g., Sunday Youth Worship Service, Anniversary Video"
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-purple-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Description / Summary Content</label>
                      <textarea
                        rows={3}
                        required
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Provide details, times, locations or scripture references..."
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-purple-500 outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Attach Media URL / Link (Optional)</label>
                      <input
                        type="url"
                        value={mediaUrl}
                        onChange={e => setMediaUrl(e.target.value)}
                        placeholder="e.g., youtube.com..., google.com..."
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-purple-500 outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded text-xs tracking-wider uppercase transition-colors"
                    >
                      Publish Update &amp; Upload Media
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Chat View */}
            {activeTab === 'chat' && (
              <DashboardChat currentUser={currentUser} />
            )}

            {/* Settings View */}
            {activeTab === 'settings' && (
              <DashboardSettings currentUser={currentUser} />
            )}

          </div>
        )}

      </div>
    </div>
  );
}
