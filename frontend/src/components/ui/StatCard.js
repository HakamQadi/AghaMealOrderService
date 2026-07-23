const StatCard = ({ title, value, description, icon: Icon, color = "emerald" }) => {
  const colorVariants = {
    emerald: {
      gradient: "from-emerald-500 to-emerald-600",
      border: "border-emerald-400",
      text: "text-emerald-400",
    },
    cyan: {
      gradient: "from-cyan-500 to-cyan-600",
      border: "border-cyan-400",
      text: "text-cyan-400",
    },
    amber: {
      gradient: "from-amber-500 to-amber-600",
      border: "border-amber-400",
      text: "text-amber-400",
    },
    purple: {
      gradient: "from-purple-500 to-purple-600",
      border: "border-purple-400",
      text: "text-purple-400",
    },
  }

  const colors = colorVariants[color]

  return (
    <div className="group">
      <div
        className={`bg-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8 border border-slate-600 hover:${colors.border} transform hover:-translate-y-1`}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div
            className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center shadow-lg`}
          >
            {Icon && <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />}
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-slate-200 mb-2">{title}</h3>
            <div className={`text-4xl md:text-5xl font-bold ${colors.text} mb-1`}>{value}</div>
            {description && <p className="text-slate-400 text-sm md:text-base">{description}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatCard
