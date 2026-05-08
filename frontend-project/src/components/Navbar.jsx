import { Link, useNavigate, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/cars',             label: 'Cars',            icon: '🚘', desc: 'Manage vehicles'   },
  { to: '/packages',         label: 'Packages',        icon: '📦', desc: 'Service tiers'     },
  { to: '/service-packages', label: 'Service Records', icon: '🗂️', desc: 'Track services'    },
  { to: '/payments',         label: 'Payments',        icon: '💳', desc: 'Record payments'   },
  { to: '/reports',          label: 'Reports',         icon: '📊', desc: 'Bills & analytics' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-[260px] z-50 flex flex-col select-none">

      {/* Glass panel */}
      <div className="absolute inset-0 bg-[#060a18]/85 backdrop-blur-3xl" />
      {/* Right border with glow */}
      <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/25 to-transparent" />
      {/* Inner right soft glow */}
      <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-blue-500/[0.04] to-transparent" />

      <div className="relative flex flex-col h-full">

        {/* ── BRAND ── */}
        <div className="px-5 pt-7 pb-6">
          <div className="flex items-center gap-3.5">
            {/* Logo */}
            <div className="relative w-12 h-12 shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-300 shadow-2xl shadow-blue-500/50" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-transparent" />
              <div className="absolute inset-0 rounded-2xl border border-white/20" />
              <span className="absolute inset-0 flex items-center justify-center text-2xl drop-shadow-lg">🚗</span>
            </div>
            {/* Text */}
            <div>
              <p className="text-white font-black text-xl tracking-tight leading-none">SmartPark</p>
              <p className="text-[11px] font-bold tracking-[0.22em] uppercase mt-1 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                CWSMS
              </p>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-slate-600 text-[11px] mt-3 leading-relaxed">
            Car Washing Sales Management
          </p>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-4" />

        {/* ── SECTION LABEL ── */}
        <p className="px-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2">
          Main Menu
        </p>

        {/* ── NAV LINKS ── */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navLinks.map(({ to, label, icon, desc }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to}
                className={`relative flex items-center gap-3.5 px-3 py-3.5 rounded-2xl transition-all duration-200 group overflow-hidden`}
              >
                {/* Hover bg */}
                {!active && (
                  <span className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/[0.05] transition-all duration-200" />
                )}

                {/* Active bg — gradient glass */}
                {active && (
                  <>
                    <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/25 via-blue-500/15 to-cyan-500/10" />
                    <span className="absolute inset-0 rounded-2xl border border-blue-400/20" />
                    <span className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent" />
                    {/* Left accent */}
                    <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-gradient-to-b from-blue-400 to-cyan-400 shadow-lg shadow-blue-400/60" />
                  </>
                )}

                {/* Icon */}
                <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 transition-all duration-200
                  ${active
                    ? 'bg-gradient-to-br from-blue-500/40 to-cyan-500/25 border border-blue-400/30 shadow-lg shadow-blue-500/25'
                    : 'bg-white/[0.05] border border-white/[0.07] group-hover:bg-white/[0.09] group-hover:border-white/[0.13] group-hover:scale-105'
                  }`}>
                  <span className="drop-shadow-sm">{icon}</span>
                </div>

                {/* Text */}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className={`text-[13px] font-semibold leading-tight transition-colors duration-200
                    ${active ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {label}
                  </span>
                  <span className={`text-[11px] leading-tight mt-0.5 transition-colors duration-200 truncate
                    ${active ? 'text-blue-300/70' : 'text-slate-600 group-hover:text-slate-500'}`}>
                    {desc}
                  </span>
                </div>

                {/* Active indicator */}
                {active && (
                  <div className="shrink-0 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/80" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── BOTTOM SECTION ── */}
        <div className="px-3 pb-5 pt-3 space-y-3">
          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

          {/* User card */}
          <div className="relative overflow-hidden rounded-2xl p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-2xl" />
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div className="relative flex items-center gap-3">
              {/* Avatar */}
              <div className="relative w-10 h-10 shrink-0">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/40" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/25 to-transparent" />
                <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-white">
                  {username?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Signed in as</span>
                <span className="text-white text-sm font-bold mt-0.5 truncate">{username}</span>
              </div>
              {/* Online dot */}
              <div className="ml-auto shrink-0">
                <span className="flex w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/60">
                  <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-40" />
                </span>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button onClick={handleLogout}
            className="group relative w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl overflow-hidden transition-all duration-200">
            <span className="absolute inset-0 rounded-2xl bg-red-500/[0.08] border border-red-500/[0.18] group-hover:bg-red-500/[0.18] group-hover:border-red-500/40 transition-all duration-200" />
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent" />
            <svg className="relative w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            <span className="relative text-sm font-bold text-red-400 group-hover:text-red-300 transition-colors">Sign Out</span>
          </button>
        </div>

      </div>
    </aside>
  );
}
