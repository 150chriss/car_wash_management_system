export default function GlassBg() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Deep base */}
      <div className="absolute inset-0 bg-[#03050f]" />
      {/* Large ambient orbs */}
      <div className="absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full bg-blue-600/[0.12] blur-[140px]" />
      <div className="absolute top-1/2 -right-60 w-[600px] h-[600px] rounded-full bg-violet-600/[0.10] blur-[140px]" />
      <div className="absolute -bottom-60 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/[0.07] blur-[140px]" />
      <div className="absolute top-1/4 left-1/2 w-[400px] h-[400px] rounded-full bg-indigo-600/[0.08] blur-[100px]" />
      {/* Subtle dot grid */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent to-black/40" />
    </div>
  );
}
