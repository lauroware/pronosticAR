import Button from '../common/Button';
import Modal from '../common/Modal';

const InvitacionModal = ({ grupo, abierto, onCerrar }) => {
  const link = `${window.location.origin}/unirse?codigo=${grupo?.codigoInvitacion}`;

  const copiar = (texto, mensaje) => {
    navigator.clipboard.writeText(texto);
    alert(mensaje || '¡Copiado al portapapeles!');
  };

  return (
    <Modal abierto={abierto} onCerrar={onCerrar} titulo="Invitar al grupo" size="sm">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1 font-medium">Código de invitación</p>
          <div className="flex gap-2">
            <code className="flex-1 bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono text-center tracking-wider">
              {grupo?.codigoInvitacion}
            </code>
            <Button size="sm" onClick={() => copiar(grupo?.codigoInvitacion, 'Código copiado')}>
              Copiar
            </Button>
          </div>
        </div>
        
        <div>
          <p className="text-xs text-gray-500 mb-1 font-medium">Enlace directo</p>
          <div className="flex gap-2">
            <code className="flex-1 bg-gray-100 px-3 py-2 rounded-lg text-xs truncate">
              {link}
            </code>
            <Button size="sm" onClick={() => copiar(link, 'Enlace copiado')}>
              Copiar
            </Button>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-3 mt-2">
          <p className="text-xs text-blue-700 text-center">
            💡 Compartí este código con tus amigos para que se unan al grupo
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default InvitacionModal;