import { useEffect } from 'react';
import { createPortal } from 'react-dom';

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

  // createPortal renderiza el modal directamente en document.body
  // sin importar dónde esté en el árbol de componentes.
  // Esto evita que backdrop-filter, transform o z-index de ancestros
  // afecten el posicionamiento fixed del modal.
  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,0.5)',
        overflowY: 'auto',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}
    >
      <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div
          style={{ width: '100%', maxWidth: sizes[size].replace('max-w-', '').replace('md', '448px').replace('lg', '512px').replace('2xl', '672px').replace('4xl', '896px') }}
          className={`bg-white rounded-xl shadow-2xl w-full ${sizes[size]}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 py-3 border-b">
            <h2 className="text-lg font-semibold text-gray-900">{titulo}</h2>
            <button
              onClick={onCerrar}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center"
            >
              &times;
            </button>
          </div>
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;