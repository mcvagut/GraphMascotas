import neo4j from 'neo4j-driver';
import User from '../models/User.js';
import Pet from '../models/Pet.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import AdoptionRequest from '../models/AdoptionRequest.js';
dotenv.config();


// Creación de la sesión
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session(process.env.NEO4J_DATABASE);

export const iniciarSesion = async (req, res) => {
  const session = driver.session();

  try {
    // Lógica para verificar las credenciales del usuario
    const user = new User(session);
    const { usuario, password } = req.body;

    const usuarioAutenticado = await user.verificarCredenciales(usuario, password);

    if (usuarioAutenticado) {
      const { isAdmin } = usuarioAutenticado;
      // Generar el token JWT
      const token = jwt.sign({isAdmin}, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  } finally {
    session.close();
  }
};

export const cerrarSesion = async (req, res) => {
  try {
    // Elimina el token del lado del cliente (por ejemplo, desde las cookies o almacenamiento local)
    res.clearCookie('token');  // Ejemplo si usas cookies, ajusta según tu configuración

    // Devuelve una respuesta exitosa o redirige a la página de inicio de sesión
    res.status(200).json({ message: 'Cierre de sesión exitoso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cerrar sesión' });
  }
};



export const createUser = async (req, res) => {
  const session = driver.session();
  try {
    // Operaciones en la base de datos Neo4j utilizando 'session'
    const user = new User(session);
    const newUser = await user.createUser(req.body);

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  } finally {
    // Cierre de la sesión al finalizar la operación
    session.close();
  }
};

export const getUserByUsername = async (req, res) => {
  const session = driver.session();
  try {
    const user = new User(session);
    const username = req.params.username; // Asegúrate de que el parámetro coincida con el nombre en tu ruta
    console.log('Username:', username); // Agrega este registro de depuración

    const foundUser = await user.findUserByUsername(username);

    if (foundUser) {
      res.status(200).json(foundUser);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  } finally {
    session.close();
  }
};



export const updateUser = async (req, res) => {
  const session = driver.session();
  try {
    const user = new User(session);
    const userId = req.params.username; // O puedes usar req.params.elementId si prefieres
    const updatedProperties = req.body; // Debes enviar las propiedades actualizadas en el cuerpo de la solicitud

    const updatedUser = await user.updateUser(userId, updatedProperties);

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  } finally {
    session.close();
  }
};


export const deleteUser = async (req, res) => {
  const session = driver.session();
  try {
    const user = new User(session);
    const userId = req.params.username; // O puedes usar req.params.elementId si prefieres

    await user.deleteUser(userId);

    res.status(204).send(); // Devuelve una respuesta vacía (sin contenido) si se elimina correctamente
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  } finally {
    session.close();
  }
};

export const solicitarAdopcion = async (req, res) => {
  const session = driver.session();

  try {
    const adoptionRequest = new AdoptionRequest(session);
    const { usuario, mascotaId } = req.body;

    const mascotaAdoptada = await adoptionRequest.verificarMascotaAdoptada(mascotaId);

    if (mascotaAdoptada) {
      // Si la mascota ya fue adoptada, retornar un error o manejar de acuerdo a tu lógica
      return res.status(400).json({ error: 'Esta mascota ya ha sido adoptada' });
    }

    // Verificar si el usuario ya tiene una solicitud pendiente para esa mascota
    const existingRequest = await adoptionRequest.verificarSolicitudPendiente(usuario, mascotaId);

    if (existingRequest) {
      // Si ya tiene una solicitud pendiente, retornar un error o manejar de acuerdo a tu lógica
      return res.status(400).json({ error: 'Ya existe una solicitud pendiente para esta mascota' });
    }

    // Si no hay solicitud pendiente, proceder con la solicitud de adopción
  
    await adoptionRequest.solicitarAdopcion(usuario, mascotaId);

    res.status(200).json({ message: 'Solicitud de adopción enviada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al solicitar la adopción' });
  } finally {
    session.close();
  }
};



