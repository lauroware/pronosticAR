const Input = ({ label, type = 'text', error, className = '', dark = false, ...props }) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          px-3 py-2 rounded-lg border
          bg-white text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-colors
          ${error ? 'border-red-500' : dark ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-500' : 'border-gray-300'}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default Input;