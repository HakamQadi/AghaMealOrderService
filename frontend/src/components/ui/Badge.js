const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-slate-600 text-slate-200",
    success: "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30",
    warning: "bg-amber-600/20 text-amber-400 border border-amber-500/30",
    danger: "bg-red-600/20 text-red-400 border border-red-500/30",
    info: "bg-cyan-600/20 text-cyan-400 border border-cyan-500/30",
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge
