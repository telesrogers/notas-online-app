# Serviços da API Notas Online

Este diretório contém todos os serviços necessários para consumir a API Notas Online.

## 📁 Estrutura

```
src/
├── services/          # Serviços da API
│   ├── api.ts        # Cliente Axios com interceptadores
│   ├── auth.service.ts
│   ├── school.service.ts
│   ├── student.service.ts
│   ├── subject.service.ts
│   ├── grade.service.ts
│   ├── user.service.ts
│   └── index.ts      # Exportações
├── types/            # Tipos TypeScript
│   ├── auth.types.ts
│   ├── school.types.ts
│   ├── student.types.ts
│   ├── subject.types.ts
│   ├── grade.types.ts
│   ├── user.types.ts
│   └── index.ts      # Exportações
├── storage/          # Gerenciamento de storage
│   └── tokenStorage.ts
├── contexts/         # Context API
│   └── AuthContext.tsx
└── hooks/            # Hooks customizados
    └── useAuth.ts
```

## 🚀 Como Usar

### 1. Instalar Dependências

```bash
npm install axios @react-native-async-storage/async-storage
```

### 2. Importar e Usar os Serviços

```typescript
import { authService, studentService, gradeService } from '@/src/services';

// Login
const response = await authService.login({
  email: 'usuario@email.com',
  password: 'senha123'
});

// Listar alunos
const students = await studentService.getAll();

// Criar nota
const grade = await gradeService.create({
  student_id: '123',
  subject_id: '456',
  scores: [8.5, 7.0, 9.0]
});
```

### 3. Usar o Hook de Autenticação

```typescript
import { useAuth } from '@/src/hooks/useAuth';

function MyComponent() {
  const { user, signIn, signOut, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn({
        email: 'usuario@email.com',
        password: 'senha123'
      });
      // Login bem-sucedido
    } catch (error) {
      // Tratar erro
    }
  };

  return (
    <View>
      {isAuthenticated ? (
        <Text>Bem-vindo, {user?.name}</Text>
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
}
```

## 📋 Serviços Disponíveis

### authService
- `login(credentials)` - Fazer login
- `register(userData)` - Registrar usuário
- `logout()` - Fazer logout
- `getProfile()` - Obter perfil atual
- `isAuthenticated()` - Verificar se está autenticado
- `getCurrentUser()` - Obter usuário do storage

### schoolService
- `create(schoolData)` - Criar escola
- `getAll()` - Listar escolas
- `getById(id)` - Obter escola específica
- `update(id, schoolData)` - Atualizar escola
- `delete(id)` - Deletar escola

### studentService
- `create(studentData)` - Criar aluno
- `getAll()` - Listar alunos
- `getById(id)` - Obter aluno específico
- `update(id, studentData)` - Atualizar aluno
- `delete(id)` - Deletar aluno

### subjectService
- `create(subjectData)` - Criar disciplina
- `getAll()` - Listar disciplinas
- `getById(id)` - Obter disciplina específica
- `update(id, subjectData)` - Atualizar disciplina
- `delete(id)` - Deletar disciplina

### gradeService
- `create(gradeData)` - Criar registro de notas
- `getAll(filters?)` - Listar notas (com filtros opcionais)
- `getById(id)` - Obter nota específica
- `addScore(id, scoreData)` - Adicionar uma nota
- `updateScore(id, scoreData)` - Atualizar nota específica
- `updateAllScores(id, scoresData)` - Atualizar todas as notas
- `delete(id)` - Deletar registro de notas

### userService
- `getAll()` - Listar usuários (apenas admin)
- `getById(id)` - Obter usuário específico
- `update(id, userData)` - Atualizar usuário
- `delete(id)` - Deletar usuário

## 🔐 Autenticação

O token JWT é gerenciado automaticamente:
- Salvo no AsyncStorage após login/registro
- Adicionado automaticamente em todas as requisições
- Removido automaticamente em caso de erro 401

## 🌐 Configuração da API

Para alterar a URL base da API, edite o arquivo `src/services/api.ts`:

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000'  // Desenvolvimento
  : 'https://sua-api-producao.com';  // Produção
```

### URLs para Desenvolvimento

- **iOS Simulator**: `http://localhost:3000`
- **Android Emulator**: `http://10.0.2.2:3000`
- **Dispositivo Físico**: `http://SEU_IP_LOCAL:3000` (ex: `http://192.168.1.100:3000`)

## ⚠️ Importante

1. Todos os dados devem ser enviados dentro de uma chave com o nome da entidade:
   ```typescript
   // ✅ CORRETO
   await api.post('/students', { student: { name: "João" } });
   
   // ❌ ERRADO
   await api.post('/students', { name: "João" });
   ```

2. O token expira em 48 horas

3. Endpoints públicos (não requerem autenticação):
   - POST `/schools` - Criar escola
   - POST `/users` - Criar usuário
   - POST `/users/login` - Login

4. Todos os outros endpoints requerem autenticação

## 🎯 Exemplo Completo

```typescript
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Button, Alert } from 'react-native';
import { studentService } from '@/src/services';
import { Student } from '@/src/types';

export function StudentsScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAll();
      setStudents(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os alunos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await studentService.delete(id);
      Alert.alert('Sucesso', 'Aluno deletado');
      loadStudents(); // Recarregar lista
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível deletar o aluno');
    }
  };

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>{item.email}</Text>
            <Button 
              title="Deletar" 
              onPress={() => handleDelete(item.id)} 
            />
          </View>
        )}
      />
    </View>
  );
}
```

## 🔄 Tratamento de Erros

```typescript
import { AxiosError } from 'axios';

try {
  await someService.someMethod();
} catch (error) {
  if (error instanceof AxiosError) {
    // Erro 401 - Token inválido (já tratado no interceptor)
    if (error.response?.status === 401) {
      Alert.alert('Sessão expirada', 'Faça login novamente');
    }
    // Erro 403 - Sem permissão
    else if (error.response?.status === 403) {
      Alert.alert('Acesso negado', error.response.data.error);
    }
    // Erro 422 - Validação
    else if (error.response?.status === 422) {
      const errors = error.response.data.errors;
      Alert.alert('Erro de validação', errors.join('\n'));
    }
    // Outros erros
    else {
      Alert.alert('Erro', error.response?.data?.error || 'Algo deu errado');
    }
  }
}
```

## 📝 Filtros no Serviço de Notas

```typescript
// Listar todas as notas
const allGrades = await gradeService.getAll();

// Filtrar por aluno
const studentGrades = await gradeService.getAll({ 
  student_id: '123' 
});

// Filtrar por disciplina
const subjectGrades = await gradeService.getAll({ 
  subject_id: '456' 
});

// Filtrar por aluno E disciplina
const specificGrades = await gradeService.getAll({ 
  student_id: '123',
  subject_id: '456' 
});
```

## 🎨 Boas Práticas

1. Sempre use try/catch ao chamar serviços
2. Mostre feedback visual (loading, sucesso, erro)
3. Valide inputs antes de enviar
4. Use TypeScript para type safety
5. Trate erros de forma amigável para o usuário
6. Não exponha informações sensíveis nos logs de produção

---

**Desenvolvido com ❤️ seguindo as melhores práticas de React Native e TypeScript**
