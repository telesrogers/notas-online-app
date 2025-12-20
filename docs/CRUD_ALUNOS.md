# CRUD Completo de Alunos - Tela de Testes

## 📋 Visão Geral

A tela de testes (`app/test.tsx`) agora possui um **CRUD completo** para gerenciamento de alunos, incluindo:

- ✅ **Create** - Criar novo aluno
- ✅ **Read** - Listar todos os alunos e visualizar detalhes de um aluno específico
- ✅ **Update** - Editar informações de um aluno existente
- ✅ **Delete** - Deletar um aluno com confirmação

## 🎨 Interface do Usuário

### 1. Botões Principais

Na seção de Alunos, você encontrará dois botões principais:

- **📋 Listar** - Carrega e exibe todos os alunos
- **➕ Novo** - Abre o formulário para criar um novo aluno

### 2. Formulário de Criação/Edição

Quando você clica em "Novo" ou "Editar", um formulário aparece com os seguintes campos:

- **Nome completo** (obrigatório)
- **Email** (obrigatório)
- **Matrícula** (obrigatório)
- **Telefone** (opcional)

**Botões do formulário:**
- **➕ Criar / 💾 Salvar** - Submete o formulário
- **❌ Cancelar** - Fecha o formulário sem salvar

### 3. Lista de Alunos

Após clicar em "Listar", os alunos são exibidos em cards com:

- **Número da ordem** (#1, #2, etc.)
- **Nome do aluno**
- **Email** (📧)
- **Matrícula** (🎓)
- **Telefone** (📱) - se disponível

**Botões de ação em cada card:**
- **👁️ Ver** - Visualiza detalhes completos do aluno
- **✏️ Editar** - Abre o formulário preenchido com os dados do aluno
- **🗑️** - Deleta o aluno (com confirmação)

### 4. Detalhes do Aluno

Ao clicar em "Ver", uma tela detalhada mostra:

- Nome
- Email
- Matrícula
- Telefone (se disponível)
- ID do registro
- Data de criação (formatada em pt-BR)
- Data de atualização (formatada em pt-BR)

**Botões de ação:**
- **✏️ Editar** - Abre o formulário para editar
- **🗑️ Deletar** - Deleta o aluno (com confirmação)
- **⬅️ Voltar para Lista** - Retorna à lista de alunos

## 🔧 Funcionalidades Implementadas

### 1. Criar Aluno (`handleCreateStudent`)

```typescript
const handleCreateStudent = async () => {
  // Validação dos campos obrigatórios
  if (!studentName || !studentEmail || !studentRegistration) {
    Alert.alert('Erro', 'Preencha nome, email e matrícula');
    return;
  }

  // Chamada à API
  await studentService.create({
    name: studentName,
    email: studentEmail,
    registration_number: studentRegistration,
    phone: studentPhone || undefined,
  });
  
  // Feedback e atualização da lista
  Alert.alert('Sucesso', 'Aluno criado com sucesso!');
  clearForm();
  handleLoadStudents();
};
```

### 2. Listar Alunos (`handleLoadStudents`)

```typescript
const handleLoadStudents = async () => {
  const data = await studentService.getAll();
  setStudents(data);
  Alert.alert('Sucesso', `${data.length} aluno(s) carregado(s)`);
};
```

### 3. Ver Detalhes de um Aluno (`handleViewStudent`)

```typescript
const handleViewStudent = async (id: string) => {
  const student = await studentService.getById(id);
  setSelectedStudent(student);
};
```

### 4. Editar Aluno (`handleUpdateStudent`)

```typescript
const handleUpdateStudent = async () => {
  // Validação
  if (!editingStudent || !studentName || !studentEmail || !studentRegistration) {
    return;
  }

  // Chamada à API
  await studentService.update(editingStudent.id, {
    name: studentName,
    email: studentEmail,
    registration_number: studentRegistration,
    phone: studentPhone || undefined,
  });
  
  // Feedback e atualização
  Alert.alert('Sucesso', 'Aluno atualizado com sucesso!');
  clearForm();
  handleLoadStudents();
};
```

### 5. Deletar Aluno (`handleDeleteStudent`)

```typescript
const handleDeleteStudent = async (id: string, name: string) => {
  Alert.alert(
    'Confirmar exclusão',
    `Deseja realmente deletar ${name}?`,
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: async () => {
          await studentService.delete(id);
          Alert.alert('Sucesso', 'Aluno deletado com sucesso!');
          setSelectedStudent(null);
          handleLoadStudents();
        },
      },
    ]
  );
};
```

### 6. Funções Auxiliares

#### Abrir Formulário de Edição
```typescript
const openEditForm = (student: Student) => {
  setEditingStudent(student);
  setStudentName(student.name);
  setStudentEmail(student.email);
  setStudentRegistration(student.registration_number);
  setStudentPhone(student.phone || '');
  setShowForm(true);
  setSelectedStudent(null);
};
```

#### Limpar Formulário
```typescript
const clearForm = () => {
  setShowForm(false);
  setEditingStudent(null);
  setStudentName('');
  setStudentEmail('');
  setStudentRegistration('');
  setStudentPhone('');
};
```

## 📊 Estados Gerenciados

```typescript
// Lista de alunos
const [students, setStudents] = useState<Student[]>([]);

// Loading
const [loadingStudents, setLoadingStudents] = useState(false);

// Controle do formulário
const [showForm, setShowForm] = useState(false);
const [editingStudent, setEditingStudent] = useState<Student | null>(null);

// Campos do formulário
const [studentName, setStudentName] = useState('');
const [studentEmail, setStudentEmail] = useState('');
const [studentRegistration, setStudentRegistration] = useState('');
const [studentPhone, setStudentPhone] = useState('');

// Detalhes de um aluno
const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
```

## 🎯 Fluxos de Uso

### Criar um Novo Aluno

1. Faça login na tela de testes
2. Clique no botão **➕ Novo**
3. Preencha os campos obrigatórios (Nome, Email, Matrícula)
4. Opcionalmente, adicione um telefone
5. Clique em **➕ Criar**
6. Confirme o sucesso no alerta
7. A lista será atualizada automaticamente

### Listar Alunos

1. Clique no botão **📋 Listar**
2. Os alunos serão carregados e exibidos em cards
3. Cada card mostra informações básicas e botões de ação

### Ver Detalhes de um Aluno

1. Na lista de alunos, clique em **👁️ Ver**
2. Uma tela detalhada será exibida com todas as informações
3. Você pode editar, deletar ou voltar para a lista

### Editar um Aluno

**Opção 1: Da lista**
1. Na lista de alunos, clique em **✏️ Editar** no card do aluno
2. O formulário será aberto com os dados preenchidos

**Opção 2: Da tela de detalhes**
1. Clique em **👁️ Ver** para abrir os detalhes
2. Clique em **✏️ Editar**
3. O formulário será aberto com os dados preenchidos

**Continuar:**
3. Modifique os campos desejados
4. Clique em **💾 Salvar**
5. Confirme o sucesso no alerta

### Deletar um Aluno

**Opção 1: Da lista**
1. Na lista de alunos, clique em **🗑️** no card do aluno
2. Confirme a exclusão no alerta

**Opção 2: Da tela de detalhes**
1. Clique em **👁️ Ver** para abrir os detalhes
2. Clique em **🗑️ Deletar**
3. Confirme a exclusão no alerta

## 🎨 Estilos Personalizados

### Cores de Botões

- **Primary (Azul)**: `#007AFF` - Ver detalhes
- **Success (Verde)**: `#34C759` - Criar, Editar
- **Danger (Vermelho)**: `#FF3B30` - Deletar
- **Secondary (Cinza)**: Listar, Cancelar

### Containers Especiais

- **Formulário**: Fundo azul claro (`#f0f8ff`) com borda azul
- **Detalhes**: Fundo laranja claro (`#fff5e6`) com borda laranja
- **Cards de Aluno**: Fundo cinza claro com borda esquerda azul

## ✅ Validações

### Campos Obrigatórios
- Nome
- Email
- Matrícula

### Confirmação de Exclusão
- Alert com opção "Cancelar" e "Deletar"
- Estilo destrutivo para reforçar a ação

### Loading States
- Botões desabilitados durante operações
- ActivityIndicator em operações assíncronas
- Inputs desabilitados durante loading

## 🔄 Atualização Automática

Após operações de:
- **Criar aluno** → Lista é recarregada
- **Editar aluno** → Lista é recarregada
- **Deletar aluno** → Lista é recarregada

## 📱 Experiência do Usuário

### Feedback Visual
- ✅ Alertas de sucesso
- ❌ Alertas de erro com mensagens detalhadas
- 🔄 Loading indicators durante operações
- 🎨 Cores diferenciadas para cada tipo de ação

### Navegação Intuitiva
- Botões claros com emojis descritivos
- Opções de voltar em todas as telas
- Cancelamento de formulários sem perda de dados

### Responsividade
- Layout adaptável com `flexDirection: 'row'`
- Botões com tamanhos adequados para toque
- Espaçamento adequado entre elementos

## 🚀 Próximos Passos (Sugestões)

1. **Paginação** - Para listas grandes de alunos
2. **Busca/Filtro** - Pesquisar alunos por nome, email ou matrícula
3. **Ordenação** - Ordenar por nome, matrícula, data de criação
4. **Refresh Manual** - Pull-to-refresh na lista
5. **Cache Local** - Persistir dados com AsyncStorage
6. **Validação Avançada** - Email válido, formato de telefone
7. **Foto do Aluno** - Upload e exibição de foto
8. **Importação em Massa** - Importar múltiplos alunos via CSV

## 📝 Notas Técnicas

- Todos os métodos usam `async/await` para operações assíncronas
- Tratamento de erros com `try/catch`
- TypeScript para type safety
- Componentes React Native nativos (View, Text, TouchableOpacity, etc.)
- Serviços centralizados (`studentService`)
- Estado local com `useState`

---

**Desenvolvido seguindo as melhores práticas de React Native e UX/UI** 🚀
