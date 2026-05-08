export default function PrimaryBtn({ children, loading, gradient = 'from-blue-600 to-cyan-500', hoverGradient = 'hover:from-blue-500 hover:to-cyan-400', shadow = 'shadow-blue-500/25', ...props }) {
  return (
    <button {...props}
      className={`relative w-full overflow-hidden rounded-xl py-3 text-sm font-bold text-white transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed group mt-1 ${props.className || ''}`}>
      <span className={`absolute inset-0 rounded-xl bg-gradient-to-r ${gradient} ${hoverGradient} transition-all duration-300`} />
      <span className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.12] to-transparent" />
      <span className={`absolute inset-0 rounded-xl shadow-lg ${shadow} group-hover:shadow-xl transition-shadow duration-300`} />
      <span className="relative flex items-center justify-center gap-2">
        {loading
          ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Saving...</>
          : children
        }
      </span>
    </button>
  );
}
