import { Request, Response } from 'express';
import { db } from '../config/database';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(), 
  limits: { fileSize: 2 * 1024 * 1024 }, 
});

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute('SELECT * FROM tb_produto');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos', error });
  }
};

export const getOneProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const [product] = await db.query('SELECT * FROM tb_produto WHERE id = ?', [id]);
    res.status(200).json({
      message: 'Produto encontrado com sucesso!',
      product: { product }
    });

  } catch (error) {
    console.error('Erro ao buscar produto pelo ID:', error);
    res.status(500).json({ message: 'Erro ao buscar produto' });
  }
};


export const createProduct = async (req: Request, res: Response) => {
  const { nome, descricao, valor, estoque } = req.body;
  const imagem = req.file?.buffer;

  try {

    const numericValor = parseFloat(valor);
    const numericEstoque = parseInt(estoque, 10);


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

export const uploadImage = upload.single('imagem');

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, descricao, valor, estoque } = req.body;
  const imagem = req.file ? req.file.buffer : null;

  try {
    let query = 'UPDATE tb_produto SET ';
    const values: (string | number | Buffer)[] = []; 

    if (nome) {
      query += 'nome = ?, ';
      values.push(nome);
    }
    if (descricao) {
      query += 'descricao = ?, ';
      values.push(descricao);
    }
    if (valor) {
      query += 'valor = ?, ';
      values.push(parseFloat(valor)); 
    }
    if (estoque) {
      query += 'estoque = ?, ';
      values.push(parseInt(estoque, 10)); 
    }
    if (imagem) {
      query += 'imagem = ?, ';
      values.push(imagem); 
    }

    
    query = query.slice(0, -2);
    query += ' WHERE id = ?';
    values.push(parseInt(id, 10)); 

    const [result] = await db.execute(query, values);

    if ((result as any).affectedRows > 0) {
      res.json({ message: `Produto ${id} atualizado com sucesso!` });
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }

  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Erro ao atualizar produto', error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM tb_produto WHERE id = ?', [id]);
    res.status(200).json({ message: `Produto com id ${id} removido com sucesso!` });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover produto', error });
  }
};
