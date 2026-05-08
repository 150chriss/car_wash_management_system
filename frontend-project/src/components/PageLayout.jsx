import Navbar from './Navbar';
import GlassBg from './GlassBg';

export default function PageLayout({ icon, title, subtitle, children }) {
  return (
    <div className="min-h-screen text-white flex">
      <GlassBg />
      <Navbar />

      {/* Main — offset by sidebar */}
      <main className="flex-1 ml-[260px] min-h-screen">

        {/* Top header bar */}
        <div className="sticky top-0 z-40 px-8 py-4 flex items-center gap-4 bg-[#03050f]/60 backdrop-blur-xl border-b border-white/[0.05]">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30 shrink-0">
            {icon}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-black text-white tracking-tight leading-none">{title}</h1>
            {subtitle && <p className="text-slate-500 text-xs mt-1 truncate">{subtitle}</p>}
          </div>
          {/* Live clock */}
          <Clock />
        </div>

        {/* Page content */}
        <div className="px-8 py-7">
          {children}
        </div>
      </main>
    </div>
  );
}

/* Small live clock shown in the top bar */
function Clock() {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="hidden sm:flex flex-col items-end shrink-0">
      <span className="text-white text-sm font-bold tabular-nums">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
      <span className="text-slate-500 text-[10px] mt-0.5">
        {time.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
      </span>
    </div>
  );
}

import React from 'react';
