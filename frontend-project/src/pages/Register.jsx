import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/userApi';
import GlassBg from '../components/GlassBg';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ username: '', password: '', confirm: '' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (!form.username || !form.password || !form.confirm) { setError('All fields are required.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await register({ username: form.username, password: form.password });
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-white py-8 overflow-hidden">
      <GlassBg />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/[0.07] blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-[420px]">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-600/20 to-blue-500/20 blur-xl" />

        <div className="relative rounded-3xl border border-white/[0.1] bg-[#060a18]/90 backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.7)] overflow-hidden">
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

          {/* Header */}
          <div className="px-8 pt-10 pb-7 text-center">
            <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-2xl shadow-violet-500/50" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/25 to-transparent" />
              <span className="relative text-3xl">🚗</span>
            </div>
            <h1 className="text-2xl font-black text-white">Create Account</h1>
            <p className="text-slate-400 text-sm mt-1">Join SmartPark CWSMS</p>
          </div>

          <div className="mx-8 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

          <div className="px-8 py-7">
            {error && (
              <div className="flex items-center gap-3 bg-red-500/[0.08] border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm font-medium">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-3 bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 rounded-xl px-4 py-3 mb-4 text-sm font-medium">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: 'username', label: 'Username',         type: 'text',                       placeholder: 'Choose a username' },
                { name: 'password', label: 'Password',         type: showPw ? 'text' : 'password', placeholder: 'Min. 6 characters' },
                { name: 'confirm',  label: 'Confirm Password', type: showPw ? 'text' : 'password', placeholder: 'Repeat your password' },
              ].map((f) => (
                <div key={f.name} className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">{f.label}</label>
                  <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange}
                    placeholder={f.placeholder}
                    className="w-full bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.16] focus:border-violet-500/70 focus:bg-violet-500/[0.05] text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all duration-200" />
                </div>
              ))}

              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input type="checkbox" checked={showPw} onChange={() => setShowPw(!showPw)}
                  className="w-4 h-4 rounded accent-violet-500 cursor-pointer" />
                <span className="text-slate-500 text-xs group-hover:text-slate-400 transition-colors select-none">Show passwords</span>
              </label>

              <button type="submit" disabled={loading}
                className="relative w-full mt-1 overflow-hidden rounded-xl py-3.5 text-sm font-black text-white transition-all duration-300 disabled:opacity-50 group">
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 group-hover:from-violet-500 group-hover:to-blue-400 transition-all duration-300" />
                <span className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.15] to-transparent" />
                <span className="absolute inset-0 rounded-xl shadow-xl shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading
                    ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Creating...</>
                    : <>Create Account <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">→</span></>
                  }
                </span>
              </button>
            </form>

            <p className="text-center text-slate-500 text-sm mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
