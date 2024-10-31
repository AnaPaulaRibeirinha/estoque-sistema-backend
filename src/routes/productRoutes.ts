import express from 'express';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage
} from '../controllers/productController';

const router = express.Router();

router.get('/products', getAllProducts);       
router.post('/products', uploadImage, createProduct);    
router.put('/products/:id', updateProduct);    
router.delete('/products/:id', deleteProduct); 

export default router;
