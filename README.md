# School App - Sistema de Gerenciamento Escolar 🎓

Aplicativo React Native completo para gerenciamento escolar com integração à **API Notas Online**.

## ✨ Features

- 🔐 Autenticação JWT completa
- 🏫 Gerenciamento de Escolas
- 👨‍🎓 Cadastro de Alunos
- 📚 Gerenciamento de Disciplinas
- 📊 Sistema de Notas e Médias
- 👥 Gestão de Usuários (Admin/Professor)

## 🚀 Quick Start

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar API

Copie o arquivo `.env.example` para `.env` e configure a URL:

```bash
cp .env.example .env
```

Edite o `.env`:

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
# Para Android Emulator: http://10.0.2.2:3000
```

### 3. Iniciar o app

```bash
npx expo start
```

## 📦 Serviços da API

Todos os serviços necessários estão **100% implementados e prontos** em `src/`:

- ✅ **authService** - Login, registro, logout, perfil
- ✅ **schoolService** - CRUD de escolas
- ✅ **studentService** - CRUD de alunos  
- ✅ **subjectService** - CRUD de disciplinas
- ✅ **gradeService** - CRUD de notas + operações especiais
- ✅ **userService** - CRUD de usuários

## 🧪 Tela de Testes

Uma tela completa de testes está disponível em `/test` para validar a integração:

- ✅ Login com email e senha
- ✅ Exibição de dados do usuário
- ✅ Listagem de alunos
- ✅ Logout

**Acesse**: Navegue para `/test` no app ou veja [TELA_TESTES.md](TELA_TESTES.md)

## 📚 Documentação

| Arquivo | Descrição |
|---------|-----------|
| 📘 **[START.md](START.md)** | **⭐ COMECE AQUI** - Guia visual rápido |
| 🧪 **[TELA_TESTES.md](TELA_TESTES.md)** | Como usar a tela de testes |
| ⚙️ **[ENV.md](ENV.md)** | Configuração de variáveis de ambiente |
| 📗 **[INSTALACAO.md](INSTALACAO.md)** | Guia de instalação passo a passo |
| 📙 **[ESTRUTURA.md](ESTRUTURA.md)** | Visão geral da arquitetura |
| 📕 **[src/README.md](src/README.md)** | Documentação completa dos serviços |
| 📓 **[src/examples.ts](src/examples.ts)** | 15+ exemplos práticos de uso |
| 📔 **[src/tests.ts](src/tests.ts)** | Suite de testes de validação |
| 📒 **[COMANDOS.md](COMANDOS.md)** | Comandos úteis para desenvolvimento |
| 📖 **[RESUMO.md](RESUMO.md)** | Resumo executivo do projeto |
| 📋 **[CHANGELOG.md](CHANGELOG.md)** | Histórico de mudanças |

## 🎯 Uso Rápido

```typescript
import { authService, studentService, useAuth } from '@/src';

// Login
await authService.login({ 
  email: 'usuario@email.com', 
  password: 'senha123' 
});

// Listar alunos
const students = await studentService.getAll();

// Usar hook de autenticação
function MyComponent() {
  const { user, signIn, signOut, isAuthenticated } = useAuth();
  // ...
}
```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
