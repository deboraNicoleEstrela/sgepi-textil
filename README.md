# 🛠️ Documentação Técnica: Sistema de Gerenciamento de EPIs (SST Têxtil)

## 1. Visão Geral do Sistema

O **Sistema de Gerenciamento de EPIs (SGEPI)** visa automatizar, controlar e auditar o fluxo de empréstimo e devolução de Equipamentos de Proteção Individual no setor têxtil. O foco central da solução é assegurar a conformidade legal com a **NR-06**, evitar paralisações por falta de equipamentos e garantir a rastreabilidade total das entregas por colaborador.

## 2. Requisitos do Sistema

### 2.1 Requisitos Funcionais (RF) - IDEAL:

* **RF01 - Autenticação de Usuário (UC01):** Permitir login seguro para Técnicos de SST e Operadores com controle de sessão.

* **RF02 - Cadastro e Edição de Colaboradores (UC02):** Inclusão e atualização de dados (Nome, CPF, Matrícula, Setor Têxtil, Cargo, Telefone e Status).

* **RF03 - Consulta e Busca de Colaboradores (UC06):** Filtragem dinâmica por nome ou matrícula.

* **RF04 - Exclusão Protegida de Colaboradores (UC07):** Confirmação via modal/alerta prévio antes da remoção ou desativação.

* **RF05 - Cadastro e Controle de EPIs (UC03):** Registro de equipamentos, número do CA (`ca_numero`), estoque disponível e data de validade do Certificado de Aprovação.

* **RF06 - Empréstimo e Retirada de EPI (UC04):** Registro de saídas associando colaborador, equipamento, data, hora e responsável. Bloqueio de itens com CA vencido ou estoque zerado.

* **RF07 - Devolução de EPI (UC05):** Registro de devolução e atualização do status da entrega (`EMPRESTADO`, `DEVOLVIDO`, `ATRASADO`).

* **RF08 - Gestão de Pendências e Alertas (UC08):** Painel com notificações de itens pendentes, vencimento de vida útil e CAs prestes a expirar.

### 2.2 Requisitos Não Funcionais (RNF) - IDEAL: 

* **RNF01 - Interface Intuitiva de Campo:** UI responsiva e com poucos cliques para uso rápido no chão de fábrica.

* **RNF02 - Mapeamento Visual de Ações Críticas:** Destaque em cores de alerta para exclusões e descarte de material.

* **RNF03 - Desempenho e Eficiência:** Tempo de resposta inferior a 2 segundos em pesquisas e gravações.

* **RNF04 - Rastreabilidade de Operações:** Manutenção de logs de auditoria imutáveis para atendimento à NR-06.

* **RNF05 - Proteção de Dados (LGPD):** Criptografia e tratamento seguro para dados sensíveis (CPF, matrícula).

* **RNF06 - Proteção de Acesso:** Bloqueio de rotas não autorizadas via middlewares de autenticação.

* **RNF07 - Integridade das Informações:** Impedimento de duplicação de cadastros ativos por CPF ou Matrícula. Restrições com `ON DELETE RESTRICT` nas chaves estrangeiras.


### 2.3 Requisitos Funcionais (RF) - PROTÓTIPO REALIZADO: 

* **RF-01: Cadastro de Colaborador**
  * **Descrição:** Cadastrar colaborador informando nome, CPF, matrícula, setor têxtil e cargo.
  * **Módulo:** Colaboradores
  * **Prioridade:** Alta
  * **Regra de Negócio:** CPF e Matrícula únicos.

* **RF-02: Edição e Status de Colaborador**
  * **Descrição:** Editar dados cadastrais e status (Ativo/Inativo) do colaborador.
  * **Módulo:** Colaboradores
  * **Prioridade:** Alta
  * **Regra de Negócio:** Preservar histórico.

* **RF-03: Pesquisa Dinâmica**
  * **Descrição:** Filtrar/pesquisar colaboradores dinamicamente pelo nome na listagem.
  * **Módulo:** Colaboradores
  * **Prioridade:** Alta
  * **Regra de Negócio:** Busca em tempo real.

* **RF-04: Exclusão com Validação**
  * **Descrição:** Excluir colaborador do sistema com confirmação e validação de vínculo.
  * **Módulo:** Colaboradores
  * **Prioridade:** Alta
  * **Regra de Negócio:** Bloquear se houver EPI pendente.

* **RF-05: Controle de Estoque de EPIs**
  * **Descrição:** Cadastrar e controlar estoque de EPIs vinculando o número do CA e validade.
  * **Módulo:** Estoque EPI
  * **Prioridade:** Média
  * **Regra de Negócio:** Bloquear entrega de CA vencido.

* **RF-06: Movimentação de EPIs**
  * **Descrição:** Registrar empréstimo e devolução de EPIs para colaboradores.
  * **Módulo:** Movimentação
  * **Prioridade:** Média
  * **Regra de Negócio:** Baixa automática de estoque.

### 2.3 Requisitos Não Funcionais (RNF) - PROTÓTIPO REALIZADO: 

* **RNF-01: Interface Responsiva**
  * **Descrição:** Interface responsiva otimizada para desktops e tablets de fábrica.
  * **Categoria:** Usabilidade / Design
  * **Métrica / Critério:** Bootstrap 5 / Flexbox.

* **RNF-02: Desempenho de Consulta**
  * **Descrição:** Tempo de resposta da consulta de colaboradores inferior a 200ms.
  * **Categoria:** Desempenho
  * **Métrica / Critério:** Indexação B-Tree MySQL.

* **RNF-03: Integridade de Dados**
  * **Descrição:** Persistência de dados com integridade referencial ACID.
  * **Categoria:** Confiabilidade
  * **Métrica / Critério:** MySQL Engine InnoDB.

* **RNF-04: Containerização**
  * **Descrição:** Arquitetura conteinerizada para rápida implantação e replicação.
  * **Categoria:** Portabilidade
  * **Métrica / Critério:** Docker & Docker Compose.


## 3. Modelagem do Banco de Dados (DDL) 

O modelo de banco de dados e as operações projetadas para o SGEPI utilizam o conceito de CRUD.

O termo CRUD é um acrónimo para as quatro operações básicas de armazenamento persistente de dados:

* Create (Criar/Inserir):

- - No SQL: Comando INSERT INTO (ex.: cadastro de novos colaboradores, EPIs e empréstimos).

- - No SGEPI: Mapeado no requisito RF-01 (Cadastrar colaborador) e no RF-05 (Cadastrar EPIs).

* Read (Ler/Consultar):

- - No SQL: Comando SELECT (ex.: listagem, filtros e consultas aos dados armazenados).

- - No SGEPI: Mapeado no requisito RF-03 (Filtrar/pesquisar colaboradores dinamicamente).

* Update (Atualizar/Alterar):

- - No SQL: Comando UPDATE (ex.: modificação de dados cadastrais, alteração de status ou baixa de estoque).

- - No SGEPI: Mapeado no requisito RF-02 (Editar dados e status) e no RF-06 (Baixa automática de estoque e devolução).

* Delete (Eliminar/Remover):

- - No SQL: Comando DELETE (ou exclusão lógica via UPDATE status = 'INATIVO').

- - No SGEPI: Mapeado no requisito RF-04 (Excluir colaborador do sistema).


# 3.1 Modelagem IDEAL:

-- =============================================================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS - SST EPI (SETOR TÊXTIL)
-- =============================================================================
CREATE DATABASE IF NOT EXISTS sst_epi_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE sst_epi_db;

-- -----------------------------------------------------------------------------
-- Tabela 1: Usuários do Sistema (Operadores e Técnicos de SST)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cargo VARCHAR(50) DEFAULT 'Técnico SST',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Tabela 2: Colaboradores da Indústria Têxtil
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS colaboradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    setor ENUM('Fiação', 'Tecelagem', 'Tinturaria', 'Acabamento', 'Manutenção') NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    telefone VARCHAR(20),
    status ENUM('ATIVO', 'INATIVO') DEFAULT 'ATIVO',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Tabela 3: Equipamentos de Proteção Individual (EPIs)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS epis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    ca_numero VARCHAR(30) NOT NULL UNIQUE,
    descricao TEXT,
    quantidade_estoque INT NOT NULL DEFAULT 0,
    validade_ca DATE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Tabela 4: Registro de Empréstimos e Devoluções de EPIs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS emprestimos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    colaborador_id INT NOT NULL,
    epi_id INT NOT NULL,
    usuario_id INT NOT NULL,
    data_retirada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_devolucao_prevista DATE NOT NULL,
    data_devolucao_real DATETIME NULL,
    quantidade INT NOT NULL DEFAULT 1,
    status ENUM('EMPRESTADO', 'DEVOLVIDO', 'ATRASADO') DEFAULT 'EMPRESTADO',
    observacao VARCHAR(255),
    FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE RESTRICT,
    FOREIGN KEY (epi_id) REFERENCES epis(id) ON DELETE RESTRICT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- POVOAMENTO INICIAL (DADOS DE TESTE)
-- -----------------------------------------------------------------------------
INSERT INTO colaboradores (nome, cpf, matricula, setor, cargo, telefone) VALUES
('Carlos Eduardo Silva', '111.222.333-44', 'TEX-1001', 'Tecelagem', 'Operador de Tecelagem', '(75) 98888-1111'),
('Ana Maria Souza', '222.333.444-55', 'TEX-1002', 'Tinturaria', 'Auxiliar de Tinturaria', '(75) 98888-2222'),
('Roberto Mendes', '333.444.555-66', 'TEX-1003', 'Fiação', 'Mecânico de Manutenção', '(75) 98888-3333');


## 3.2 Modelagem do PROTÓTIPO REALIZADO: 

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


## 4. Diagrama de Casos de Uso (PlantUML)

# Como visualizar e exportar o diagrama em PlantUML:
* PlantUML Web Server / Editor Online (recomendado):
  - Acesse o servidor oficial: www.plantuml.com/plantuml/uml/
  - Cole o código acima no campo de texto e o diagrama será gerado automaticamente. Você pode baixá-lo em PNG, SVG ou PDF.
* Visual Studio Code (VS Code):
  - Instale a extensão PlantUML (de jebbs).
  - Abra um arquivo com a extensão .puml ou .plantuml, cole o código e pressione Alt + D para visualizar o diagrama em tempo real.
* Draw.io (Diagrams.net):
  - No menu superior: Inserir > Avançado > PlantUML...
  - Cole o código e clique em Inserir.


@startuml
skinparam {
    Style strictuml
    RoundCorner 12
    Shadowing true
    DefaultFontName "Segoe UI", "Arial"
    DefaultFontSize 13
}

actor "Técnico de SST /\n Operador" as Tecnico

rectangle "Sistema de Gerenciamento de EPIs (SST Têxtil)" {
    
    package "Acesso & Segurança" #ECEFF1 {
        usecase "UC01: Autenticar no Sistema" as UC1
    }

    package "Gestão de Cadastros" #F1F5F9 {
        usecase "UC02: Gerenciar Colaboradores\n(Criar, Editar, Listar)" as UC2
        usecase "UC06: Pesquisar Colaborador\npor Nome" as UC6
        usecase "UC07: Confirmar Exclusão\nde Colaborador" as UC7
        usecase "UC03: Gerenciar EPIs e CA\n(Validade e Estoque)" as UC3
    }

    package "Operações Diárias de Campo" #F1F5F9 {
        usecase "UC04: Registrar Empréstimo de EPI" as UC4
        usecase "UC05: Registrar Devolução de EPI" as UC5
        usecase "UC08: Consultar Pendências\ne Alertas de Retirada" as UC8
    }

    Tecnico --> UC1
    Tecnico --> UC2
    Tecnico --> UC3
    Tecnico --> UC4
    Tecnico --> UC5
    Tecnico --> UC8

    UC2 .> UC1 : <<include>>
    UC3 .> UC1 : <<include>>
    UC4 .> UC1 : <<include>>
    UC5 .> UC1 : <<include>>

    UC2 .> UC6 : <<include>>
    UC7 .> UC2 : <<extend>>
}
@enduml


## 5. Mapeamento da Interface (Wireframe PlantUML Salt)

@startsalt
{+
  {
    "<b>SGEPI</b> | Indústria Têxtil"
    .
    "Operador: <b>Carlos (Técnico SST)</b>"
    [ Sair ]
  }
  --
  {
    [<b>UC02: Colaboradores</b>]
    [ UC03: EPIs & CA ]
    [ UC04: Empréstimos ]
    [ UC05: Devolução ]
    [ UC08: Alertas (3) ]
  }
  --
  {
    [ (X) <b>Sucesso:</b> Colaborador Carlos Eduardo Silva cadastrado com sucesso! ]
  }
  --
  {
    {^" <b>UC02: Form. Cadastrar / Editar</b> "
      Nome Completo* | " [ Ex: Carlos Eduardo Silva            ] "
      CPF*            | " [ 111.222.333-44                      ] "
      Matrícula*      | " [ TEX-1001                            ] "
      Setor Têxtil*   | ^Selecione o Setor...^Fiação^Tecelagem^Tinturaria^Acabamento^Manutenção^
      Cargo*          | " [ Operador de Tecelagem               ] "
      Telefone        | " [ (75) 98888-1111                     ] "
      --
      {
        [ <b>Salvar Colaborador</b> ]
        |
        [ Cancelar Edição ]
      }
    }
    |
    {^" <b>Consulta e Gestão de Cadastros</b> "
      {
        "Pesquisar por Nome:"
        |
        " [ Carlos...                             ] "
        |
        [ Limpar ]
      }
      --
      {#
        <b>Matrícula</b> | <b>Nome Completo</b> | <b>CPF</b> | <b>Setor</b> | <b>Cargo</b> | <b>Ações Rápidas</b>
        TEX-1001 | Carlos Eduardo Silva | 111.222.333-44 | Tecelagem  | Tecelão    | [Editar] | [Excluir]
        TEX-1002 | Ana Maria Souza     | 222.333.444-55 | Tinturaria | Auxiliar   | [Editar] | [Excluir]
        TEX-1003 | Roberto Mendes      | 333.444.555-66 | Fiação     | Mecânico   | [Editar] | [Excluir]
      }
      --
      {^" <b>UC07: Modal de Confirmação de Exclusão</b> "
        Deseja remover o colaborador <b>Carlos Eduardo Silva</b>?
        Matrícula: <b>TEX-1001</b>
        
        <i>Esta ação não poderá ser desfeita no banco de dados.</i>
        --
        {
          [ Cancelar ]
          |
          [ <b>Confirmar Exclusão</b> ]
        }
      }
    }
  }
}
@endsalt


## 6. Rodando e entendendo o SGEPI - Sistema de Gerenciamento de EPIs (Indústria Têxtil)

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

O **SGEPI** é uma solução para gestão de Equipamentos de Proteção Individual (EPIs) em fábricas
têxteis, atendendo às exigências da norma **NR-06**.

# Como Executar o Projeto com Docker
1. Certifique-se de ter o **Docker** e o **Docker Compose** instalados.
2. Clone o repositório:
```bash
git clone https://github.com/deboraNicoleEstrela/sgepi-textil.git
cd sgepi-textil
```
3. Suba os containers da aplicação e do banco de dados:
```bash
docker-compose up -d --build
```
4. Acesse a aplicação no seu navegador:
`http://localhost:8080`

## 🛠️ Tecnologias Utilizadas
- **Front-end**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.
- **Banco de Dados**: MySQL 8.0 Workbench.
- **DevOps**: Docker, Docker Compose, Nginx.

## 📄 Licença
Este projeto está sob a licença MIT.