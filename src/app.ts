import express from 'express';
import productRoutes from './routes/productRoutes';

const app = express();

app.use(express.json());

// Rotas
app.use('/api/products', productRoutes);

export default app;
