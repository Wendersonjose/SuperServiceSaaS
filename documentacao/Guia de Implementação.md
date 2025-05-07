# Guia de Implementação - Sistema SaaS para Gestão de Prestação de Serviços

## Introdução

Este guia fornece instruções detalhadas para implementar o Sistema SaaS para Gestão de Prestação de Serviços, uma solução completa para empresas que necessitam de agendamento, controle de pagamentos, cadastro de serviços, integração com WhatsApp e customização por templates. O documento está organizado em fases incrementais de desenvolvimento, seguindo as melhores práticas de engenharia de software e utilizando as tecnologias definidas no stack tecnológico.

## Pré-requisitos

Antes de iniciar o desenvolvimento, certifique-se de que o ambiente de desenvolvimento esteja configurado com os seguintes componentes:

### Requisitos de Sistema

- Node.js 18+ (recomendado 20+)
- PostgreSQL 14+
- MongoDB 6+
- Redis 7+
- Git

### Ferramentas Recomendadas

- Visual Studio Code com extensões para JavaScript/TypeScript, React, Node.js
- Docker e Docker Compose
- Postman para testes de API
- DBeaver ou pgAdmin para gerenciamento do banco de dados relacional
- MongoDB Compass para gerenciamento do banco de dados não-relacional

## Fase 1: Configuração do Ambiente (Semana 1)

### 1.1 Configuração do Backend (Node.js)

```bash
# Criar diretório do projeto
mkdir -p saas-servicos/backend
cd saas-servicos/backend

# Inicializar projeto Node.js
npm init -y

# Instalar dependências principais
npm install express cors helmet express-rate-limit jsonwebtoken bcrypt mongoose pg sequelize dotenv winston joi celebrate

# Instalar dependências de desenvolvimento
npm install --save-dev nodemon eslint prettier jest supertest
```

#### Configuração da Estrutura de Diretórios

```bash
# Criar estrutura de diretórios
mkdir -p src/{config,controllers,middlewares,models,routes,services,utils}
mkdir -p src/models/{postgres,mongodb}
mkdir -p tests/{unit,integration}
```

#### Configuração do .env

```bash
# Crie um arquivo `.env` na raiz do projeto backend:

# Ambiente
NODE_ENV=development
PORT=3001

# Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saas_servicos
DB_USER=postgres
DB_PASS=postgres

# Banco de Dados MongoDB
MONGO_URI=mongodb://localhost:27017/saas_servicos

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=seu_segredo_jwt_aqui
JWT_EXPIRATION=1d

# WhatsApp API
WHATSAPP_API_URL=<https://api.whatsapp.com/v1>
WHATSAPP_API_KEY=sua_chave_api_aqui

# Stripe (Pagamentos)
STRIPE_SECRET_KEY=sua_chave_secreta_stripe
STRIPE_WEBHOOK_SECRET=seu_segredo_webhook_stripe
```

#### Configuração do Express (src/app.js)

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares de segurança
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
});
app.use(limiter);

// Rotas
app.use('/api', routes);

// Tratamento de erros de validação
app.use(errors());

// Middleware de tratamento de erros global
app.use(errorHandler);

module.exports = app;
```

#### Configuração do Servidor (src/server.js)

```javascript
const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const { connectPostgres } = require('./models/postgres');
const { connectMongoDB } = require('./models/mongodb');

const PORT = config.port || 3001;

// Conectar aos bancos de dados
async function startServer() {
  try {
    await connectPostgres();
    await connectMongoDB();
    
    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    logger.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

startServer();
```

### 1.2 Configuração do Frontend Web (Next.js)

```bash
# Criar aplicação Next.js
cd saas-servicos
npx create-nextjs-app frontend-web

# Instalar dependências adicionais
cd frontend-web
npm install @headlessui/react @heroicons/react zustand react-query react-hook-form yup @hookform/resolvers axios recharts react-datepicker react-toastify
npm install -D tailwindcss postcss autoprefixer
```

#### Configuração do Tailwind CSS

```bash
# Inicializar Tailwind CSS
npx tailwindcss init -p
```

Edite o arquivo `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
    },
  },
  plugins: [],
}
```

### 1.3 Configuração do Docker

Crie um arquivo `docker-compose.yml` na raiz do projeto:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    container_name: saas-postgres
    environment:
      POSTGRES_DB: saas_servicos
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mongodb:
    image: mongo:6
    container_name: saas-mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:7
    container_name: saas-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  mongodb_data:
  redis_data:
```

## Fase 2: Implementação dos Modelos (Semanas 2-3)

### 2.1 Modelos PostgreSQL (Dados Relacionais)

Crie os modelos Sequelize para os dados relacionais:

#### src/models/postgres/index.js

```javascript
const { Sequelize } = require('sequelize');
const config = require('../../config');
const logger = require('../../utils/logger');

const sequelize = new Sequelize(
  config.postgres.database,
  config.postgres.username,
  config.postgres.password,
  {
    host: config.postgres.host,
    port: config.postgres.port,
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Conexão com PostgreSQL estabelecida com sucesso.');
  } catch (error) {
    logger.error('Erro ao conectar ao PostgreSQL:', error);
    throw error;
  }
};

// Importar modelos
const Usuario = require('./usuario')(sequelize);
const Empresa = require('./empresa')(sequelize);
const Cliente = require('./cliente')(sequelize);
const Servico = require('./servico')(sequelize);
const Categoria = require('./categoria')(sequelize);
const Agendamento = require('./agendamento')(sequelize);
const Pagamento = require('./pagamento')(sequelize);
const Profissional = require('./profissional')(sequelize);
const HorarioDisponivel = require('./horarioDisponivel')(sequelize);
const Template = require('./template')(sequelize);

// Definir associações
Usuario.hasOne(Cliente);
Cliente.belongsTo(Usuario);

Usuario.hasOne(Profissional);
Profissional.belongsTo(Usuario);

Empresa.hasMany(Usuario);
Usuario.belongsTo(Empresa);

Empresa.hasMany(Cliente);
Cliente.belongsTo(Empresa);

Empresa.hasMany(Servico);
Servico.belongsTo(Empresa);

Empresa.hasMany(Categoria);
Categoria.belongsTo(Empresa);

Categoria.hasMany(Servico);
Servico.belongsTo(Categoria);

Cliente.hasMany(Agendamento);
Agendamento.belongsTo(Cliente);

Profissional.hasMany(Agendamento);
Agendamento.belongsTo(Profissional);

Servico.hasMany(Agendamento);
Agendamento.belongsTo(Servico);

Agendamento.hasOne(Pagamento);
Pagamento.belongsTo(Agendamento);

Profissional.hasMany(HorarioDisponivel);
HorarioDisponivel.belongsTo(Profissional);

Profissional.belongsToMany(Servico, { through: 'ProfissionalServico' });
Servico.belongsToMany(Profissional, { through: 'ProfissionalServico' });

Template.hasMany(Empresa);
Empresa.belongsTo(Template);

// Sincronizar modelos com o banco de dados
const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    logger.info('Modelos sincronizados com o PostgreSQL.');
  } catch (error) {
    logger.error('Erro ao sincronizar modelos com PostgreSQL:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  connectPostgres,
  syncModels,
  models: {
    Usuario,
    Empresa,
    Cliente,
    Servico,
    Categoria,
    Agendamento,
    Pagamento,
    Profissional,
    HorarioDisponivel,
    Template
  }
};
```

#### src/models/postgres/usuario.js

```javascript
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipo: {
      type: DataTypes.ENUM('ADMIN', 'GERENTE', 'PROFISSIONAL', 'CLIENTE'),
      allowNull: false,
      defaultValue: 'CLIENTE'
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'usuarios',
    timestamps: true,
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.senha) {
          usuario.senha = await bcrypt.hash(usuario.senha, 10);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('senha')) {
          usuario.senha = await bcrypt.hash(usuario.senha, 10);
        }
      }
    }
  });

  Usuario.prototype.verificarSenha = async function(senha) {
    return bcrypt.compare(senha, this.senha);
  };

  return Usuario;
};
```

### 2.2 Modelos MongoDB (Dados Não-Relacionais)

Crie os modelos Mongoose para os dados não-relacionais:

#### src/models/mongodb/index.js

```javascript
const mongoose = require('mongoose');
const config = require('../../config');
const logger = require('../../utils/logger');

const connectMongoDB = async () => {
  try {
    await mongoose.connect(config.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('Conexão com MongoDB estabelecida com sucesso.');
  } catch (error) {
    logger.error('Erro ao conectar ao MongoDB:', error);
    throw error;
  }
};

// Importar modelos
const Notificacao = require('./notificacao');
const ConfiguracaoTemplate = require('./configuracaoTemplate');
const Log = require('./log');

module.exports = {
  connectMongoDB,
  models: {
    Notificacao,
    ConfiguracaoTemplate,
    Log
  }
};
```

#### src/models/mongodb/notificacao.js

```javascript
const mongoose = require('mongoose');

const notificacaoSchema = new mongoose.Schema({
  destinatario: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['CONFIRMACAO_AGENDAMENTO', 'LEMBRETE_AGENDAMENTO', 'CANCELAMENTO', 'REAGENDAMENTO', 'CONFIRMACAO_PAGAMENTO', 'PROMOCAO'],
    required: true
  },
  conteudo: {
    type: String,
    required: true
  },
  canal: {
    type: String,
    enum: ['EMAIL', 'SMS', 'WHATSAPP', 'PUSH'],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDENTE', 'ENVIADO', 'ENTREGUE', 'LIDO', 'FALHA'],
    default: 'PENDENTE'
  },
  dataEnvio: {
    type: Date
  },
  metadados: {
    type: mongoose.Schema.Types.Mixed
  },
  agendamentoId: {
    type: String,
    ref: 'Agendamento'
  }
}, {
  timestamps: true
});

const Notificacao = mongoose.model('Notificacao', notificacaoSchema);

module.exports = Notificacao;
```

## Fase 3: Implementação das APIs (Semanas 4-5)

### 3.1 Configuração das Rotas

#### src/routes/index.js

```javascript
const express = require('express');
const authRoutes = require('./auth.routes');
const usuarioRoutes = require('./usuario.routes');
const empresaRoutes = require('./empresa.routes');
const clienteRoutes = require('./cliente.routes');
const servicoRoutes = require('./servico.routes');
const categoriaRoutes = require('./categoria.routes');
const agendamentoRoutes = require('./agendamento.routes');
const pagamentoRoutes = require('./pagamento.routes');
const profissionalRoutes = require('./profissional.routes');
const notificacaoRoutes = require('./notificacao.routes');
const templateRoutes = require('./template.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/empresas', empresaRoutes);
router.use('/clientes', clienteRoutes);
router.use('/servicos', servicoRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/agendamentos', agendamentoRoutes);
router.use('/pagamentos', pagamentoRoutes);
router.use('/profissionais', profissionalRoutes);
router.use('/notificacoes', notificacaoRoutes);
router.use('/templates', templateRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
```

### 3.2 Implementação da Autenticação

#### src/controllers/auth.controller.js

```javascript
const jwt = require('jsonwebtoken');
const { models } = require('../models/postgres');
const config = require('../config');
const AppError = require('../utils/appError');

const { Usuario } = models;

exports.login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    // Buscar usuário pelo email
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      throw new AppError('Email ou senha inválidos', 401);
    }

    // Verificar senha
    const senhaCorreta = await usuario.verificarSenha(senha);
    if (!senhaCorreta) {
      throw new AppError('Email ou senha inválidos', 401);
    }

    // Verificar se o usuário está ativo
    if (!usuario.ativo) {
      throw new AppError('Usuário inativo', 403);
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Retornar dados do usuário e token
    res.status(200).json({
      status: 'success',
      data: {
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          tipo: usuario.tipo
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.registro = async (req, res, next) => {
  try {
    const { nome, email, senha, telefone, tipo = 'CLIENTE' } = req.body;

    // Verificar se o email já está em uso
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      throw new AppError('Email já está em uso', 400);
    }

    // Criar novo usuário
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha,
      telefone,
      tipo
    });

    // Gerar token JWT
    const token = jwt.sign(
      { id: novoUsuario.id, tipo: novoUsuario.tipo },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Retornar dados do usuário e token
    res.status(201).json({
      status: 'success',
      data: {
        usuario: {
          id: novoUsuario.id,
          nome: novoUsuario.nome,
          email: novoUsuario.email,
          tipo: novoUsuario.tipo
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};
```

### 3.3 Middleware de Autenticação

#### src/middlewares/auth.middleware.js

```javascript
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const config = require('../config');
const { models } = require('../models/postgres');
const AppError = require('../utils/appError');

const { Usuario } = models;

exports.protect = async (req, res, next) => {
  try {
    // 1) Verificar se o token existe
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Você não está autenticado. Por favor, faça login para obter acesso.', 401));
    }

    // 2) Verificar se o token é válido
    const decoded = await promisify(jwt.verify)(token, config.jwt.secret);

    // 3) Verificar se o usuário ainda existe
    const usuarioAtual = await Usuario.findByPk(decoded.id);
    if (!usuarioAtual) {
      return next(new AppError('O usuário associado a este token não existe mais.', 401));
    }

    // 4) Verificar se o usuário está ativo
    if (!usuarioAtual.ativo) {
      return next(new AppError('Usuário inativo. Por favor, contate o administrador.', 403));
    }

    // Guardar o usuário na requisição para uso posterior
    req.usuario = usuarioAtual;
    next();
  } catch (error) {
    next(new AppError('Autenticação inválida. Por favor, faça login novamente.', 401));
  }
};

exports.restringirA = (...tipos) => {
  return (req, res, next) => {
    if (!tipos.includes(req.usuario.tipo)) {
      return next(new AppError('Você não tem permissão para realizar esta ação.', 403));
    }
    next();
  };
};
```

## Fase 4: Implementação do Frontend Web (Semanas 6-8)

### 4.1 Estrutura de Diretórios

Organize o frontend web com a seguinte estrutura:

```bash
frontend-web/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── forms/
│   │   ├── dashboard/
│   │   ├── agendamento/
│   │   ├── cliente/
│   │   ├── servico/
│   │   └── pagamento/
│   ├── contexts/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── styles/
│   └── utils/
```

### 4.2 Configuração do Contexto de Autenticação

#### src/contexts/AuthContext.js

```javascript
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { setAuthToken, removeAuthToken } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      setAuthToken(token);
      carregarUsuario();
    } else {
      setCarregando(false);
    }
  }, []);

  const carregarUsuario = async () => {
    try {
      const response = await api.get('/usuarios/me');
      setUsuario(response.data.data.usuario);
      setErro(null);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      logout();
    } finally {
      setCarregando(false);
    }
  };

  const login = async (email, senha) => {
    try {
      setCarregando(true);
      const response = await api.post('/auth/login', { email, senha });
      const { token, usuario } = response.data.data;
      
      localStorage.setItem('token', token);
      setAuthToken(token);
      setUsuario(usuario);
      setErro(null);
      
      return usuario;
    } catch (error) {
      setErro(error.response?.data?.message || 'Erro ao fazer login');
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  const registro = async (dadosUsuario) => {
    try {
      setCarregando(true);
      const response = await api.post('/auth/registro', dadosUsuario);
      const { token, usuario } = response.data.data;
      
      localStorage.setItem('token', token);
      setAuthToken(token);
      setUsuario(usuario);
      setErro(null);
      
      return usuario;
    } catch (error) {
      setErro(error.response?.data?.message || 'Erro ao registrar');
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    removeAuthToken();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
        erro,
        login,
        registro,
        logout,
        isAuthenticated: !!usuario
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### 4.3 Implementação do Layout Principal

#### src/components/layout/MainLayout.js

```jsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  HomeIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  CogIcon, 
  CurrencyDollarIcon,
  DocumentTextIcon,
  BellIcon,
  MenuIcon,
  XIcon
} from '@heroicons/react/outline';
import { useAuth } from '../../contexts/AuthContext';

const MainLayout = ({ children }) => {
  const { usuario, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Agendamentos', href: '/agendamentos', icon: CalendarIcon },
    { name: 'Clientes', href: '/clientes', icon: UserGroupIcon },
    { name: 'Serviços', href: '/servicos', icon: DocumentTextIcon },
    { name: 'Pagamentos', href: '/pagamentos', icon: CurrencyDollarIcon },
    { name: 'Configurações', href: '/configuracoes', icon: CogIcon },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar para mobile */}
      <div className={`md:hidden fixed inset-0 flex z-40 ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Fechar sidebar</span>
              <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-primary-600">SaaS Serviços</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    router.pathname === item.href
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      router.pathname === item.href ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-4 flex-shrink-0 h-6 w-6`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div>
                  <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white">
                    {usuario?.nome?.charAt(0) || 'U'}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">{usuario?.nome}</p>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-500 group-hover:text-gray-700"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-primary-600">SaaS Serviços</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      router.pathname === item.href
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        router.pathname === item.href ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 flex-shrink-0 h-6 w-6`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white">
                      {usuario?.nome?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{usuario?.nome}</p>
                    <button
                      onClick={handleLogout}
                      className="text-xs font-medium text-gray-500 group-hover:text-gray-700"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Abrir sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
```

## Fase 5: Implementação dos Templates (Semanas 9-10)

### 5.1 Estrutura de Templates

Crie a estrutura para os templates de diferentes tipos de negócios:

#### src/models/postgres/template.js

```javascript
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Template = sequelize.define('Template', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipoNegocio: {
      type: DataTypes.ENUM('LAVA_JATO', 'OFICINA_MECANICA', 'SALAO_BELEZA', 'CONSULTORIO_MEDICO', 'CLINICA_ESTETICA', 'PERSONALIZADO'),
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'templates',
    timestamps: true
  });

  return Template;
};
```

#### src/models/mongodb/configuracaoTemplate.js

```javascript
const mongoose = require('mongoose');

const configuracaoTemplateSchema = new mongoose.Schema({
  templateId: {
    type: String,
    required: true
  },
  configuracoes: {
    cores: {
      primaria: String,
      secundaria: String,
      terciaria: String,
      texto: String,
      fundo: String
    },
    logo: String,
    campos: [{
      nome: String,
      label: String,
      tipo: {
        type: String,
        enum: ['TEXT', 'NUMBER', 'DATE', 'SELECT', 'CHECKBOX', 'RADIO', 'TEXTAREA']
      },
      entidade: {
        type: String,
        enum: ['CLIENTE', 'SERVICO', 'AGENDAMENTO', 'PROFISSIONAL']
      },
      obrigatorio: Boolean,
      opcoes: [String],
      ordem: Number,
      visivel: Boolean
    }],
    fluxos: [{
      nome: String,
      passos: [{
        ordem: Number,
        acao: String,
        condicao: String,
        proximoPasso: Number
      }]
    }],
    notificacoes: [{
      tipo: {
        type: String,
        enum: ['CONFIRMACAO_AGENDAMENTO', 'LEMBRETE_AGENDAMENTO', 'CANCELAMENTO', 'REAGENDAMENTO', 'CONFIRMACAO_PAGAMENTO', 'PROMOCAO']
      },
      modelo: String,
      canais: [{
        type: String,
        enum: ['EMAIL', 'SMS', 'WHATSAPP', 'PUSH']
      }],
      antecedencia: Number
    }]
  }
}, {
  timestamps: true
});

const ConfiguracaoTemplate = mongoose.model('ConfiguracaoTemplate', configuracaoTemplateSchema);

module.exports = ConfiguracaoTemplate;
```

### 5.2 Implementação dos Templates Específicos

Crie scripts para inicializar os templates específicos:

#### scripts/inicializar-templates.js

```javascript
const { models } = require('../src/models/postgres');
const { models: mongoModels } = require('../src/models/mongodb');
const logger = require('../src/utils/logger');

const { Template } = models;
const { ConfiguracaoTemplate } = mongoModels;

const templates = [
  {
    nome: 'Lava Jato',
    tipoNegocio: 'LAVA_JATO',
    descricao: 'Template para empresas de lavagem de veículos',
    configuracoes: {
      cores: {
        primaria: '#0284c7',
        secundaria: '#0ea5e9',
        terciaria: '#38bdf8',
        texto: '#0c4a6e',
        fundo: '#f0f9ff'
      },
      campos: [
        {
          nome: 'placa',
          label: 'Placa do Veículo',
          tipo: 'TEXT',
          entidade: 'CLIENTE',
          obrigatorio: true,
          ordem: 1,
          visivel: true
        },
        {
          nome: 'modelo',
          label: 'Modelo do Veículo',
          tipo: 'TEXT',
          entidade: 'CLIENTE',
          obrigatorio: true,
          ordem: 2,
          visivel: true
        },
        {
          nome: 'cor',
          label: 'Cor do Veículo',
          tipo: 'TEXT',
          entidade: 'CLIENTE',
          obrigatorio: true,
          ordem: 3,
          visivel: true
        },
        {
          nome: 'tipoVeiculo',
          label: 'Tipo de Veículo',
          tipo: 'SELECT',
          entidade: 'CLIENTE',
          obrigatorio: true,
          opcoes: ['Carro', 'Moto', 'Caminhonete', 'SUV', 'Caminhão'],
          ordem: 4,
          visivel: true
        }
      ],
      notificacoes: [
        {
          tipo: 'CONFIRMACAO_AGENDAMENTO',
          modelo: 'Olá {{cliente.nome}}, seu agendamento para lavagem do veículo {{cliente.modelo}} de placa {{cliente.placa}} foi confirmado para {{agendamento.data}} às {{agendamento.hora}}.',
          canais: ['WHATSAPP', 'EMAIL'],
          antecedencia: 0
        },
        {
          tipo: 'LEMBRETE_AGENDAMENTO',
          modelo: 'Olá {{cliente.nome}}, lembramos que seu agendamento para lavagem do veículo {{cliente.modelo}} está marcado para amanhã às {{agendamento.hora}}.',
          canais: ['WHATSAPP'],
          antecedencia: 24
        }
      ]
    }
  },
  {
    nome: 'Oficina Mecânica',
    tipoNegocio: 'OFICINA_MECANICA',
    descricao: 'Template para oficinas mecânicas e auto centers',
    configuracoes: {
      cores: {
        primaria: '#b91c1c',
        secundaria: '#dc2626',
        terciaria: '#ef4444',
        texto: '#7f1d1d',
        fundo: '#fef2f2'
      },
      campos: [
        {
          nome: 'placa',
          label: 'Placa do Veículo',
          tipo: 'TEXT',
          entidade: 'CLIENTE',
          obrigatorio: true,
          ordem: 1,
          visivel: true
        },
        {
          nome: 'modelo',
          label: 'Modelo do Veículo',
          tipo: 'TEXT',
          entidade: 'CLIENTE',
          obrigatorio: true,
          ordem: 2,
          visivel: true
        },
        {
          nome: 'ano',
          label: 'Ano do Veículo',
          tipo: 'NUMBER',
          entidade: 'CLIENTE',
          obrigatorio: true,
          ordem: 3,
          visivel: true
        },
        {
          nome: 'quilometragem',
          label: 'Quilometragem',
          tipo: 'NUMBER',
          entidade: 'CLIENTE',
          obrigatorio: false,
          ordem: 4,
          visivel: true
        },
        {
          nome: 'descricaoProblema',
          label: 'Descrição do Problema',
          tipo: 'TEXTAREA',
          entidade: 'AGENDAMENTO',
          obrigatorio: true,
          ordem: 5,
          visivel: true
        }
      ],
      notificacoes: [
        {
          tipo: 'CONFIRMACAO_AGENDAMENTO',
          modelo: 'Olá {{cliente.nome}}, seu agendamento para manutenção do veículo {{cliente.modelo}} de placa {{cliente.placa}} foi confirmado para {{agendamento.data}} às {{agendamento.hora}}.',
          canais: ['WHATSAPP', 'EMAIL'],
          antecedencia: 0
        },
        {
          tipo: 'LEMBRETE_AGENDAMENTO',
          modelo: 'Olá {{cliente.nome}}, lembramos que seu agendamento para manutenção do veículo {{cliente.modelo}} está marcado para amanhã às {{agendamento.hora}}.',
          canais: ['WHATSAPP'],
          antecedencia: 24
        }
      ]
    }
  },
  {
    nome: 'Salão de Beleza',
    tipoNegocio: 'SALAO_BELEZA',
    descricao: 'Template para salões de beleza e estética',
    configuracoes: {
      cores: {
        primaria: '#be185d',
        secundaria: '#db2777',
        terciaria: '#ec4899',
        texto: '#831843',
        fundo: '#fdf2f8'
      },
      campos: [
        {
          nome: 'preferenciaProfissional',
          label: 'Profissional Preferido',
          tipo: 'SELECT',
          entidade: 'AGENDAMENTO',
          obrigatorio: false,
          opcoes: [],
          ordem: 1,
          visivel: true
        },
        {
          nome: 'alergias',
          label: 'Alergias',
          tipo: 'TEXTAREA',
          entidade: 'CLIENTE',
          obrigatorio: false,
          ordem: 2,
          visivel: true
        },
        {
          nome: 'observacoes',
          label: 'Observações',
          tipo: 'TEXTAREA',
          entidade: 'AGENDAMENTO',
          obrigatorio: false,
          ordem: 3,
          visivel: true
        }
      ],
      notificacoes: [
        {
          tipo: 'CONFIRMACAO_AGENDAMENTO',
          modelo: 'Olá {{cliente.nome}}, seu agendamento para {{servico.nome}} com {{profissional.nome}} foi confirmado para {{agendamento.data}} às {{agendamento.hora}}.',
          canais: ['WHATSAPP', 'EMAIL'],
          antecedencia: 0
        },
        {
          tipo: 'LEMBRETE_AGENDAMENTO',
          modelo: 'Olá {{cliente.nome}}, lembramos que seu agendamento para {{servico.nome}} está marcado para amanhã às {{agendamento.hora}}.',
          canais: ['WHATSAPP'],
          antecedencia: 24
        }
      ]
    }
  }
];

async function inicializarTemplates() {
  try {
    for (const template of templates) {
      const { nome, tipoNegocio, descricao, configuracoes } = template;
      
      // Criar ou atualizar template no PostgreSQL
      const [templateObj, created] = await Template.findOrCreate({
        where: { tipoNegocio },
        defaults: {
          nome,
          tipoNegocio,
          descricao
        }
      });
      
      if (!created) {
        await templateObj.update({
          nome,
          descricao
        });
      }
      
      // Criar ou atualizar configuração no MongoDB
      await ConfiguracaoTemplate.findOneAndUpdate(
        { templateId: templateObj.id },
        { templateId: templateObj.id, configuracoes },
        { upsert: true, new: true }
      );
      
      logger.info(`Template ${nome} ${created ? 'criado' : 'atualizado'} com sucesso.`);
    }
    
    logger.info('Todos os templates foram inicializados com sucesso.');
  } catch (error) {
    logger.error('Erro ao inicializar templates:', error);
  }
}

module.exports = inicializarTemplates;
```

## Fase 6: Integração com WhatsApp (Semanas 11-12)

### 6.1 Serviço de Integração com WhatsApp

#### src/services/whatsapp.service.js

```javascript
const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

class WhatsAppService {
  constructor() {
    this.apiUrl = config.whatsapp.apiUrl;
    this.apiKey = config.whatsapp.apiKey;
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async enviarMensagem(telefone, mensagem) {
    try {
      // Formatar telefone (remover caracteres não numéricos)
      const telefoneFormatado = telefone.replace(/\D/g, '');
      
      const response = await this.client.post('/messages', {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: telefoneFormatado,
        type: 'text',
        text: {
          body: mensagem
        }
      });
      
      logger.info(`Mensagem WhatsApp enviada para ${telefone}`);
      return response.data;
    } catch (error) {
      logger.error(`Erro ao enviar mensagem WhatsApp para ${telefone}:`, error.response?.data || error.message);
      throw new Error(`Falha ao enviar mensagem WhatsApp: ${error.message}`);
    }
  }

  async enviarTemplate(telefone, template, parametros) {
    try {
      const telefoneFormatado = telefone.replace(/\D/g, '');
      
      const response = await this.client.post('/messages', {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: telefoneFormatado,
        type: 'template',
        template: {
          name: template,
          language: {
            code: 'pt_BR'
          },
          components: [
            {
              type: 'body',
              parameters: parametros.map(param => ({
                type: 'text',
                text: param
              }))
            }
          ]
        }
      });
      
      logger.info(`Template WhatsApp ${template} enviado para ${telefone}`);
      return response.data;
    } catch (error) {
      logger.error(`Erro ao enviar template WhatsApp para ${telefone}:`, error.response?.data || error.message);
      throw new Error(`Falha ao enviar template WhatsApp: ${error.message}`);
    }
  }
}

module.exports = new WhatsAppService();
```

### 6.2 Serviço de Notificações

#### src/services/notificacao.service.js

```javascript
const { models: mongoModels } = require('../models/mongodb');
const { models } = require('../models/postgres');
const whatsappService = require('./whatsapp.service');
const logger = require('../utils/logger');

const { Notificacao } = mongoModels;
const { Agendamento, Cliente, Servico, Profissional } = models;

class NotificacaoService {
  async criarNotificacao(dados) {
    try {
      const notificacao = await Notificacao.create(dados);
      return notificacao;
    } catch (error) {
      logger.error('Erro ao criar notificação:', error);
      throw error;
    }
  }

  async enviarNotificacao(notificacaoId) {
    try {
      const notificacao = await Notificacao.findById(notificacaoId);
      
      if (!notificacao) {
        throw new Error(`Notificação não encontrada: ${notificacaoId}`);
      }
      
      if (notificacao.status !== 'PENDENTE') {
        logger.info(`Notificação ${notificacaoId} já foi processada (status: ${notificacao.status})`);
        return notificacao;
      }
      
      // Processar envio conforme o canal
      switch (notificacao.canal) {
        case 'WHATSAPP':
          await this._enviarPorWhatsApp(notificacao);
          break;
        case 'EMAIL':
          // Implementar envio por email
          break;
        case 'SMS':
          // Implementar envio por SMS
          break;
        case 'PUSH':
          // Implementar envio por push notification
          break;
        default:
          throw new Error(`Canal de notificação não suportado: ${notificacao.canal}`);
      }
      
      // Atualizar status da notificação
      notificacao.status = 'ENVIADO';
      notificacao.dataEnvio = new Date();
      await notificacao.save();
      
      return notificacao;
    } catch (error) {
      logger.error(`Erro ao enviar notificação ${notificacaoId}:`, error);
      
      // Atualizar status para falha
      await Notificacao.findByIdAndUpdate(notificacaoId, {
        status: 'FALHA',
        metadados: { erro: error.message }
      });
      
      throw error;
    }
  }

  async _enviarPorWhatsApp(notificacao) {
    // Enviar mensagem via WhatsApp
    await whatsappService.enviarMensagem(notificacao.destinatario, notificacao.conteudo);
  }

  async criarNotificacaoAgendamento(agendamentoId, tipo) {
    try {
      // Buscar dados do agendamento
      const agendamento = await Agendamento.findByPk(agendamentoId, {
        include: [
          { model: Cliente },
          { model: Servico },
          { model: Profissional }
        ]
      });
      
      if (!agendamento) {
        throw new Error(`Agendamento não encontrado: ${agendamentoId}`);
      }
      
      // Buscar template de notificação conforme o tipo
      // Aqui você buscaria o template específico do tipo de negócio
      
      // Montar conteúdo da notificação
      let conteudo = '';
      switch (tipo) {
        case 'CONFIRMACAO_AGENDAMENTO':
          conteudo = `Olá ${agendamento.Cliente.nome}, seu agendamento para ${agendamento.Servico.nome} foi confirmado para ${agendamento.dataHoraInicio.toLocaleDateString()} às ${agendamento.dataHoraInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
          break;
        case 'LEMBRETE_AGENDAMENTO':
          conteudo = `Olá ${agendamento.Cliente.nome}, lembramos que seu agendamento para ${agendamento.Servico.nome} está marcado para amanhã às ${agendamento.dataHoraInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
          break;
        case 'CANCELAMENTO':
          conteudo = `Olá ${agendamento.Cliente.nome}, seu agendamento para ${agendamento.Servico.nome} foi cancelado.`;
          break;
        default:
          throw new Error(`Tipo de notificação não suportado: ${tipo}`);
      }
      
      // Criar notificação
      const notificacao = await this.criarNotificacao({
        destinatario: agendamento.Cliente.telefone,
        tipo,
        conteudo,
        canal: 'WHATSAPP',
        status: 'PENDENTE',
        agendamentoId: agendamento.id
      });
      
      // Enviar notificação
      await this.enviarNotificacao(notificacao._id);
      
      return notificacao;
    } catch (error) {
      logger.error(`Erro ao criar notificação de agendamento ${agendamentoId}:`, error);
      throw error;
    }
  }
}

module.exports = new NotificacaoService();
```

## Fase 7: Testes e Validação (Semanas 13-14)

### 7.1 Configuração de Testes

#### jest.config.js

```javascript
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

### 7.2 Testes Unitários

#### tests/unit/services/notificacao.service.test.js

```javascript
const notificacaoService = require('../../../src/services/notificacao.service');
const { models: mongoModels } = require('../../../src/models/mongodb');
const whatsappService = require('../../../src/services/whatsapp.service');

// Mock dos modelos e serviços
jest.mock('../../../src/models/mongodb', () => ({
  models: {
    Notificacao: {
      create: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn()
    }
  }
}));

jest.mock('../../../src/services/whatsapp.service', () => ({
  enviarMensagem: jest.fn()
}));

describe('NotificacaoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('criarNotificacao', () => {
    it('deve criar uma notificação com sucesso', async () => {
      const dadosNotificacao = {
        destinatario: '5511999999999',
        tipo: 'CONFIRMACAO_AGENDAMENTO',
        conteudo: 'Teste de notificação',
        canal: 'WHATSAPP',
        status: 'PENDENTE'
      };

      const notificacaoMock = { ...dadosNotificacao, _id: '123456789' };
      mongoModels.Notificacao.create.mockResolvedValue(notificacaoMock);

      const resultado = await notificacaoService.criarNotificacao(dadosNotificacao);

      expect(mongoModels.Notificacao.create).toHaveBeenCalledWith(dadosNotificacao);
      expect(resultado).toEqual(notificacaoMock);
    });

    it('deve lançar erro se a criação falhar', async () => {
      const erro = new Error('Erro ao criar notificação');
      mongoModels.Notificacao.create.mockRejectedValue(erro);

      await expect(notificacaoService.criarNotificacao({})).rejects.toThrow(erro);
    });
  });

  describe('enviarNotificacao', () => {
    it('deve enviar uma notificação WhatsApp com sucesso', async () => {
      const notificacaoMock = {
        _id: '123456789',
        destinatario: '5511999999999',
        tipo: 'CONFIRMACAO_AGENDAMENTO',
        conteudo: 'Teste de notificação',
        canal: 'WHATSAPP',
        status: 'PENDENTE',
        save: jest.fn().mockResolvedValue(true)
      };

      mongoModels.Notificacao.findById.mockResolvedValue(notificacaoMock);
      whatsappService.enviarMensagem.mockResolvedValue({ success: true });

      const resultado = await notificacaoService.enviarNotificacao('123456789');

      expect(mongoModels.Notificacao.findById).toHaveBeenCalledWith('123456789');
      expect(whatsappService.enviarMensagem).toHaveBeenCalledWith('5511999999999', 'Teste de notificação');
      expect(notificacaoMock.status).toBe('ENVIADO');
      expect(notificacaoMock.dataEnvio).toBeInstanceOf(Date);
      expect(notificacaoMock.save).toHaveBeenCalled();
      expect(resultado).toEqual(notificacaoMock);
    });

    it('deve atualizar status para FALHA se o envio falhar', async () => {
      const notificacaoMock = {
        _id: '123456789',
        destinatario: '5511999999999',
        tipo: 'CONFIRMACAO_AGENDAMENTO',
        conteudo: 'Teste de notificação',
        canal: 'WHATSAPP',
        status: 'PENDENTE',
        save: jest.fn().mockResolvedValue(true)
      };

      const erro = new Error('Falha no envio');
      mongoModels.Notificacao.findById.mockResolvedValue(notificacaoMock);
      whatsappService.enviarMensagem.mockRejectedValue(erro);

      await expect(notificacaoService.enviarNotificacao('123456789')).rejects.toThrow(erro);

      expect(mongoModels.Notificacao.findByIdAndUpdate).toHaveBeenCalledWith('123456789', {
        status: 'FALHA',
        metadados: { erro: 'Falha no envio' }
      });
    });
  });
});
```

### 7.3 Testes de Integração

#### tests/integration/controllers/auth.controller.test.js

```javascript
const request = require('supertest');
const app = require('../../../src/app');
const { models } = require('../../../src/models/postgres');
const { sequelize } = require('../../../src/models/postgres');

const { Usuario } = models;

describe('AuthController', () => {
  beforeAll(async () => {
    // Sincronizar banco de dados de teste
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Fechar conexão com banco de dados
    await sequelize.close();
  });

  beforeEach(async () => {
    // Limpar tabela de usuários antes de cada teste
    await Usuario.destroy({ where: {} });
  });

  describe('POST /api/auth/registro', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const novoUsuario = {
        nome: 'Usuário Teste',
        email: 'usuario@teste.com',
        senha: 'senha123',
        telefone: '5511999999999',
        tipo: 'CLIENTE'
      };

      const response = await request(app)
        .post('/api/auth/registro')
        .send(novoUsuario)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.usuario).toHaveProperty('id');
      expect(response.body.data.usuario.nome).toBe(novoUsuario.nome);
      expect(response.body.data.usuario.email).toBe(novoUsuario.email);
      expect(response.body.data.usuario).not.toHaveProperty('senha');
      expect(response.body.data).toHaveProperty('token');

      // Verificar se o usuário foi salvo no banco
      const usuarioSalvo = await Usuario.findOne({ where: { email: novoUsuario.email } });
      expect(usuarioSalvo).not.toBeNull();
      expect(usuarioSalvo.nome).toBe(novoUsuario.nome);
    });

    it('deve retornar erro se o email já estiver em uso', async () => {
      // Criar usuário primeiro
      await Usuario.create({
        nome: 'Usuário Existente',
        email: 'existente@teste.com',
        senha: 'senha123',
        tipo: 'CLIENTE'
      });

      // Tentar registrar com o mesmo email
      const response = await request(app)
        .post('/api/auth/registro')
        .send({
          nome: 'Outro Usuário',
          email: 'existente@teste.com',
          senha: 'outrasenha',
          tipo: 'CLIENTE'
        })
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Email já está em uso');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Criar usuário para testes de login
      await Usuario.create({
        nome: 'Usuário Login',
        email: 'login@teste.com',
        senha: 'senha123',
        tipo: 'CLIENTE',
        ativo: true
      });
    });

    it('deve fazer login com sucesso', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@teste.com',
          senha: 'senha123'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.usuario).toHaveProperty('id');
      expect(response.body.data.usuario.email).toBe('login@teste.com');
      expect(response.body.data).toHaveProperty('token');
    });

    it('deve retornar erro com credenciais inválidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@teste.com',
          senha: 'senhaerrada'
        })
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Email ou senha inválidos');
    });

    it('deve retornar erro se o usuário estiver inativo', async () => {
      // Desativar o usuário
      await Usuario.update({ ativo: false }, { where: { email: 'login@teste.com' } });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@teste.com',
          senha: 'senha123'
        })
        .expect(403);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Usuário inativo');
    });
  });
});
```

## Fase 8: Implantação (Semanas 15-16)

### 8.1 Configuração de Produção

#### .env.production

```bash
# Ambiente
NODE_ENV=production
PORT=3001

# Banco de Dados PostgreSQL
DB_HOST=postgres
DB_PORT=5432
DB_NAME=saas_servicos
DB_USER=postgres
DB_PASS=postgres_production_password

# Banco de Dados MongoDB
MONGO_URI=mongodb://mongodb:27017/saas_servicos

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET=seu_segredo_jwt_producao_aqui
JWT_EXPIRATION=1d

# WhatsApp API
WHATSAPP_API_URL=https://api.whatsapp.com/v1
WHATSAPP_API_KEY=sua_chave_api_producao_aqui

# Stripe (Pagamentos)
STRIPE_SECRET_KEY=sua_chave_secreta_stripe_producao
STRIPE_WEBHOOK_SECRET=seu_segredo_webhook_stripe_producao
```

### 8.2 Docker para Produção

#### docker-compose.prod.yml

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: saas-backend
    restart: always
    environment:
      - NODE_ENV=production
    env_file:
      - ./backend/.env.production
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - mongodb
      - redis
    networks:
      - saas-network

  frontend:
    build:
      context: ./frontend-web
      dockerfile: Dockerfile.prod
    container_name: saas-frontend
    restart: always
    ports:
      - "3000:3000"
    networks:
      - saas-network

  postgres:
    image: postgres:14
    container_name: saas-postgres
    restart: always
    environment:
      POSTGRES_DB: saas_servicos
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres_production_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - saas-network

  mongodb:
    image: mongo:6
    container_name: saas-mongodb
    restart: always
    volumes:
      - mongodb_data:/data/db
    networks:
      - saas-network

  redis:
    image: redis:7
    container_name: saas-redis
    restart: always
    volumes:
      - redis_data:/data
    networks:
      - saas-network

  nginx:
    image: nginx:latest
    container_name: saas-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./nginx/ssl:/etc/nginx/ssl
      - ./nginx/www:/var/www/html
    depends_on:
      - backend
      - frontend
    networks:
      - saas-network

networks:
  saas-network:
    driver: bridge

volumes:
  postgres_data:
  mongodb_data:
  redis_data:
```

#### backend/Dockerfile.prod

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["node", "src/server.js"]
```

#### frontend-web/Dockerfile.prod

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
```

### 8.3 Configuração do Nginx

#### nginx/conf.d/default.conf

```nginx
server {
    listen 80;
    server_name saas-servicos.com www.saas-servicos.com;
    
    # Redirecionar para HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name saas-servicos.com www.saas-servicos.com;
    
    ssl_certificate /etc/nginx/ssl/saas-servicos.crt;
    ssl_certificate_key /etc/nginx/ssl/saas-servicos.key;
    
    # Frontend
    location / {
        proxy_pass http://frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Backend API
    location /api {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Considerações Finais

Este guia de implementação fornece as instruções necessárias para desenvolver o Sistema SaaS para Gestão de Prestação de Serviços. Seguindo as fases descritas, você terá uma aplicação completa, escalável e customizável para diferentes tipos de negócios.

### Próximos Passos

1. **Monitoramento**: Implementar ferramentas como Prometheus e Grafana para monitoramento da aplicação
2. **CI/CD**: Configurar pipelines de integração e entrega contínua com GitHub Actions ou GitLab CI
3. **Escalabilidade**: Implementar balanceamento de carga e estratégias de escalabilidade horizontal
4. **Segurança**: Realizar auditorias de segurança e implementar proteções adicionais
5. **Internacionalização**: Adicionar suporte para múltiplos idiomas

### Recursos Adicionais

- [Documentação do Node.js](https://nodejs.org/docs)
- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Sequelize](https://sequelize.org/master/)
- [Documentação do Mongoose](https://mongoosejs.com/docs/)
- [Documentação da API do WhatsApp Business](https://developers.facebook.com/docs/whatsapp/api/reference)
- [Documentação do Stripe](https://stripe.com/docs/api)
