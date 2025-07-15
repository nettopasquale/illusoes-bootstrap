
# Ilusões Industriais 🎴

**Ilusões Industriais** é uma plataforma web fullstack desenvolvida como projeto de portfólio para estágio em Análise e Desenvolvimento de Sistemas. O sistema simula um portal de notícias, artigos, eventos e campeonatos focado no universo de card games, permitindo interação entre usuários e publicação de conteúdos dinâmicos.

## 🚀 Funcionalidades

- ✅ Login e cadastro de usuários com autenticação JWT
- 📝 Criação e edição de **notícias**, **artigos**, **eventos** e **campeonatos**
- 🧑‍💼 Dashboard exclusiva para o usuário gerenciar seus conteúdos
- 🔒 Rotas privadas para usuários autenticados
- 📸 Upload de imagem (Multer) para avatar e thumbnail de conteúdos
- 📅 Campo de data de evento com seletor intuitivo
- 🏷️ Sistema de tags para classificar os conteúdos
- 🔍 Página de listagem com filtro e busca
- 🧹 Edição e exclusão dos conteúdos criados pelo usuário
- 🎨 Interface responsiva com **React-Bootstrap** e design baseado em Figma
- 🗃️ Estrutura backend com Express.js e MongoDB

## 🛠️ Tecnologias Utilizadas

### Frontend
- React.js (Vite)
- React-Bootstrap
- React Router DOM
- React-Quill (editor de texto avançado)
- React-Select (tags e seleção de tipo)
- Axios

### Backend
- Node.js com Express.js
- MongoDB com Mongoose
- Multer (upload de arquivos)
- Dotenv
- JsonWebToken (JWT)

## 📦 Organização

- `frontend/` → Interface do usuário
- `backend/` → API e lógica de servidor
- `models/` → Schemas de banco de dados (User, Conteúdo, Tags etc)
- `routes/` → Arquivos de roteamento do backend
- `controllers/` → Funções de controle e lógica de negócios

## 🔐 Autenticação

- Registro e login com persistência via token JWT
- Redirecionamento automático se o token expirar
- Modais de feedback visual para login e falhas

## 💡 Diferenciais

- Estrutura escalável: permite extensão para anúncios, coleções e marketplace
- Uso de submenus dinâmicos para facilitar navegação
- Separação de modelos e rotas para conteúdos por tipo (notícia, artigo, evento, campeonato)

## 📁 Observação

Este projeto está em constante desenvolvimento e faz parte de um plano maior de aprendizado e demonstração prática de habilidades fullstack para fins acadêmicos e profissionais.

---

Desenvolvido por **Pasquale Milone Netto** como projeto de portfólio pessoal 🎓
