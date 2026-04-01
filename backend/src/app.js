require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const morgan     = require('morgan');
const http       = require('http');
const { Server } = require('socket.io');

const conectarDB     = require('./config/database');
const routes         = require('./routes/index');
const errorHandler   = require('./middleware/errorHandler');
const configurarSockets = require('./config/sockets');

// Conectar a MongoDB
conectarDB();

const app    = express();
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});
configurarSockets(io);
app.set('io', io); // disponible en controllers via req.app.get('io')

// ---- Middlewares globales ----
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// ---- Rutas ----
app.use('/api', routes);

// ---- Health check ----
app.get('/health', (req, res) => res.json({ status: 'ok', env: process.env.NODE_ENV }));

// ---- Error handler (siempre último) ----
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT} [${process.env.NODE_ENV}]`);
});

module.exports = { app, server };