-- =============================================================================
-- SISTEMA DE GERENCIAMENTO DE EPIS (SGEPI) - INDÚSTRIA TÊXTIL
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS E TABELAS NO MYSQL WORKBENCH
-- =============================================================================

-- 1. Criação do Banco de Dados / Schema
CREATE DATABASE IF NOT EXISTS `sgepi_db`
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE `sgepi_db`;

-- =============================================================================
-- 2. Tabela: usuarios
-- Armazena os usuários do sistema (Técnicos de SST, Administradores e Operadores)
-- =============================================================================
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `senha_hash` VARCHAR(255) NOT NULL,
  `perfil` ENUM('ADMIN', 'TECNICO_SST', 'OPERADOR') NOT NULL DEFAULT 'TECNICO_SST',
  `ativo` TINYINT(1) NOT NULL DEFAULT 1,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uk_usuarios_email` (`email` ASC)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =============================================================================
-- 3. Tabela: colaboradores
-- Armazena os colaboradores da indústria têxtil (Atende à Etapa 2 do Desafio)
-- =============================================================================
CREATE TABLE IF NOT EXISTS `colaboradores` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `cpf` VARCHAR(14) NOT NULL,
  `matricula` VARCHAR(20) NOT NULL,
  `setor` ENUM('Fiação', 'Tecelagem', 'Tinturaria', 'Acabamento', 'Manutenção') NOT NULL,
  `cargo` VARCHAR(50) NOT NULL,
  `telefone` VARCHAR(20) NULL,
  `status` ENUM('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO',
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uk_colaboradores_cpf` (`cpf` ASC),
  UNIQUE INDEX `uk_colaboradores_matricula` (`matricula` ASC),
  INDEX `idx_colaboradores_nome` (`nome` ASC) -- Índice otimizado para o RF03 (Busca por nome)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =============================================================================
-- 4. Tabela: epis
-- Cadastro dos Equipamentos de Proteção Individual e Certificados de Aprovação (CA)
-- =============================================================================
CREATE TABLE IF NOT EXISTS `epis` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `ca_numero` VARCHAR(30) NOT NULL,
  `descricao` TEXT NULL,
  `quantidade_estoque` INT NOT NULL DEFAULT 0,
  `validade_ca` DATE NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uk_epis_ca_numero` (`ca_numero` ASC)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =============================================================================
-- 5. Tabela: emprestimos
-- Registro de empréstimos e controle de devolução de EPIs aos colaboradores
-- =============================================================================
CREATE TABLE IF NOT EXISTS `emprestimos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `colaborador_id` INT NOT NULL,
  `epi_id` INT NOT NULL,
  `usuario_id` INT NOT NULL,
  `data_retirada` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_devolucao_prevista` DATE NOT NULL,
  `data_devolucao_real` DATETIME NULL,
  `quantidade` INT NOT NULL DEFAULT 1,
  `status` ENUM('EMPRESTADO', 'DEVOLVIDO', 'ATRASADO') NOT NULL DEFAULT 'EMPRESTADO',
  `condicao_devolucao` ENUM('PERFEITO', 'DANIFICADO', 'DESCARTE', 'HIGIENIZACAO') NULL,
  `observacao` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_emprestimos_colaboradores_idx` (`colaborador_id` ASC),
  INDEX `fk_emprestimos_epis_idx` (`epi_id` ASC),
  INDEX `fk_emprestimos_usuarios_idx` (`usuario_id` ASC),
  CONSTRAINT `fk_emprestimos_colaboradores`
    FOREIGN KEY (`colaborador_id`)
    REFERENCES `colaboradores` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_emprestimos_epis`
    FOREIGN KEY (`epi_id`)
    REFERENCES `epis` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_emprestimos_usuarios`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `usuarios` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-- =============================================================================
-- 6. DADOS INICIAIS DE TESTE (POVOAMENTO / SEED)
-- =============================================================================

-- Usuário Administrador/Técnico de SST
INSERT INTO `usuarios` (`nome`, `email`, `senha_hash`, `perfil`) VALUES
('Carlos Oliveira', 'carlos.sst@textil.com.br', '$2a$12$eImiTXuWVxfM37uY4JANjOL.8/OHq2D6pMTrp/.ZtuN2K2s8oE.l.', 'TECNICO_SST');

-- Colaboradores da Indústria Têxtil
INSERT INTO `colaboradores` (`nome`, `cpf`, `matricula`, `setor`, `cargo`, `telefone`) VALUES
('Carlos Eduardo Silva', '111.222.333-44', 'TEX-1001', 'Tecelagem', 'Operador de Tecelagem', '(75) 98888-1111'),
('Ana Maria Souza', '222.333.444-55', 'TEX-1002', 'Tinturaria', 'Auxiliar de Tinturaria', '(75) 98888-2222'),
('Roberto Mendes', '333.444.555-66', 'TEX-1003', 'Fiação', 'Mecânico de Manutenção', '(75) 98888-3333');

-- EPIs com Certificado de Aprovação (CA)
INSERT INTO `epis` (`nome`, `ca_numero`, `descricao`, `quantidade_estoque`, `validade_ca`) VALUES
('Protetor Auricular Plug de Silicone', 'CA-12345', 'Atenuação de ruído para áreas de tecelagem e fiação', 150, '2027-12-31'),
('Máscara PFF2 contra Poeiras Têxteis', 'CA-67890', 'Proteção respiratória contra névoas e poeiras de algodão', 300, '2026-10-15'),
('Luva de Nitrila para Manipulação Química', 'CA-11223', 'Proteção das mãos no setor de tinturaria e acabamento', 80, '2028-05-20'),
('Óculos de Proteção Incolor Anti-risco', 'CA-44556', 'Proteção ocular contra impactos de partículas volantes', 100, '2027-08-10');

-- Registro de Empréstimo Inicial
INSERT INTO `emprestimos` (`colaborador_id`, `epi_id`, `usuario_id`, `data_devolucao_prevista`, `quantidade`, `status`) VALUES
(1, 1, 1, '2026-11-01', 1, 'EMPRESTADO'),
(2, 3, 1, '2026-10-15', 1, 'EMPRESTADO');