import express from 'express';

const router = express.Router();
import {obtenerCategorias, crearCategoria} from '../controllers/pet.js';

router.get('/', obtenerCategorias);
router.post('/', crearCategoria);




export default router;
