const Card = ({ children, className = "", hover = false }) => {
  const hoverStyles = hover ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer" : ""

  return (
    <div
      className={`bg-slate-700 rounded-2xl shadow-lg border border-slate-600 transition-all duration-300 ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  )
}

const CardHeader = ({ children, className = "" }) => {
  return <div className={`p-6 border-b border-slate-600 ${className}`}>{children}</div>
}

const CardBody = ({ children, className = "" }) => {
  return <div className={`p-6 ${className}`}>{children}</div>
}

const CardTitle = ({ children, icon: Icon, className = "" }) => {
  return (
    <h3 className={`text-xl font-bold text-slate-100 flex items-center gap-3 ${className}`}>
      {Icon && (
        <div className="p-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">
          <Icon className="w-5 h-5 text-cyan-400" />
        </div>
      )}
      {children}
    </h3>
  )
}

Card.Header = CardHeader
Card.Body = CardBody
Card.Title = CardTitle

export default Card
