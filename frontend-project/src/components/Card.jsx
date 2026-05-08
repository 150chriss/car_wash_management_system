export default function Card({ title, badge, children, className = '', glow = false, accent = 'blue' }) {
  const accentMap = {
    blue:    'border-blue-500/25 shadow-blue-500/10',
    emerald: 'border-emerald-500/25 shadow-emerald-500/10',
    violet:  'border-violet-500/25 shadow-violet-500/10',
    rose:    'border-rose-500/25 shadow-rose-500/10',
  };

  return (
    <div className={`
      relative rounded-2xl overflow-hidden
      bg-white/[0.03] backdrop-blur-xl
      border ${glow ? accentMap[accent] : 'border-white/[0.07]'}
      shadow-[0_8px_40px_rgba(0,0,0,0.45)]
      ${glow ? 'shadow-[0_8px_40px_rgba(0,0,0,0.45)]' : ''}
      transition-all duration-300
      ${className}
    `}>
      {/* Top shimmer */}
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent" />

      {title && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05] bg-white/[0.02]">
          <h2 className="text-white font-bold text-sm tracking-wide">{title}</h2>
          {badge && (
            <span className="bg-blue-500/15 text-blue-400 border border-blue-500/25 text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase">
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
