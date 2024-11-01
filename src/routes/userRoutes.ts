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
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/users', authMiddleware, getAllUsers);           
router.post('/users', createUser);           
router.put('/users/:id', authMiddleware, updateUser);        
router.delete('/users/:id', authMiddleware, deleteUser); 
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;