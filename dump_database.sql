CREATE DATABASE case_mindgroup;
USE case_mindgroup;

CREATE TABLE tb_produto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  imagem LONGBLOB,  -- formato blob para armazenar imagens
  valor DECIMAL(10, 2),
  estoque INT DEFAULT 0
);

CREATE TABLE tb_usuario (
  id VARCHAR(36) PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL
);