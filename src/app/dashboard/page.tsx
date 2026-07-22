'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('New');
  const [loading, setLoading] = useState(true);
  
  // Tab Switcher for Leaders/Pastors ('management' | 'pages')
  const [activeTab, setActiveTab] = useState<'management' | 'pages'>('management');
  // Content Sub-tab Switcher ('events' | 'recent' | 'sermons')
  const [contentTab, setContentTab] = useState<'events' | 'recent' | 'sermons'>('events');

  // Form input states for adding church content
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Mock list of team schedules for the month (visible to Staff, Leaders, Pastors)
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
        window.location.href = '/'; // Bounce unauthenticated visitors back home
        return;
      }
      setCurrentUser(session.user);
      setUserRole(session.user?.user_metadata?.role || 'New');
      setLoading(false);
    };
    fetchUserSession();
  }, []);

  const handleContentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActionMessage('Uploading data to database...');
    
    // Placeholder simulation for writing to Supabase tables
    setTimeout(() => {
      alert(`Successfully published item to ${contentTab.toUpperCase()} layout!`);
      setActionMessage(`🎉 New ${contentTab.slice(0, -1)} entry added successfully!`);
      setTitle('');
      setDescription('');
      setMediaUrl('');
    }, 800);
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-mono tracking-widest text-xs">LOADING PORTAL STRUCTURE...</div>;
  }

  // Deny access immediately if a standard 'New' visitor or basic 'Members' types this route directly
  if (userRole === 'New' || userRole === 'Members') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h2 className="text-xl font-bold text-red-400">Access Denied</h2>
          <p className="text-sm text-slate-400 mt-2">This workspace environment is strictly reserved for Church Staff, Leaders, and Pastors.</p>
          <button onClick={() => window.location.href = '/'} className="mt-4 bg-blue-600 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider">Back to Homepage</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 px-4 pb-12">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER BAR STATUS PROFILE CARD */}
        <div className="border border-slate-800 bg-slate-900/40 p-6 rounded-xl backdrop-blur-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-widest">Active Shift Profile</span>
            <h1 className="text-xl font-bold mt-1 text-slate-100">{currentUser?.email}</h1>
          </div>
          <div className="flex flex-col items-end">
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
              Position: {userRole}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Status: Confirmed for this Month</p>
          </div>
        </div>

        {/* ⭐ TOP SECTION: Your Individual Assignment for the Month */}
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

        {/* 📋 MANAGEMENT VIEW: Visible to Staff, Leaders, and Pastors */}
        {userRole === 'Staff' ? (
          /* Staff-Only Roster Board View */
          <div className="border border-slate-800 bg-slate-900 p-6 rounded-xl space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Monthly Management Roster</h2>
              <p className="text-xs text-slate-400 mt-0.5">View everyone assigned to active ministry management roles for this month cycle.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Team Member</th>
                    <th className="p-3">Position</th>
                    <th className="p-3">Assigned Management Duty</th>
                    <th className="p-3">Schedule Month</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {monthlyRoster.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="p-3 font-medium text-white">{item.name}</td>
                      <td className="p-3 text-xs"><span className="bg-slate-800 px-2 py-0.5 rounded text-slate-400">{item.role}</span></td>
                      <td className="p-3 text-slate-200">{item.assignment}</td>
                      <td className="p-3 text-xs text-slate-400">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* 👑 ADMINISTRATIVE DASHBOARD FOR LEADERS & PASTORS */
          <div className="space-y-6">
            
            {/* Top Workspace Tab Navs */}
            <div className="flex border-b border-slate-800 gap-2">
              <button 
                onClick={() => setActiveTab('management')}
                className={`px-4 py-2 text-xs tracking-widest font-bold uppercase border-b-2 transition-all ${
                  activeTab === 'management' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                👥 Roster Management
              </button>
              <button 
                onClick={() => setActiveTab('pages')}
                className={`px-4 py-2 text-xs tracking-widest font-bold uppercase border-b-2 transition-all ${
                  activeTab === 'pages' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                🖥️ Website Page Manager
              </button>
            </div>

            {/* TAB PANEL 1: Staff Allocations & Management Roster */}
            {activeTab === 'management' && (
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

                <div className="border border-slate-800 bg-slate-900 p-5 rounded-xl h-fit space-y-3">
                  <h3 className="text-sm font-bold text-slate-200">Quick Allocation Forms</h3>
                  Select church accounts from your registry directory to update their roles dynamically to active Staff.
                  <button 
                    onClick={() => alert('Opening roster picker console...')} 
                    className="w-full bg-amber-500 text-slate-950 font-bold py-2 rounded text-xs tracking-wider uppercase hover:bg-amber-400 transition-colors">
                    Assign Staff for Month


              )}
              {/* TAB PANEL 2: Website Layout Updates (Events, Recent Events, Sermons) */}
              {activeTab === 'pages' && (

                {/* Content type picker menu */}
                      <button
                        onClick={() => { setContentTab('events'); setActionMessage(''); }}
                        className={w-full text-left p-3 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${contentTab === 'events' ? 'bg-purple-600/20 text-purple-400 font-bold border border-purple-500/20' : 'hover:bg-slate-900 text-slate-400'}}
                        >
                        Upcoming Events

                      <button
                        onClick={() => { setContentTab('recent'); setActionMessage(''); }}
                        className={w-full text-left p-3 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${contentTab === 'recent' ? 'bg-purple-600/20 text-purple-400 font-bold border border-purple-500/20' : 'hover:bg-slate-900 text-slate-400'}}
                        >
                          Recent Activities

                      <button
                        onClick={() => { setContentTab('sermons'); setActionMessage(''); }}
                        className={w-full text-left p-3 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${contentTab === 'sermons' ? 'bg-purple-600/20 text-purple-400 font-bold border border-purple-500/20' : 'hover:bg-slate-900 text-slate-400'}}
                        >
                          Sermons & Media 

                {/* Main operational form template */}
                    Publish to Website: {contentTab}Fill in the values below to push modifications to the live public screen layout modules.

                    {actionMessage && {actionMessage}}

                    Title Heading
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder={e.g., Sunday Youth Worship Service, Anniversary Video}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-purple-500 outline-none"
                    />

                    Description / Summary Content
                     <textarea
                       rows={3}
                       required
                       value={description}
                       onChange={e => setDescription(e.target.value)}
                       placeholder="Provide details, times, locations or scripture references..."
                       className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-purple-500 outline-none resize-none"
                       />

                    Attach Media URL / Link (Optional)
                    <input
                      type="url"
                      value={mediaUrl}
                      onChange={e => setMediaUrl(e.target.value)}
                      placeholder="e.g., youtube.com..., google.com..."
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-purple-500 outline-none"
                      />
                      Publish Update & Upload Media


                 )}

              )}

          );
        }

                    
