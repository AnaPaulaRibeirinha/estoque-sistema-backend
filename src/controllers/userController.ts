import { Request, Response } from 'express';
import { db } from '../config/database';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwtConfig';

// Função para listar todos os usuários
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute('SELECT * FROM tb_usuario');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error });
  }
};

// Função para criar um novo usuário
export const createUser = async (req: Request, res: Response) => {
    const { nome, email, senha } = req.body;
    try {
      // Verifica se o usuário já existe
      const [existingUsers]: [Array<any>, any] = await db.execute('SELECT * FROM tb_usuario WHERE email = ?', [email]);
      if (existingUsers.length > 0) {
        res.status(400).json({ message: 'Usuário já existe.' });
        return;
      }
  
      // Criptografa a senha
      const hashedPassword = await bcrypt.hash(senha, 10);
      
      // Cadastra o usuário
      await db.execute(
        'INSERT INTO tb_usuario (id, nome, email, senha) VALUES (?, ?, ?, ?)',
        [uuidv4(), nome, email, hashedPassword]
      );
      res.status(201).json({ message: `Usuário ${nome} criado com sucesso!` });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar usuário', error });
    }
  };

// Função para editar um usuário
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;

  try {
    const hashedPassword = senha ? await bcrypt.hash(senha, 10) : undefined;

    // Atualiza o usuário
    await db.execute(
      'UPDATE tb_usuario SET nome = ?, email = ?, senha = ? WHERE id = ?',
      [nome, email, hashedPassword || null, id]
    );
    res.status(200).json({ message: `Usuário ${nome} atualizado com sucesso!` });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário', error });
  }
};

// Função para remover um usuário
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM tb_usuario WHERE id = ?', [id]);
    res.status(200).json({ message: `Usuário com id ${id} removido com sucesso!` });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover usuário', error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, senha } = req.body;
  
    try {
      // Verifica se o usuário existe
      const [users]: [Array<any>, any] = await db.execute('SELECT * FROM tb_usuario WHERE email = ?', [email]);
  
      if (users.length === 0) {
        res.status(400).json({ message: 'Usuário não encontrado.' });
        return;
      }
  
      const user = users[0];
  
      // Compara a senha fornecida com a senha armazenada
      const isPasswordValid = await bcrypt.compare(senha, user.senha);
      
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Senha incorreta.' });
        return;
      }
  
      // Gera o token JWT
      const token = jwt.sign({ id: user.id, email: user.email }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
  
      // Retorna o token junto com dados do usuário
      res.status(200).json({
        message: 'Login bem-sucedido!',
        token, 
        user: { id: user.id, nome: user.nome, email: user.email }
      });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao realizar login', error });
    }
  };

export const logoutUser = async (req: Request, res: Response) => {
    res.status(200).json({ message: 'Logout realizado com sucesso!' });
    return;
};
  
