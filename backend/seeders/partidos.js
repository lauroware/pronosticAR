require('dotenv').config();
const mongoose = require('mongoose');
const { Partido, Torneo } = require('../src/models');

const codigos = {
  'Mexico': 'MEX', 'Sudafrica': 'RSA', 'Corea del Sur': 'KOR', 'Republica Checa': 'CZE',
  'Canada': 'CAN', 'Qatar': 'QAT', 'Suiza': 'SUI', 'Bosnia y Herzegovina': 'BIH',
  'Brasil': 'BRA', 'Marruecos': 'MAR', 'Haiti': 'HAI', 'Escocia': 'SCO',
  'Estados Unidos': 'USA', 'Paraguay': 'PAR', 'Australia': 'AUS', 'Turquia': 'TUR',
  'Alemania': 'GER', 'Curazao': 'CUW', 'Costa de Marfil': 'CIV', 'Ecuador': 'ECU',
  'Paises Bajos': 'NED', 'Japon': 'JPN', 'Tunez': 'TUN', 'Suecia': 'SWE',
  'Belgica': 'BEL', 'Egipto': 'EGY', 'Iran': 'IRN', 'Nueva Zelanda': 'NZL',
  'Espana': 'ESP', 'Cabo Verde': 'CPV', 'Arabia Saudita': 'KSA', 'Uruguay': 'URU',
  'Francia': 'FRA', 'Senegal': 'SEN', 'Noruega': 'NOR', 'Repechaje 2': 'R02',
  'Argentina': 'ARG', 'Argelia': 'ALG', 'Austria': 'AUT', 'Jordania': 'JOR',
  'Portugal': 'POR', 'Uzbekistan': 'UZB', 'Colombia': 'COL', 'Repechaje 1': 'R01',
  'Inglaterra': 'ENG', 'Croacia': 'CRO', 'Ghana': 'GHA', 'Panama': 'PAN'
};

// PARTIDOS FASE DE GRUPOS (73)
const gruposPartidos = [
  { fecha: "2026-06-11", grupo: "A", equipo1: "Mexico", equipo2: "Sudafrica", estadio: "Estadio Ciudad de Mexico" },
  { fecha: "2026-06-11", grupo: "A", equipo1: "Corea del Sur", equipo2: "Republica Checa", estadio: "Estadio Guadalajara" },
  { fecha: "2026-06-12", grupo: "B", equipo1: "Canada", equipo2: "Bosnia y Herzegovina", estadio: "Toronto Stadium" },
  { fecha: "2026-06-12", grupo: "D", equipo1: "Estados Unidos", equipo2: "Paraguay", estadio: "Los Angeles Stadium" },
  { fecha: "2026-06-13", grupo: "B", equipo1: "Qatar", equipo2: "Suiza", estadio: "San Francisco Bay Area Stadium" },
  { fecha: "2026-06-13", grupo: "C", equipo1: "Brasil", equipo2: "Marruecos", estadio: "New York New Jersey Stadium" },
  { fecha: "2026-06-13", grupo: "C", equipo1: "Haiti", equipo2: "Escocia", estadio: "Boston Stadium" },
  { fecha: "2026-06-13", grupo: "D", equipo1: "Australia", equipo2: "Turquia", estadio: "BC Place Vancouver" },
  { fecha: "2026-06-14", grupo: "E", equipo1: "Alemania", equipo2: "Curazao", estadio: "Houston Stadium" },
  { fecha: "2026-06-14", grupo: "F", equipo1: "Paises Bajos", equipo2: "Japon", estadio: "Dallas Stadium" },
  { fecha: "2026-06-14", grupo: "E", equipo1: "Costa de Marfil", equipo2: "Ecuador", estadio: "Philadelphia Stadium" },
  { fecha: "2026-06-14", grupo: "F", equipo1: "Suecia", equipo2: "Tunez", estadio: "Estadio Monterrey" },
  { fecha: "2026-06-15", grupo: "H", equipo1: "Espana", equipo2: "Cabo Verde", estadio: "Atlanta Stadium" },
  { fecha: "2026-06-15", grupo: "G", equipo1: "Belgica", equipo2: "Egipto", estadio: "Seattle Stadium" },
  { fecha: "2026-06-15", grupo: "H", equipo1: "Arabia Saudita", equipo2: "Uruguay", estadio: "Miami Stadium" },
  { fecha: "2026-06-15", grupo: "G", equipo1: "Iran", equipo2: "Nueva Zelanda", estadio: "Los Angeles Stadium" },
  { fecha: "2026-06-16", grupo: "I", equipo1: "Francia", equipo2: "Senegal", estadio: "New York New Jersey Stadium" },
  { fecha: "2026-06-16", grupo: "I", equipo1: "Repechaje 2", equipo2: "Noruega", estadio: "Boston Stadium" },
  { fecha: "2026-06-16", grupo: "J", equipo1: "Argentina", equipo2: "Argelia", estadio: "Kansas City Stadium" },
  { fecha: "2026-06-16", grupo: "J", equipo1: "Austria", equipo2: "Jordania", estadio: "San Francisco Bay Area Stadium" },
  { fecha: "2026-06-17", grupo: "K", equipo1: "Portugal", equipo2: "Repechaje 1", estadio: "Houston Stadium" },
  { fecha: "2026-06-17", grupo: "L", equipo1: "Inglaterra", equipo2: "Croacia", estadio: "Dallas Stadium" },
  { fecha: "2026-06-17", grupo: "L", equipo1: "Ghana", equipo2: "Panama", estadio: "Toronto Stadium" },
  { fecha: "2026-06-17", grupo: "K", equipo1: "Uzbekistan", equipo2: "Colombia", estadio: "Estadio Ciudad de Mexico" },
  { fecha: "2026-06-18", grupo: "A", equipo1: "Republica Checa", equipo2: "Sudafrica", estadio: "Atlanta Stadium" },
  { fecha: "2026-06-18", grupo: "B", equipo1: "Suiza", equipo2: "Bosnia y Herzegovina", estadio: "Los Angeles Stadium" },
  { fecha: "2026-06-18", grupo: "B", equipo1: "Canada", equipo2: "Qatar", estadio: "BC Place Vancouver" },
  { fecha: "2026-06-18", grupo: "A", equipo1: "Mexico", equipo2: "Corea del Sur", estadio: "Estadio Guadalajara" },
  { fecha: "2026-06-19", grupo: "D", equipo1: "Estados Unidos", equipo2: "Australia", estadio: "Seattle Stadium" },
  { fecha: "2026-06-19", grupo: "C", equipo1: "Escocia", equipo2: "Marruecos", estadio: "Boston Stadium" },
  { fecha: "2026-06-19", grupo: "C", equipo1: "Brasil", equipo2: "Haiti", estadio: "Philadelphia Stadium" },
  { fecha: "2026-06-19", grupo: "D", equipo1: "Turquia", equipo2: "Paraguay", estadio: "San Francisco Bay Area Stadium" },
  { fecha: "2026-06-20", grupo: "F", equipo1: "Paises Bajos", equipo2: "Suecia", estadio: "Houston Stadium" },
  { fecha: "2026-06-20", grupo: "E", equipo1: "Alemania", equipo2: "Costa de Marfil", estadio: "Toronto Stadium" },
  { fecha: "2026-06-20", grupo: "E", equipo1: "Ecuador", equipo2: "Curazao", estadio: "Kansas City Stadium" },
  { fecha: "2026-06-20", grupo: "F", equipo1: "Tunez", equipo2: "Japon", estadio: "Estadio Monterrey" },
  { fecha: "2026-06-21", grupo: "H", equipo1: "Espana", equipo2: "Arabia Saudita", estadio: "Atlanta Stadium" },
  { fecha: "2026-06-21", grupo: "G", equipo1: "Belgica", equipo2: "Iran", estadio: "Los Angeles Stadium" },
  { fecha: "2026-06-21", grupo: "H", equipo1: "Uruguay", equipo2: "Cabo Verde", estadio: "Miami Stadium" },
  { fecha: "2026-06-21", grupo: "G", equipo1: "Nueva Zelanda", equipo2: "Egipto", estadio: "BC Place Vancouver" },
  { fecha: "2026-06-22", grupo: "J", equipo1: "Argentina", equipo2: "Austria", estadio: "Dallas Stadium" },
  { fecha: "2026-06-22", grupo: "I", equipo1: "Francia", equipo2: "Repechaje 2", estadio: "Philadelphia Stadium" },
  { fecha: "2026-06-22", grupo: "I", equipo1: "Noruega", equipo2: "Senegal", estadio: "New York New Jersey Stadium" },
  { fecha: "2026-06-22", grupo: "J", equipo1: "Jordania", equipo2: "Argelia", estadio: "San Francisco Bay Area Stadium" },
  { fecha: "2026-06-23", grupo: "K", equipo1: "Portugal", equipo2: "Uzbekistan", estadio: "Houston Stadium" },
  { fecha: "2026-06-23", grupo: "L", equipo1: "Inglaterra", equipo2: "Ghana", estadio: "Boston Stadium" },
  { fecha: "2026-06-23", grupo: "L", equipo1: "Panama", equipo2: "Croacia", estadio: "Toronto Stadium" },
  { fecha: "2026-06-23", grupo: "K", equipo1: "Colombia", equipo2: "Repechaje 1", estadio: "Estadio Guadalajara" },
  { fecha: "2026-06-24", grupo: "B", equipo1: "Suiza", equipo2: "Canada", estadio: "BC Place Vancouver" },
  { fecha: "2026-06-24", grupo: "B", equipo1: "Bosnia y Herzegovina", equipo2: "Qatar", estadio: "Seattle Stadium" },
  { fecha: "2026-06-24", grupo: "C", equipo1: "Escocia", equipo2: "Brasil", estadio: "Miami Stadium" },
  { fecha: "2026-06-24", grupo: "C", equipo1: "Marruecos", equipo2: "Haiti", estadio: "Atlanta Stadium" },
  { fecha: "2026-06-24", grupo: "A", equipo1: "Republica Checa", equipo2: "Mexico", estadio: "Estadio Ciudad de Mexico" },
  { fecha: "2026-06-24", grupo: "A", equipo1: "Sudafrica", equipo2: "Corea del Sur", estadio: "Estadio Monterrey" },
  { fecha: "2026-06-25", grupo: "E", equipo1: "Ecuador", equipo2: "Alemania", estadio: "New York New Jersey Stadium" },
  { fecha: "2026-06-25", grupo: "E", equipo1: "Curazao", equipo2: "Costa de Marfil", estadio: "Philadelphia Stadium" },
  { fecha: "2026-06-25", grupo: "F", equipo1: "Tunez", equipo2: "Paises Bajos", estadio: "Kansas City Stadium" },
  { fecha: "2026-06-25", grupo: "F", equipo1: "Japon", equipo2: "Suecia", estadio: "Dallas Stadium" },
  { fecha: "2026-06-25", grupo: "D", equipo1: "Turquia", equipo2: "Estados Unidos", estadio: "Los Angeles Stadium" },
  { fecha: "2026-06-25", grupo: "D", equipo1: "Paraguay", equipo2: "Australia", estadio: "San Francisco Bay Area Stadium" },
  { fecha: "2026-06-26", grupo: "I", equipo1: "Noruega", equipo2: "Francia", estadio: "Boston Stadium" },
  { fecha: "2026-06-26", grupo: "I", equipo1: "Senegal", equipo2: "Repechaje 2", estadio: "Toronto Stadium" },
  { fecha: "2026-06-26", grupo: "H", equipo1: "Uruguay", equipo2: "Espana", estadio: "Estadio Guadalajara" },
  { fecha: "2026-06-26", grupo: "H", equipo1: "Cabo Verde", equipo2: "Arabia Saudita", estadio: "Houston Stadium" },
  { fecha: "2026-06-26", grupo: "G", equipo1: "Nueva Zelanda", equipo2: "Belgica", estadio: "BC Place Vancouver" },
  { fecha: "2026-06-26", grupo: "G", equipo1: "Egipto", equipo2: "Iran", estadio: "Seattle Stadium" },
  { fecha: "2026-06-27", grupo: "L", equipo1: "Panama", equipo2: "Inglaterra", estadio: "New York New Jersey Stadium" },
  { fecha: "2026-06-27", grupo: "L", equipo1: "Croacia", equipo2: "Ghana", estadio: "Philadelphia Stadium" },
  { fecha: "2026-06-27", grupo: "K", equipo1: "Colombia", equipo2: "Portugal", estadio: "Miami Stadium" },
  { fecha: "2026-06-27", grupo: "K", equipo1: "Repechaje 1", equipo2: "Uzbekistan", estadio: "Atlanta Stadium" },
  { fecha: "2026-06-27", grupo: "J", equipo1: "Jordania", equipo2: "Argentina", estadio: "Dallas Stadium" },
  { fecha: "2026-06-27", grupo: "J", equipo1: "Argelia", equipo2: "Austria", estadio: "Kansas City Stadium" }
];

// ELIMINATORIAS
const eliminatorias = [
  // Dieciseisavos
  { fecha: "2026-06-28", fase: "dieciseisavos", equipo1: "2do Grupo A", equipo2: "2do Grupo B", estadio: "Los Angeles Stadium" },
  { fecha: "2026-06-29", fase: "dieciseisavos", equipo1: "1ro Grupo E", equipo2: "2do Grupo F", estadio: "Houston Stadium" },
  { fecha: "2026-06-29", fase: "dieciseisavos", equipo1: "1ro Grupo E", equipo2: "3ro Grupo A/B/C/D/F", estadio: "Boston Stadium" },
  { fecha: "2026-06-29", fase: "dieciseisavos", equipo1: "1ro Grupo F", equipo2: "2do Grupo C", estadio: "Estadio Monterrey" },
  { fecha: "2026-06-30", fase: "dieciseisavos", equipo1: "2do Grupo E", equipo2: "2do Grupo I", estadio: "Dallas Stadium" },
  { fecha: "2026-06-30", fase: "dieciseisavos", equipo1: "1ro Grupo I", equipo2: "3ro Grupo C/D/F/G/H", estadio: "New York New Jersey Stadium" },
  { fecha: "2026-06-30", fase: "dieciseisavos", equipo1: "1ro Grupo A", equipo2: "3ro Grupo C/E/F/H/I", estadio: "Estadio Ciudad de Mexico" },
  { fecha: "2026-07-01", fase: "dieciseisavos", equipo1: "1ro Grupo L", equipo2: "3ro Grupo E/H/I/J/K", estadio: "Atlanta Stadium" },
  { fecha: "2026-07-01", fase: "dieciseisavos", equipo1: "1ro Grupo G", equipo2: "3ro Grupo A/E/H/I/J", estadio: "Seattle Stadium" },
  { fecha: "2026-07-01", fase: "dieciseisavos", equipo1: "1ro Grupo D", equipo2: "3ro Grupo B/E/F/I/J", estadio: "San Francisco Bay Area Stadium" },
  { fecha: "2026-07-02", fase: "dieciseisavos", equipo1: "2do Grupo K", equipo2: "2do Grupo L", estadio: "Toronto Stadium" },
  { fecha: "2026-07-02", fase: "dieciseisavos", equipo1: "1ro Grupo H", equipo2: "2do Grupo J", estadio: "Los Angeles Stadium" },
  { fecha: "2026-07-02", fase: "dieciseisavos", equipo1: "1ro Grupo B", equipo2: "3ro Grupo E/F/G/I/J", estadio: "BC Place Vancouver" },
  { fecha: "2026-07-03", fase: "dieciseisavos", equipo1: "2do Grupo D", equipo2: "2do Grupo G", estadio: "Dallas Stadium" },
  { fecha: "2026-07-03", fase: "dieciseisavos", equipo1: "1ro Grupo J", equipo2: "2do Grupo H", estadio: "Miami Stadium" },
  { fecha: "2026-07-03", fase: "dieciseisavos", equipo1: "1ro Grupo K", equipo2: "3ro Grupo D/E/I/J/L", estadio: "Kansas City Stadium" },
  // Octavos
  { fecha: "2026-07-04", fase: "octavos", equipo1: "Ganador P73", equipo2: "Ganador P75", estadio: "Houston Stadium" },
  { fecha: "2026-07-04", fase: "octavos", equipo1: "Ganador P74", equipo2: "Ganador P77", estadio: "Philadelphia Stadium" },
  { fecha: "2026-07-05", fase: "octavos", equipo1: "Ganador P76", equipo2: "Ganador P78", estadio: "New York New Jersey Stadium" },
  { fecha: "2026-07-05", fase: "octavos", equipo1: "Ganador P79", equipo2: "Ganador P80", estadio: "Estadio Azteca" },
  { fecha: "2026-07-06", fase: "octavos", equipo1: "Ganador P83", equipo2: "Ganador P84", estadio: "Dallas Stadium" },
  { fecha: "2026-07-06", fase: "octavos", equipo1: "Ganador P81", equipo2: "Ganador P82", estadio: "Seattle Stadium" },
  { fecha: "2026-07-07", fase: "octavos", equipo1: "Ganador P86", equipo2: "Ganador P88", estadio: "Atlanta Stadium" },
  { fecha: "2026-07-07", fase: "octavos", equipo1: "Ganador P85", equipo2: "Ganador P87", estadio: "BC Place Vancouver" },
  // Cuartos
  { fecha: "2026-07-09", fase: "cuartos", equipo1: "Ganador P89", equipo2: "Ganador P90", estadio: "Boston Stadium" },
  { fecha: "2026-07-10", fase: "cuartos", equipo1: "Ganador P93", equipo2: "Ganador P94", estadio: "Los Angeles Stadium" },
  { fecha: "2026-07-11", fase: "cuartos", equipo1: "Ganador P91", equipo2: "Ganador P92", estadio: "Miami Stadium" },
  { fecha: "2026-07-11", fase: "cuartos", equipo1: "Ganador P95", equipo2: "Ganador P96", estadio: "Kansas City Stadium" },
  // Semifinales
  { fecha: "2026-07-14", fase: "semifinal", equipo1: "Ganador P97", equipo2: "Ganador P98", estadio: "Dallas Stadium" },
  { fecha: "2026-07-15", fase: "semifinal", equipo1: "Ganador P99", equipo2: "Ganador P100", estadio: "Atlanta Stadium" },
  // Tercer puesto
  { fecha: "2026-07-18", fase: "tercer_puesto", equipo1: "Perdedor SF1", equipo2: "Perdedor SF2", estadio: "Miami Stadium" },
  // Final
  { fecha: "2026-07-19", fase: "final", equipo1: "Ganador SF1", equipo2: "Ganador SF2", estadio: "MetLife Stadium, New York New Jersey" }
];

async function cargarTodo() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Conectado a MongoDB');

    let torneo = await Torneo.findOne({ nombre: 'Mundial 2026' });
    if (!torneo) {
      torneo = await Torneo.create({
        nombre: 'Mundial 2026',
        edicion: '2026',
        fechaInicio: new Date('2026-06-11'),
        fechaFin: new Date('2026-07-19'),
        estado: 'proximo',
        activo: true
      });
      console.log('✅ Torneo Mundial 2026 creado');
    }

    await Partido.deleteMany({ torneo: torneo._id });
    console.log('🗑️ Partidos antiguos eliminados');

    const todos = [];

    // Grupos
    for (const p of gruposPartidos) {
      todos.push({
        torneo: torneo._id,
        fase: 'grupos',
        grupoFase: p.grupo,
        equipoLocal: { nombre: p.equipo1, codigoPais: codigos[p.equipo1] || '???' },
        equipoVisitante: { nombre: p.equipo2, codigoPais: codigos[p.equipo2] || '???' },
        fechaHora: new Date(p.fecha + 'T15:00:00-03:00'),
        estadio: p.estadio,
        estado: 'programado'
      });
    }

    // Eliminatorias
    for (const p of eliminatorias) {
      todos.push({
        torneo: torneo._id,
        fase: p.fase,
        equipoLocal: { nombre: p.equipo1, codigoPais: 'TBD' },
        equipoVisitante: { nombre: p.equipo2, codigoPais: 'TBD' },
        fechaHora: new Date(p.fecha + 'T15:00:00-03:00'),
        estadio: p.estadio,
        estado: 'programado'
      });
    }

    await Partido.insertMany(todos);
    console.log(`✅ ${todos.length} partidos cargados`);
    console.log(`   - Fase de grupos: ${gruposPartidos.length}`);
    console.log(`   - Eliminatorias: ${eliminatorias.length}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

cargarTodo();