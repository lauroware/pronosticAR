import { useEffect } from 'react';

const Modal = ({ abierto, onCerrar, titulo, children, size = 'md' }) => {
  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [abierto]);

  if (!abierto) return null;

  const sizes = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCerrar}
      />

      {/*
        Mobile: sube desde abajo (bottom sheet)
        Desktop: centrado con max-width
      */}
      <div
        className={`
          relative w-full ${sizes[size]}
          bg-gray-900 border border-gray-700
          shadow-2xl overflow-hidden
          rounded-t-2xl sm:rounded-2xl
          mx-0 sm:mx-4
          max-h-[92vh] flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 shrink-0">
          <h2 className="text-base font-semibold text-white">{titulo}</h2>
          <button
            onClick={onCerrar}
            className="text-gray-500 hover:text-white text-2xl leading-none transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800"
          >
            ×
          </button>
        </div>

        {/* Contenido scrolleable si es largo */}
        <div className="p-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;