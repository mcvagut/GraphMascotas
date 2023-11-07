import neo4j from 'neo4j-driver';
import User from '../models/User.js';
import Pet from '../models/Pet.js';
import dotenv from 'dotenv';
dotenv.config();


// Creación de la sesión
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session(process.env.NEO4J_DATABASE);


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

export const adoptPet = async (req, res) => {
  const session = driver.session();
  try {
    const user = new User(session);
    const pet = new Pet(session);
    const { usuario, uuid } = req.body;
    
    console.log('Usuario:', usuario);


    const userNode = await user.findOnlyUsername(usuario);
    console.log('userNode:', userNode);

    if (!userNode) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const petNode = await pet.findOnlyByUUID(uuid);
    console.log('petNode:', petNode);

    if (!petNode) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    // Crea la relación entre el usuario y la mascota, aquí debe estar el fallo!
    await user.adoptPet(userNode, petNode);

    res.status(200).json({ message: 'Mascota adoptada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  } finally {
    session.close();
  }
};



