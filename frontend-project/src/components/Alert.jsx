export function ErrorAlert({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-start gap-3 bg-red-500/[0.07] border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm font-medium">
      <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
      </svg>
      <span>{msg}</span>
    </div>
  );
}

export function SuccessAlert({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-start gap-3 bg-emerald-500/[0.07] border border-emerald-500/20 text-emerald-400 rounded-xl px-4 py-3 mb-4 text-sm font-medium">
      <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
      </svg>
      <span>{msg}</span>
    </div>
  );
}
