import express from 'express';
import {
  createUser,
  getUserByUsername,
  updateUser,
  deleteUser,
  adoptPet,
} from '../controllers/user.js';

const router = express.Router();


router.post('/', createUser);
router.get('/:username', getUserByUsername);
router.put('/:username', updateUser); // Para la actualización
router.delete('/:username', deleteUser); // Para la eliminación 
router.post('/adopt', adoptPet);

export default router;
