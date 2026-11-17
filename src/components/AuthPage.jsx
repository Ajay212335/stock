import React, { useState } from 'react';
import { 
  Boxes, 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Warehouse, 
  AlertCircle
} from 'lucide-react';
import { stockApi } from '../services/api';

export default function AuthPage({ onAuthSuccess, onBackToHome }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Warehouse Manager',
    facility: 'Apex Central DC-01'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let res;
      if (isLogin) {
        res = await stockApi.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        res = await stockApi.signup(formData);
      }

      if (res && res.user) {
        localStorage.setItem('logix_user', JSON.stringify(res.user));
        localStorage.setItem('logix_token', res.token);
        onAuthSuccess(res.user);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/70 via-white to-orange-100/40 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Top Bar with Back Button */}
      <div className="max-w-md w-full mx-auto flex items-center justify-start mb-4">
        <button
          onClick={onBackToHome}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-orange-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/80"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl shadow-xl shadow-orange-500/10 border border-slate-200/90 overflow-hidden">
        {/* Card Header */}
        <div className="p-8 pb-6 text-center border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/25">
            <Boxes className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Logistics Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isLogin 
              ? 'Sign in to access real-time stock tracking and warehouse slotting' 
              : 'Register to manage warehouse bins and carrier freight operations'}
          </p>

          {/* Toggle Pills */}
          <div className="mt-6 flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                isLogin ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                !isLogin ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g., Ajay Vishwa"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@logistics.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">Password</label>
              {isLogin && (
                <span className="text-[11px] font-semibold text-orange-600 hover:text-orange-500 cursor-pointer">
                  Forgot?
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                >
                  <option value="Warehouse Manager">Warehouse Manager</option>
                  <option value="Inventory Controller">Inventory Controller</option>
                  <option value="Fleet Dispatcher">Fleet Dispatcher</option>
                  <option value="Forklift Lead">Forklift Lead</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Facility</label>
                <input
                  type="text"
                  value={formData.facility}
                  onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-600/30 transition-all active:scale-[0.99]"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In to Console' : 'Complete Registration'}
          </button>
        </form>
      </div>

      {/* Footer text */}
      <div className="text-center text-xs text-slate-400 mt-6">
        Protected with enterprise 256-bit encryption • MongoDB Persistent Cluster
      </div>
    </div>
  );
}
