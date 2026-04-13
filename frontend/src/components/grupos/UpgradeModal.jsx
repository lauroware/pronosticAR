import { useState } from 'react';
import api from '../../services/api';
import useNotificaciones from '../../hooks/useNotificaciones';

/**
 * Modal que aparece cuando un grupo llega al límite de 5 miembros.
 * Solo el admin ve el botón de pago; los demás ven un aviso.
 *
 * Props:
 *   abierto       — boolean
 *   onCerrar      — fn
 *   grupoId       — string
 *   grupoNombre   — string
 *   esAdmin       — boolean (el usuario actual es admin del grupo)
 */
const UpgradeModal = ({ abierto, onCerrar, grupoId, grupoNombre, esAdmin }) => {
  const [loading, setLoading]   = useState(false);
  const { error: notifError }   = useNotificaciones();

  if (!abierto) return null;

  const handlePagar = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/pagos/crear-preferencia', { grupoId });
      // Redirige al checkout de MercadoPago
      window.location.href = data.checkoutUrl;
    } catch (err) {
      notifError(err.response?.data?.mensaje || 'Error al generar el pago');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCerrar}
      />

      {/* Card */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl z-10">

        {/* Ícono */}
        <div className="text-center mb-4">
          <div className="text-5xl mb-2">🏆</div>
          <h2 className="text-xl font-bold text-white">¡Grupo lleno!</h2>
          <p className="text-gray-400 text-sm mt-1">
            <span className="text-white font-medium">{grupoNombre}</span> 
          </p>
        </div>

        {/* Beneficios */}
        <div className="bg-gray-800/60 rounded-xl p-4 mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Con el upgrade desbloqueás:
          </p>
          <ul className="space-y-2">
            {[
              '👥 Hasta 50 miembros en este grupo',
              '🏅 Ranking interno completo',
              '🎨 Personalización del grupo',
              '📅 Válido hasta el final del Mundial 2026',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {esAdmin ? (
          <>
            {/* Precio */}
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-white">
                $5 <span className="text-lg text-gray-400 font-normal">USD</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">Pago único · Sin suscripción</p>
            </div>

            <button
              onClick={handlePagar}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Redirigiendo...
                </>
              ) : (
                <>
                  <img
                    src="https://http2.mlstatic.com/frontend-assets/mp-web-navigation/ui-navigation/5.21.22/mercadopago/logo__large@2x.png"
                    alt="MercadoPago"
                    className="h-5"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  Pagar con MercadoPago
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-500 mt-3">
              Pago seguro procesado por MercadoPago
            </p>
          </>
        ) : (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
            <p className="text-yellow-400 text-sm">
              📢 Este grupo está lleno. Avisale al administrador que puede desbloquearlo con un upgrade.
            </p>
          </div>
        )}

        <button
          onClick={onCerrar}
          className="w-full mt-3 text-gray-500 hover:text-gray-300 text-sm transition-colors py-2"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default UpgradeModal;