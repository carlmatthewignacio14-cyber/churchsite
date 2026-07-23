'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

// ... interfaces ...

export default function DashboardChat({ currentUser }: { currentUser: any }) {
  // ... state & logic ...

  return (
    // Changed: Uses h-screen w-full to span the full viewport height and width
    <div className="flex flex-col h-screen w-full bg-slate-900 overflow-hidden">
      
      {/* TOP HEADER (Back Button / Title) */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-lg font-bold tracking-wide"
        >
          ← BACK TO HOMEPAGE
        </button>
      </div>

      {/* MAIN VIEWPORT AREA (Fills available space) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* STAFF TAB VIEW */}
        {activeTab === 'staff' && isLeaderOrPastor && (
          <div className="flex-1 p-6 text-slate-200 overflow-y-auto">
            <h2 className="text-lg font-bold mb-2">Staff Portal</h2>
            <p className="text-xs text-slate-400">Exclusive tools and directory for church leadership.</p>
          </div>
        )}

        {/* MANAGE TAB VIEW */}
        {activeTab === 'manage' && isLeaderOrPastor && (
          <div className="flex-1 p-6 text-slate-200 overflow-y-auto">
            <h2 className="text-lg font-bold mb-2">Management Dashboard</h2>
            <p className="text-xs text-slate-400">Administrative controls and user role management.</p>
          </div>
        )}

        {/* SETTINGS TAB VIEW */}
        {activeTab === 'settings' && (
          <div className="flex-1 p-6 text-slate-200 space-y-4 overflow-y-auto">
            <div>
              <h2 className="text-lg font-bold mb-1">Settings</h2>
              <p className="text-xs text-slate-400">Manage your profile and communication preferences.</p>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-xs font-semibold text-slate-300">Logged in as: </span>
              <span className="text-xs text-blue-400 font-bold">{myUsername} ({userRole.toUpperCase()})</span>
            </div>
            {isLeaderOrPastor && (
              <div className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-lg space-y-2">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  👑 Pastoral & Leadership Controls
                </h3>
                <p className="text-xs text-slate-400">
                  Access system-wide broadcast privileges, audit logs, and member oversight tools.
                </p>
              </div>
            )}
          </div>
        )}

        {/* CHAT TAB VIEW */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex w-full overflow-hidden">
            
            {/* LEFT SIDEBAR (Width: 320px fixed or 1/4 layout) */}
            <div className="w-80 border-r border-slate-800 bg-slate-950 flex flex-col p-3 space-y-4">
              {isLeaderOrPastor && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Create Group</h4>
                  <form onSubmit={handleCreateGroup} className="flex gap-1">
                    <input
                      type="text"
                      placeholder="Group Name..."
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded p-1 text-xs text-white w-full focus:outline-none"
                    />
                    <button type="submit" className="bg-blue-600 px-2.5 py-1 rounded text-xs text-white font-bold">+</button>
                  </form>
                </div>
              )}

              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Your Chat Channels</h4>
                  <div className="space-y-1">
                    {rooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => setActiveRoom(room)}
                        className={`w-full text-left text-xs p-2.5 rounded-lg block truncate transition ${
                          activeRoom?.id === room.id ? 'bg-blue-600 text-white font-bold' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {room.is_group ? `👥 ${room.name}` : `💬 ${room.name}`}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Direct Messages</h4>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white w-full mb-2 focus:outline-none"
                  />
                  <div className="space-y-1">
                    {usersList
                      .filter((user) =>
                        (user.username || user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleStartDM(user)}
                          className="w-full text-left text-xs p-2.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 block truncate"
                        >
                          👤 {user.username || user.email}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE CHAT FEED */}
            <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
              {activeRoom ? (
                <>
                  <div className="p-3 bg-slate-950 border-b border-slate-800">
                    <h3 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      {activeRoom.name}
                    </h3>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
                    {messages.length === 0 ? (
                      <div className="text-center text-xs text-slate-500 pt-12">No communication history here. Say something!</div>
                    ) : (
                      messages.map((msg) => {
                        const isMe = msg.sender === myUsername;
                        return (
                          <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <span className="text-[10px] text-slate-400 mb-0.5 px-1">{msg.sender}</span>
                            <div className={`p-2.5 rounded-xl max-w-sm text-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-100 rounded-tl-none'}`}>
                              {msg.text}
                            </div>
                            <span className="text-[10px] text-slate-500 mt-0.5 px-1">{msg.timestamp}</span>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2 bg-slate-950">
                    <input
                      type="text"
                      placeholder="Type your message here..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                    <button type="submit" className="bg-blue-600 px-5 py-2 rounded-lg text-sm text-white font-bold hover:bg-blue-500">Send</button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-slate-500 text-center p-8">
                  Select a conversation thread or create a group room from the sidebar menu to start messaging.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM NAVIGATION BAR */}
      <nav className="h-14 bg-slate-950 border-t border-slate-800 flex items-center justify-around px-2 text-[11px] font-medium text-slate-400 shrink-0">
        {isLeaderOrPastor && (
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'staff' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'}`}
          >
            <span>👥</span>
            <span>STAFF</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'chat' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'}`}
        >
          <span>💬</span>
          <span>CHAT</span>
        </button>

        {isLeaderOrPastor && (
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'manage' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'}`}
          >
            <span>📺</span>
            <span>MANAGE</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'}`}
        >
          <span>⚙️</span>
          <span>SETTINGS</span>
        </button>
      </nav>
    </div>
  );
}
