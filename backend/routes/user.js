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
  registro,
  iniciarSesionAdmin,
  obtenerFavoritosPorUsuario,
  getAllUsers,
  obtenerSolicitudPendientesesPorUsuario,
  obtenerAdopcionesPorUsuario,
  obtenerRechazadosPorUsuario
} from '../controllers/user.js';


const router = express.Router();


router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:username', getUserByUsername);
router.put('/:username', updateUser);
router.delete('/:username', deleteUser); 

router.post('/loginAdmin', iniciarSesionAdmin)


router.post('/login', iniciarSesion)
router.post('/loginOrg',iniciarSesion)
router.post('/logout', cerrarSesion)
router.post('/registro', registro)

router.post('/solicitudes-adopcion', solicitarAdopcion);

router.post('/:username/favoritos', agregarFavorito);

router.get('/favoritos/:username', obtenerFavoritosPorUsuario);

router.get('/solicitudes-pendientes/:username', obtenerSolicitudPendientesesPorUsuario);

router.get('/solicitudes-adopcion/:username', obtenerAdopcionesPorUsuario);

router.get('/solicitudes-rechazadas/:username', obtenerRechazadosPorUsuario);

export default router;
