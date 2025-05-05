# 🖥️ Frontend - SuperService

Este diretório contém a interface web do projeto **SuperService**, desenvolvida com **ReactJS** e **styled-components**.

## 📦 Tecnologias Utilizadas

- [ReactJS](https://reactjs.org/)
- [Vite](https://vitejs.dev/) — como bundler
- [TypeScript](https://www.typescriptlang.org/)
- [styled-components](https://styled-components.com/) — estilização com CSS-in-JS
- [React Router v6](https://reactrouter.com/en/main) — navegação entre páginas

## 📁 Estrutura de Diretórios

```bash
frontend/
├── public/
├── src/
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   ├── components/
│   ├── styles/
│   ├── App.tsx
│   ├── main.tsx
├── vite.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 Páginas Criadas

### 🔐 Login (`/login`)

- Formulário de autenticação com campos de email e senha
- Validação básica dos campos
- Redirecionamento para o Dashboard após login (simulado)

### 📝 Cadastro (`/register`)

- Formulário de registro de novo usuário
- Campos: nome, email, senha, confirmar senha
- Validação de campos obrigatórios e senhas iguais

### 🧾 Dashboard (`/dashboard`)

- Tela principal após login
- Exibição de informações do usuário logado (simulado)
- Menu lateral de navegação (caso implementado)

## 🚀 Como Rodar o Projeto

1. Navegue até a pasta `frontend/`:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor local:
   ```bash
   npm run dev
   ```

4. Acesse em: [http://localhost:5173](http://localhost:5173)

## 📌 Observações

- Este frontend ainda não está integrado com backend real — as funcionalidades de login e cadastro são apenas visuais.
- Para ver os estilos, verifique o uso de `styled-components` em cada componente.

---
