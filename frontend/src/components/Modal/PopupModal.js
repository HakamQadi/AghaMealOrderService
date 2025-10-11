function Modal({ children, onClose, size = "md" }) {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-slate-800 rounded-2xl shadow-2xl ${sizes[size]} w-full max-h-[90vh] overflow-y-auto relative border border-slate-600/50`}
      >
        {children}
        <button
          className="absolute top-4 right-4 w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200 hover:scale-110 z-10"
          onClick={onClose}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Modal
