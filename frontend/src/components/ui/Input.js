"use client"

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  required = false,
  className = "",
  dir,
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4" />}
          {label}
          {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        dir={dir}
        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
        {...props}
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  )
}

export default Input
