export default function StatCard({ label, value, suffix = '', icon, gradient, trend }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl p-5
      hover:border-white/[0.13] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 group cursor-default`}>

      {/* Ambient glow */}
      <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-25 group-hover:opacity-40 transition-opacity duration-300 bg-gradient-to-br ${gradient}`} />
      {/* Top shimmer */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />
      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] truncate">{label}</p>
          <p className={`text-3xl font-black mt-2 bg-gradient-to-r ${gradient} bg-clip-text text-transparent leading-none`}>
            {value}
          </p>
          {suffix && <p className="text-slate-500 text-xs font-semibold mt-1">{suffix}</p>}
          {trend && (
            <p className={`text-xs font-bold mt-1.5 ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% today
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl shadow-xl shrink-0 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
