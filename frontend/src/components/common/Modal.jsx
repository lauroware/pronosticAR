import { useEffect } from 'react';
import Button from './Button';

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
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className={`bg-white rounded-xl shadow-xl w-full ${sizes[size]} mx-4 overflow-hidden`}>
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{titulo}</h2>
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;