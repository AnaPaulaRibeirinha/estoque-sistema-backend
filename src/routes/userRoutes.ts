// routes/userRoutes.ts
import express from 'express';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser
} from '../controllers/userController';

const router = express.Router();

router.get('/users', getAllUsers);           
router.post('/users', createUser);           
router.put('/users/:id', updateUser);        
router.delete('/users/:id', deleteUser); 
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;