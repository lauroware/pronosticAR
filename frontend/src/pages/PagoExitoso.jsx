import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';

const PagoExitoso = () => {
  const [searchParams]  = useSearchParams();
  const grupoId         = searchParams.get('grupo');
  const [grupo, setGrupo] = useState(null);
  const [intentos, setIntentos] = useState(0);

  // Consulta el estado del grupo — el webhook de MP puede tardar unos segundos
  useEffect(() => {
    if (!grupoId) return;

    const verificar = async () => {
      try {
        const { data } = await api.get(`/pagos/estado/${grupoId}`);
        if (data.data.premium) {
          setGrupo(data.data);
        } else if (intentos < 6) {
          // Reintenta hasta 6 veces cada 2 segundos
          setTimeout(() => setIntentos((n) => n + 1), 2000);
        }
      } catch {
        // silencio
      }
    };

    verificar();
  }, [grupoId, intentos]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="max-w-md w-full text-center">

        {grupo ? (
          <>
            {/* Éxito confirmado */}
            <div className="text-7xl mb-4 animate-bounce">🎉</div>
            <h1 className="text-3xl font-bold text-white mb-2">¡Pago exitoso!</h1>
            <p className="text-gray-400 mb-2">
              El grupo <span className="text-white font-semibold">{grupo.nombre}</span> ya es Premium.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Ahora podés tener hasta {grupo.limitePlan} miembros.
            </p>
            <Link
              to={`/grupos/${grupoId}`}
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition-colors"
            >
              Ir al grupo →
            </Link>
          </>
        ) : (
          <>
            {/* Esperando confirmación del webhook */}
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-2">Confirmando pago...</h1>
            <p className="text-gray-400 text-sm mb-8">
              Esto puede tardar unos segundos. No cerrés esta página.
            </p>
            {intentos >= 6 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                <p className="text-yellow-400 text-sm">
                  La confirmación está tardando más de lo normal. Si el pago fue exitoso, el grupo se activará en los próximos minutos.
                </p>
              </div>
            )}
            <Link to="/grupos" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Ir a mis grupos
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PagoExitoso;