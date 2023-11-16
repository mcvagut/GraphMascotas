import jwt from 'jsonwebtoken';

export const verificar = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      return res.status(401).json({ error: 'Token no válido' });
    }

    req.user = usuario; // Agregar la información del usuario a req.user
    next();
  });
};


