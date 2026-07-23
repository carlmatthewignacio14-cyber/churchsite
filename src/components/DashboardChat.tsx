'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

interface ChatRoom {
  id: string;
  name: string;
  is_group: boolean;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
}

export default function DashboardChat({ currentUser }: { currentUser: any }) {
  // Role Identification
  const rawRole = currentUser?.user_metadata?.role || currentUser?.role || 'member';
  const userRole = rawRole.toString().toLowerCase();
  const isLeaderOrPastor = ['leader', 'pastor'].includes(userRole);

  // Navigation & View States
  const [activeTab, setActiveTab] = useState<'staff' | 'chat' | 'manage' | 'settings'>('chat');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  // Chat Data States
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newGroupName, setNewGroupName] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const myUsername = currentUser?.user_metadata?.username || currentUser?.email || 'User';
  const currentUserId = currentUser?.id;

  // 1. Initial Fetch
  useEffect(() => {
    if (!currentUserId) return;

    const fetchInitialSidebarData = async () => {
      const { data: userMemberships } = await supabase
        .from('room_members')
        .select('room_id')
        .eq('user_id', currentUserId);

      if (userMemberships && userMemberships.length > 0) {
        const roomIds = userMemberships.map((m) => m.room_id);
        const { data: userRooms } = await supabase
          .from('chat_rooms')
          .select('id, name, is_group')
          .in('id', roomIds);

        if (userRooms) {
          setRooms(
            userRooms.map((r: any) => ({
              id: r.id,
              name: r.name || 'Private Message',
              is_group: r.is_group,
            }))
          );
        }
      }

      const { data: profiles } = await supabase
        .from('user_directory')
        .select('id, username, email')
        .neq('id', currentUserId);

      if (profiles) setUsersList(profiles);
    };

    fetchInitialSidebarData();
  }, [currentUserId]);

  // 2. Load Messages & Realtime Subscription
  useEffect(() => {
    if (!currentUserId || !activeRoom) return;

    const loadChatHistory = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', activeRoom.id)
        .order('created_at', { ascending: true });

      if (data && !error) {
        setMessages(
          data.map((row: any) => ({
            id: row.id.toString(),
            sender: row.sender_name || 'User',
            text: row.message_text || '',
            timestamp: new Date(row.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }))
        );
      }
    };

    loadChatHistory();

    const channel = supabase
      .channel(`room-messages:${activeRoom.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${activeRoom.id}`,
        },
        (payload) => {
          const newRow = payload.new;
          const incomingMsg: Message = {
            id: newRow.id.toString(),
            sender: newRow.sender_name || 'User',
            text: newRow.message_text || '',
            timestamp: new Date(newRow.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };

          setMessages((prev) =>
            prev.some((m) => m.id === incomingMsg.id) ? prev : [...prev, incomingMsg]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, activeRoom?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectRoom = (room: ChatRoom) => {
    setActiveRoom(room);
    setMobileView('chat');
  };

  // 3. Create Group
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !currentUserId || !isLeaderOrPastor) return;

    const { data: newRoom, error: roomErr } = await supabase
      .from('chat_rooms')
      .insert([{ name: newGroupName, is_group: true }])
      .select()
      .single();

    if (roomErr || !newRoom) return;

    await supabase.from('room_members').insert([
      { room_id: newRoom.id, user_id: currentUserId },
    ]);

    const addedRoom: ChatRoom = { id: newRoom.id, name: newRoom.name, is_group: true };
    setRooms((prev) => [...prev, addedRoom]);
    selectRoom(addedRoom);
    setNewGroupName('');
  };

  // 4. Direct Message
  const handleStartDM = async (targetUser: UserProfile) => {
    if (!currentUserId) return;

    const { data: myMemberships } = await supabase
      .from('room_members')
      .select('room_id')
      .eq('user_id', currentUserId);

    let targetRoomId = null;

    if (myMemberships && myMemberships.length > 0) {
      const myRoomIds = myMemberships.map((m) => m.room_id);

      const { data: sharedDM } = await supabase
        .from('room_members')
        .select('room_id, chat_rooms!inner(id, is_group)')
        .eq('user_id', targetUser.id)
        .eq('chat_rooms.is_group', false)
        .in('room_id', myRoomIds)
        .maybeSingle();

      if (sharedDM) {
        targetRoomId = sharedDM.room_id;
      }
    }

    const dmName = `DM: ${targetUser.username || targetUser.email}`;

    if (!targetRoomId) {
      const { data: newRoom } = await supabase
        .from('chat_rooms')
        .insert([{ name: dmName, is_group: false }])
        .select()
        .single();

      if (newRoom) {
        targetRoomId = newRoom.id;
        await supabase.from('room_members').insert([
          { room_id: targetRoomId, user_id: currentUserId },
          { room_id: targetRoomId, user_id: targetUser.id },
        ]);
      }
    }

    if (targetRoomId) {
      const dmTarget = { id: targetRoomId, name: dmName, is_group: false };
      setRooms((prev) =>
        prev.some((r) => r.id === targetRoomId) ? prev : [...prev, dmTarget]
      );
      selectRoom(dmTarget);
    }
  };

  // 5. Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUserId || !activeRoom) return;

    const currentText = inputText;
    setInputText('');

    await supabase.from('chat_messages').insert([
      {
        user_id: currentUserId,
        sender_name: myUsername,
        message_text: currentText,
        room_id: activeRoom.id,
      },
    ]);
  };

  return (
    /* h-[100dvh] locks screen height; overflow-hidden prevents page scrolling */
    <div className="flex flex-col h-[100dvh] w-full bg-slate-900 overflow-hidden font-sans">
      
      {/* HEADER */}
      <div className="p-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-lg font-bold tracking-wide transition"
        >
          ← BACK TO HOMEPAGE
        </button>
      </div>

      {/* MIDDLE CONTAINER (Fills space between Header and Bottom Navigation) */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        
        {/* STAFF TAB */}
        {activeTab === 'staff' && isLeaderOrPastor && (
          <div className="flex-1 p-4 md:p-6 text-slate-200 overflow-y-auto">
            <h2 className="text-lg font-bold mb-2">Staff Portal</h2>
            <p className="text-xs text-slate-400">Exclusive tools and directory for leadership.</p>
          </div>
        )}

        {/* MANAGE TAB */}
        {activeTab === 'manage' && isLeaderOrPastor && (
          <div className="flex-1 p-4 md:p-6 text-slate-200 overflow-y-auto">
            <h2 className="text-lg font-bold mb-2">Management Dashboard</h2>
            <p className="text-xs text-slate-400">Administrative controls and channel setups.</p>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="flex-1 p-4 md:p-6 text-slate-200 space-y-4 overflow-y-auto">
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
                  Access system-wide broadcasts, audit logs, and member oversight tools.
                </p>
              </div>
            )}
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex w-full overflow-hidden min-h-0">
            
            {/* LEFT SIDEBAR */}
            <div 
              className={`w-full md:w-80 border-r border-slate-800 bg-slate-950 flex flex-col p-3 space-y-3 shrink-0 min-h-0 ${
                mobileView === 'list' ? 'flex' : 'hidden md:flex'
              }`}
            >
              {isLeaderOrPastor && (
                <div className="shrink-0">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Create Group</h4>
                  <form onSubmit={handleCreateGroup} className="flex gap-1">
                    <input
                      type="text"
                      placeholder="Group Name..."
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white w-full focus:outline-none"
                    />
                    <button type="submit" className="bg-blue-600 px-3 py-1.5 rounded text-xs text-white font-bold">+</button>
                  </form>
                </div>
              )}

              {/* Internal Scrolling for Sidebar List */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Your Chat Channels</h4>
                  <div className="space-y-1">
                    {rooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => selectRoom(room)}
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

            {/* CHAT FEED AREA */}
            <div 
              className={`flex-1 flex flex-col bg-slate-900 overflow-hidden min-h-0 ${
                mobileView === 'chat' ? 'flex' : 'hidden md:flex'
              }`}
            >
              {activeRoom ? (
                <>
                  <div className="p-2.5 bg-slate-950 border-b border-slate-800 flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setMobileView('list')}
                      className="md:hidden bg-slate-900 text-slate-300 text-xs px-2.5 py-1 rounded border border-slate-800"
                    >
                      ← Back
                    </button>
                    <h3 className="text-xs font-bold text-slate-100 flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></span>
                      {activeRoom.name}
                    </h3>
                  </div>

                  {/* Internal Scroll for Messages */}
                  <div className="flex-1 p-3 md:p-4 overflow-y-auto space-y-3 bg-slate-950/40 min-h-0">
                    {messages.length === 0 ? (
                      <div className="text-center text-xs text-slate-500 pt-12">No communication history here. Say something!</div>
                    ) : (
                      messages.map((msg) => {
                        const isMe = msg.sender === myUsername;
                        return (
                          <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <span className="text-[10px] text-slate-400 mb-0.5 px-1">{msg.sender}</span>
                            <div className={`p-2.5 rounded-xl max-w-[85%] md:max-w-sm text-xs md:text-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-100 rounded-tl-none'}`}>
                              {msg.text}
                            </div>
                            <span className="text-[10px] text-slate-500 mt-0.5 px-1">{msg.timestamp}</span>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* INPUT FORM (Fixed at bottom above nav) */}
                  <form onSubmit={handleSendMessage} className="p-2.5 border-t border-slate-800 flex gap-2 bg-slate-950 shrink-0">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs md:text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                    <button type="submit" className="bg-blue-600 px-4 py-2 rounded-lg text-xs md:text-sm text-white font-bold hover:bg-blue-500 shrink-0">Send</button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-slate-500 text-center p-8">
                  Select a conversation thread from the list to start messaging.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FIXED BOTTOM NAVIGATION BAR */}
      <nav className="h-14 bg-slate-950 border-t border-slate-800 flex items-center justify-around px-2 text-[11px] font-medium text-slate-400 shrink-0">
        {isLeaderOrPastor && (
          <button
            onClick={() => { setActiveTab('staff'); setMobileView('list'); }}
            className={`flex flex-col items-center gap-1 ${activeTab === 'staff' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'}`}
          >
            <span>👥</span>
            <span>STAFF</span>
          </button>
        )}

        <button
          onClick={() => { setActiveTab('chat'); setMobileView('list'); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'chat' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'}`}
        >
          <span>💬</span>
          <span>CHAT</span>
        </button>

        {isLeaderOrPastor && (
          <button
            onClick={() => { setActiveTab('manage'); setMobileView('list'); }}
            className={`flex flex-col items-center gap-1 ${activeTab === 'manage' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'}`}
          >
            <span>📺</span>
            <span>MANAGE</span>
          </button>
        )}

        <button
          onClick={() => { setActiveTab('settings'); setMobileView('list'); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'}`}
        >
          <span>⚙️</span>
          <span>SETTINGS</span>
        </button>
      </nav>
    </div>
  );
}
