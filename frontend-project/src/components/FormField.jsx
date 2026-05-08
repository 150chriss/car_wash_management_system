export function FormField({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">
        {label}
      </label>
      {children}
    </div>
  );
}

export const inputCls = [
  'w-full',
  'bg-white/[0.04] hover:bg-white/[0.06]',
  'border border-white/[0.08] hover:border-white/[0.16]',
  'focus:border-blue-500/70 focus:bg-blue-500/[0.06]',
  'text-white placeholder-slate-600',
  'rounded-xl px-4 py-2.5 text-sm font-medium',
  'outline-none transition-all duration-200',
  'disabled:opacity-30 disabled:cursor-not-allowed',
].join(' ');

export const selectCls = [
  'w-full',
  'bg-[#0a0f1e] hover:bg-[#0d1428]',
  'border border-white/[0.08] hover:border-white/[0.16]',
  'focus:border-blue-500/70',
  'text-white',
  'rounded-xl px-4 py-2.5 text-sm font-medium',
  'outline-none transition-all duration-200',
].join(' ');
