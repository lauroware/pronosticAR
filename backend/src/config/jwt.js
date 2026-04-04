const jwt = require('jsonwebtoken');
const generarToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
const verificarToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
module.exports = { generarToken, verificarToken };