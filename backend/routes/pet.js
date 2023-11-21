import express from 'express';
import {
  createPet,
  getPetByUUID,
  updatePet,
  deletePet,
  getPetsByCategory,
} from '../controllers/pet.js';
import {verificar} from '../extra/verificarToken.js';

const router = express.Router();

router.post('/',verificar, createPet);
router.get('/:uuid', getPetByUUID);
router.put('/:uuid', updatePet); 
router.delete('/:id', deletePet);

router.get('/categoria/:categoria', getPetsByCategory);


export default router;
