import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(express.json());

// Usar rotas de produtos e usuários com prefixos separados
app.use('/api', productRoutes);
app.use('/api', userRoutes);

app.use(bodyParser.json({ limit: '10mb' })); // Aumente o limite conforme necessário
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
