"use client"

const Table = ({ children, className = "" }) => {
  return (
    <div className={`overflow-x-auto bg-slate-800 rounded-xl ${className}`}>
      <div className="min-w-[600px]">{children}</div>
    </div>
  )
}

const TableHeader = ({ children }) => {
  return <div className="bg-slate-700 rounded-t-xl p-4 border-b border-slate-600">{children}</div>
}

const TableBody = ({ children, maxHeight = "60vh" }) => {
  return (
    <div className={`max-h-[${maxHeight}] overflow-y-auto bg-slate-800 rounded-b-xl`}>
      <div className="space-y-2 p-4">{children}</div>
    </div>
  )
}

const TableRow = ({ children, onClick, className = "" }) => {
  const clickableStyles = onClick ? "cursor-pointer" : ""

  return (
    <div
      onClick={onClick}
      className={`p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200 hover:shadow-lg ${clickableStyles} ${className}`}
    >
      {children}
    </div>
  )
}

const EmptyState = ({ icon: Icon, title, description }) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-full flex items-center justify-center">
        {Icon && <Icon className="w-8 h-8 text-slate-400" />}
      </div>
      <p className="text-slate-400 text-lg">{title}</p>
      {description && <p className="text-slate-500 text-sm mt-2">{description}</p>}
    </div>
  )
}

Table.Header = TableHeader
Table.Body = TableBody
Table.Row = TableRow
Table.EmptyState = EmptyState

export default Table
