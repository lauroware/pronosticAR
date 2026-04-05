import { useEffect } from 'react';
import Button from './Button';

const Modal = ({ abierto, onCerrar, titulo, children, size = 'md' }) => {
  useEffect(() => {
    document.body.style.overflow = abierto ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [abierto]);

  if (!abierto) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4">
      {/* Overlay para cerrar al hacer click fuera */}
      <div className="absolute inset-0" onClick={onCerrar} />

      {/* Tarjeta — fondo blanco igual que antes, bottom sheet en mobile */}
      <div
        className={`
          relative z-10 w-full ${sizes[size]}
          bg-white rounded-t-2xl sm:rounded-xl
          shadow-2xl overflow-hidden
          max-h-[90vh] flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">{titulo}</h2>
          <button
            onClick={onCerrar}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="p-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;