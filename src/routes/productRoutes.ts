import express from 'express';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getOneProduct
} from '../controllers/productController';

const router = express.Router();

router.get('/products', getAllProducts); 
router.get('/products/:id', getOneProduct);           
router.post('/products', uploadImage, createProduct);    
router.put('/products/:id', uploadImage, updateProduct);    
router.delete('/products/:id', deleteProduct); 

export default router;
