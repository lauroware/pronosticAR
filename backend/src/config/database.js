const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // opciones recomendadas para producción
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB desconectado');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de MongoDB:', err);
    });

  } catch (error) {
    console.error('❌ No se pudo conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = conectarDB;