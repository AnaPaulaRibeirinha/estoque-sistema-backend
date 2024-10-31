import { Request, Response } from 'express';
import { db } from '../config/database';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(), // Salva a imagem na memória como buffer
  limits: { fileSize: 2 * 1024 * 1024 }, // Define o limite de tamanho da imagem, aqui exemplo de 2MB
});

// Função para listar todos os produtos
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute('SELECT * FROM tb_produto');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos', error });
  }
};

// Função para criar um novo produto
export const createProduct = async (req: Request, res: Response) => {
  const { nome, descricao, valor, estoque } = req.body;
  const imagem = req.file?.buffer;

  try {
    console.log("Essa é nome: " + nome);
    console.log("Essa é descricao: " + descricao);
    console.log("Essa é valor: " + valor);
    console.log("Essa é estoque: " + estoque);

    const numericValor = parseFloat(valor);
    const numericEstoque = parseInt(estoque, 10);

    // Salva o produto no banco de dados
    const [result] = await db.execute(
      'INSERT INTO tb_produto (nome, descricao, imagem, valor, estoque) VALUES (?, ?, ?, ?, ?)',
      [nome, descricao, imagem, numericValor, numericEstoque]
    );

    res.status(201).json({ message: `Produto ${nome} criado com sucesso!` });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ message: 'Erro ao criar produto', error });
  }
};

// Middleware para usar o upload do multer antes de processar o produto
export const uploadImage = upload.single('imagem');

// Função para editar um produto
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, descricao, imagem, valor, estoque } = req.body;
  try {
    const [result] = await db.execute(
      'UPDATE tb_produto SET nome = ?, descricao = ?, imagem = ?, valor = ?, estoque = ? WHERE id = ?',
      [nome, descricao, imagem, valor, estoque, id]
    );
    res.status(200).json({ message: `Produto ${nome} atualizado com sucesso!` });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar produto', error });
  }
};

// Função para remover um produto
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM tb_produto WHERE id = ?', [id]);
    res.status(200).json({ message: `Produto com id ${id} removido com sucesso!` });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover produto', error });
  }
};
