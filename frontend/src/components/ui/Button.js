"use client"

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  icon: Icon,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"

  const variants = {
    primary:
      "bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 hover:text-cyan-300 shadow-lg hover:shadow-xl",
    secondary:
      "bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 text-slate-200 hover:text-white shadow-md hover:shadow-lg",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl border border-emerald-500/30",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl border border-red-500/30",
    ghost:
      "bg-transparent hover:bg-slate-700/50 text-slate-300 hover:text-white border border-transparent hover:border-slate-600",
  }

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  )
}

export default Button
