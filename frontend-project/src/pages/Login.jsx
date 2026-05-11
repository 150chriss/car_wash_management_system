import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/userApi';
import GlassBg from '../components/GlassBg';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ username: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (!form.username || !form.password) { setError('Both fields are required.'); return; }
    setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      navigate('/cars');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-white overflow-hidden">
      <GlassBg />

      {/* Extra login-page orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/[0.07] blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-[420px]">
        {/* Card glow */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600/20 to-cyan-500/20 blur-xl" />

        {/* Card */}
        <div className="relative rounded-3xl border border-white/[0.1] bg-[#060a18]/90 backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.7)] overflow-hidden">
          {/* Top shimmer */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

          {/* Header */}
          <div className="px-8 pt-10 pb-8 text-center">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-5">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-2xl shadow-blue-500/60" />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/30 to-transparent" />
              <div className="absolute inset-0 rounded-3xl border border-white/20" />
              <span className="relative text-4xl drop-shadow-xl">🚗</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">SmartPark</h1>
            <p className="text-slate-400 text-sm mt-1.5 font-medium">Car Washing Sales Management System</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="w-8 h-px bg-gradient-to-r from-transparent to-blue-500/50" />
              <span className="text-blue-400/60 text-[10px] font-bold uppercase tracking-widest">Bugesera, Rwanda</span>
              <span className="w-8 h-px bg-gradient-to-l from-transparent to-blue-500/50" />
            </div>
          </div>

          {/* Divider */}
          <div className="mx-8 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

          {/* Form */}
          <div className="px-8 py-8">
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.18em] mb-6">Sign in to your account</p>

            {error && (
              <div className="flex items-center gap-3 bg-red-500/[0.08] border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </span>
                  <input type="text" name="username" value={form.username} onChange={handleChange}
                    placeholder="Enter your username" autoComplete="username"
                    className="w-full bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.16] focus:border-blue-500/70 focus:bg-blue-500/[0.06] text-white placeholder-slate-600 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all duration-200" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </span>
                  <input type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                    placeholder="Enter your password" autoComplete="current-password"
                    className="w-full bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.16] focus:border-blue-500/70 focus:bg-blue-500/[0.06] text-white placeholder-slate-600 rounded-xl pl-11 pr-12 py-3 text-sm font-medium outline-none transition-all duration-200" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPw
                      ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                      : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    }
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="relative w-full mt-2 overflow-hidden rounded-xl py-3.5 text-sm font-black text-white transition-all duration-300 disabled:opacity-50 group">
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:from-blue-500 group-hover:to-cyan-400 transition-all duration-300" />
                <span className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.15] to-transparent" />
                <span className="absolute inset-0 rounded-xl shadow-xl shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading
                    ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Signing in...</>
                    : <>Sign In <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">→</span></>
                  }
                </span>
              </button>
            </form>

            <p className="text-center text-slate-500 text-sm mt-6">
              No account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                Create one here
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-700 text-[11px] mt-5 tracking-wide">
          © 2025 SmartPark · Rubavu District, Rwanda
        </p>
      </div>
    </div>
  );
}
