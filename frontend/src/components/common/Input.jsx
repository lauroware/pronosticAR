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
        className={[
          'px-3 py-2 rounded-lg border',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-colors',
          error
            ? 'border-red-500 bg-red-50 text-gray-900'
            : dark
              ? 'border-gray-600 bg-gray-700/60 text-white placeholder-gray-400'
              : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400',
        ].join(' ')}
        {...props}
      />
      {error && <p className={`text-xs ${dark ? 'text-red-400' : 'text-red-500'}`}>{error}</p>}
    </div>
  );
};

export default Input;