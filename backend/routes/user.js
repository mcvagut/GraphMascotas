import express from 'express';
import {
  createUser,
  getUserByUsername,
  updateUser,
  deleteUser,
  iniciarSesion,
  cerrarSesion,
  solicitarAdopcion,
  agregarFavorito,
} from '../controllers/user.js';


const router = express.Router();


router.post('/', createUser);
router.get('/:username', getUserByUsername);
router.put('/:username', updateUser);
router.delete('/:username', deleteUser); 


router.post('/login', iniciarSesion)
router.post('/logout', cerrarSesion)

router.post('/solicitudes-adopcion', solicitarAdopcion);

router.post('/:username/favoritos', agregarFavorito);

export default router;
