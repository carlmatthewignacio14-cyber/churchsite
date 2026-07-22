'use client';

import React, { useState } from 'react';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  // 'login' opens LoginForm, 'signup' opens SignUpForm
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  if (!isOpen) return null; // Keep hidden unless triggered from header buttons

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      {/* Absolute background click zone to dismiss modal safely */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Form Frame */}
      <div className="relative bg-slate-950 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden z-10 p-6">
        
        {/* Upper Right Close Header Action */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white font-semibold text-lg transition duration-150"
        >
          ✕
        </button>

        {/* Dynamic Inner Form Insertion */}
        <div className="mt-4">
          {authMode === 'login' ? (
            <div>
              <LoginForm />
              <p className="text-center text-sm text-slate-400 mt-6">
                Don't have an account?{' '}
                <button 
                  onClick={() => setAuthMode('signup')} 
                  className="text-blue-400 hover:underline font-medium"
                >
                  Create one here
                </button>
              </p>
            </div>
          ) : (
            <div>
              <SignUpForm />
              <p className="text-center text-sm text-slate-400 mt-6">
                Already registered?{' '}
                <button 
                  onClick={() => setAuthMode('login')} 
                  className="text-blue-400 hover:underline font-medium"
                >
                  Sign in here
                </button>
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
