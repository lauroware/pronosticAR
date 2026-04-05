// Convierte código FIFA de 3 letras → emoji de bandera
// Los emojis de bandera usan códigos ISO 3166-1 alpha-2 (2 letras)

const FIFA_A_ISO = {
  ARG: 'AR', BRA: 'BR', FRA: 'FR', ENG: 'GB', ESP: 'ES',
  GER: 'DE', POR: 'PT', NED: 'NL', BEL: 'BE', CRO: 'HR',
  URU: 'UY', COL: 'CO', MEX: 'MX', USA: 'US', CAN: 'CA',
  AUS: 'AU', JPN: 'JP', KOR: 'KR', MAR: 'MA', SEN: 'SN',
  GHA: 'GH', EGY: 'EG', TUN: 'TN', ALG: 'DZ', CIV: 'CI',
  RSA: 'ZA', NOR: 'NO', SWE: 'SE', SUI: 'CH', AUT: 'AT',
  CZE: 'CZ', POL: 'PL', TUR: 'TR', IRN: 'IR', KSA: 'SA',
  JOR: 'JO', QAT: 'QA', NZL: 'NZ', ECU: 'EC', PAR: 'PY',
  PAN: 'PA', HAI: 'HT', BOL: 'BO', PER: 'PE', CHL: 'CL',
  VEN: 'VE', CRC: 'CR', HND: 'HN', SLV: 'SV', GTM: 'GT',
  SCO: 'GB-SCO', WAL: 'GB-WLS', NIR: 'GB-NIR',
  BIH: 'BA', SRB: 'RS', SVK: 'SK', SVN: 'SI', HUN: 'HU',
  ROU: 'RO', UKR: 'UA', GEO: 'GE', ALB: 'AL', MKD: 'MK',
  CPV: 'CV', CUW: 'CW', UZB: 'UZ',
  // Escocia no tiene código ISO propio — usamos GB con nota
};

/**
 * Devuelve el emoji de bandera para un código FIFA de 3 letras.
 * Ej: getBandera('ARG') → '🇦🇷'
 *     getBandera('TBD') → '🏳️'
 */
export const getBandera = (codigoFifa) => {
  if (!codigoFifa || codigoFifa === 'TBD' || codigoFifa === '???') return '🏳️';

  const iso = FIFA_A_ISO[codigoFifa.toUpperCase()];
  if (!iso) return '🏳️';

  // Escocia / Gales / Irlanda del Norte: no tienen emoji propio en todos los sistemas
  // En la mayoría de dispositivos modernos sí funcionan, pero si no, caen al 🏴
  if (iso.includes('-')) {
    // Intenta con el código subdivisions (funciona en iOS/macOS, Android 11+)
    return isoABandera(iso.replace('-', ''));
  }

  return isoABandera(iso);
};

// Convierte 'AR' → '🇦🇷' usando regional indicator symbols
const isoABandera = (iso2) => {
  try {
    return [...iso2.toUpperCase()]
      .map((c) => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65))
      .join('');
  } catch {
    return '🏳️';
  }
};