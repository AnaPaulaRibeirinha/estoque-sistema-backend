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

export const getOneProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const [product] = await db.query('SELECT * FROM tb_produto WHERE id = ?', [id]);
    res.status(200).json({
      message: 'Produto encontrado com sucesso!',
      product: { product }
    });
    //res.json(product[0]);
  } catch (error) {
    console.error('Erro ao buscar produto pelo ID:', error);
    res.status(500).json({ message: 'Erro ao buscar produto' });
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
  const { nome, descricao, valor, estoque } = req.body;
  const imagem = req.file ? req.file.buffer : null;

  try {
    let query = 'UPDATE tb_produto SET ';
    const values: (string | number | Buffer)[] = []; // Declara o tipo de valores

    // Adiciona apenas os campos que não estão vazios
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
      values.push(parseFloat(valor)); // Converte valor para número
    }
    if (estoque) {
      query += 'estoque = ?, ';
      values.push(parseInt(estoque, 10)); // Converte estoque para número
    }
    if (imagem) {
      query += 'imagem = ?, ';
      values.push(imagem); // buffer da imagem
    }

    // Remove a última vírgula e espaço extra antes do WHERE
    query = query.slice(0, -2);
    query += ' WHERE id = ?';
    values.push(parseInt(id, 10)); // Converte id para número

    // Executa a atualização no banco de dados
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
