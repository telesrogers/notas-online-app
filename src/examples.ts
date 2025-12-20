/**
 * EXEMPLOS DE USO DOS SERVIÇOS
 * 
 * Este arquivo contém exemplos práticos de como usar cada serviço.
 * Use como referência ao implementar suas telas.
 */

import {
  authService,
  gradeService,
  schoolService,
  studentService,
  subjectService,
  userService
} from './services';

// ============================================
// 1. AUTENTICAÇÃO
// ============================================

async function exemploLogin() {
  try {
    const response = await authService.login({
      email: 'usuario@email.com',
      password: 'senha123'
    });
    
    console.log('Login bem-sucedido!');
    console.log('Usuário:', response.user);
    console.log('Token:', response.token);
    // Token é salvo automaticamente no AsyncStorage
  } catch (error) {
    console.error('Erro no login:', error);
  }
}

async function exemploRegistro() {
  try {
    const response = await authService.register({
      name: 'Novo Usuário',
      email: 'novo@email.com',
      password: 'senha123',
      password_confirmation: 'senha123',
      user_type: 'teacher',
      school_id: 'id-da-escola',
      address: 'Rua Exemplo, 123',
      phone: '(11) 98765-4321'
    });
    
    console.log('Registro bem-sucedido!');
    console.log('Usuário:', response.user);
  } catch (error) {
    console.error('Erro no registro:', error);
  }
}

async function exemploLogout() {
  try {
    await authService.logout();
    console.log('Logout realizado com sucesso!');
    // Token é removido automaticamente do AsyncStorage
  } catch (error) {
    console.error('Erro no logout:', error);
  }
}

async function exemploPerfil() {
  try {
    const user = await authService.getProfile();
    console.log('Perfil do usuário:', user);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
  }
}

// ============================================
// 2. ESCOLAS
// ============================================

async function exemploCriarEscola() {
  try {
    const school = await schoolService.create({
      name: 'Escola Teste',
      email: 'escola@email.com',
      address: 'Av. Principal, 100',
      phone: '(11) 3333-4444'
    });
    
    console.log('Escola criada:', school);
    return school.id;
  } catch (error) {
    console.error('Erro ao criar escola:', error);
  }
}

async function exemploListarEscolas() {
  try {
    const schools = await schoolService.getAll();
    console.log('Total de escolas:', schools.length);
    schools.forEach(school => {
      console.log(`- ${school.name} (${school.email})`);
    });
  } catch (error) {
    console.error('Erro ao listar escolas:', error);
  }
}

async function exemploAtualizarEscola() {
  try {
    const school = await schoolService.update('id-da-escola', {
      name: 'Escola Atualizada',
      phone: '(11) 4444-5555'
    });
    
    console.log('Escola atualizada:', school);
  } catch (error) {
    console.error('Erro ao atualizar escola:', error);
  }
}

// ============================================
// 3. ALUNOS
// ============================================

async function exemploCriarAluno() {
  try {
    const student = await studentService.create({
      name: 'João Silva',
      email: 'joao@email.com',
      registration_number: '2024001',
      phone: '(11) 98765-4321'
    });
    
    console.log('Aluno criado:', student);
    return student.id;
  } catch (error) {
    console.error('Erro ao criar aluno:', error);
  }
}

async function exemploListarAlunos() {
  try {
    const students = await studentService.getAll();
    console.log('Total de alunos:', students.length);
    students.forEach(student => {
      console.log(`- ${student.name} (${student.registration_number})`);
    });
  } catch (error) {
    console.error('Erro ao listar alunos:', error);
  }
}

async function exemploVerAluno() {
  try {
    const student = await studentService.getById('id-do-aluno');
    console.log('Aluno:', student);
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
  }
}

async function exemploAtualizarAluno() {
  try {
    const student = await studentService.update('id-do-aluno', {
      name: 'João Silva Santos',
      phone: '(11) 99999-9999'
    });
    
    console.log('Aluno atualizado:', student);
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
  }
}

// ============================================
// 4. DISCIPLINAS
// ============================================

async function exemploCriarDisciplina() {
  try {
    const subject = await subjectService.create({
      name: 'Matemática',
      code: 'MAT101',
      number_of_grades: 3,
      passing_average: 7.0,
      recovery_average: 5.0,
      teacher_id: 'id-do-professor'
    });
    
    console.log('Disciplina criada:', subject);
    return subject.id;
  } catch (error) {
    console.error('Erro ao criar disciplina:', error);
  }
}

async function exemploListarDisciplinas() {
  try {
    const subjects = await subjectService.getAll();
    console.log('Total de disciplinas:', subjects.length);
    subjects.forEach(subject => {
      console.log(`- ${subject.name} (${subject.code})`);
    });
  } catch (error) {
    console.error('Erro ao listar disciplinas:', error);
  }
}

async function exemploAtualizarDisciplina() {
  try {
    const subject = await subjectService.update('id-da-disciplina', {
      name: 'Matemática Avançada',
      passing_average: 7.5
    });
    
    console.log('Disciplina atualizada:', subject);
  } catch (error) {
    console.error('Erro ao atualizar disciplina:', error);
  }
}

// ============================================
// 5. NOTAS
// ============================================

async function exemploCriarNota() {
  try {
    const grade = await gradeService.create({
      student_id: 'id-do-aluno',
      subject_id: 'id-da-disciplina',
      scores: [8.5, 7.0]
    });
    
    console.log('Nota criada:', grade);
    console.log('Média:', grade.average);
    console.log('Status:', grade.status);
    return grade.id;
  } catch (error) {
    console.error('Erro ao criar nota:', error);
  }
}

async function exemploListarTodasNotas() {
  try {
    const grades = await gradeService.getAll();
    console.log('Total de notas:', grades.length);
    grades.forEach(grade => {
      console.log(`- Média: ${grade.average} | Status: ${grade.status}`);
    });
  } catch (error) {
    console.error('Erro ao listar notas:', error);
  }
}

async function exemploListarNotasPorAluno() {
  try {
    const grades = await gradeService.getAll({ 
      student_id: 'id-do-aluno' 
    });
    
    console.log(`Notas do aluno: ${grades.length}`);
    grades.forEach(grade => {
      console.log(`- Notas: ${grade.scores.join(', ')} | Média: ${grade.average}`);
    });
  } catch (error) {
    console.error('Erro ao listar notas do aluno:', error);
  }
}

async function exemploListarNotasPorDisciplina() {
  try {
    const grades = await gradeService.getAll({ 
      subject_id: 'id-da-disciplina' 
    });
    
    console.log(`Notas da disciplina: ${grades.length}`);
  } catch (error) {
    console.error('Erro ao listar notas da disciplina:', error);
  }
}

async function exemploAdicionarNota() {
  try {
    const grade = await gradeService.addScore('id-da-nota', {
      add_score: 9.0
    });
    
    console.log('Nova nota adicionada!');
    console.log('Notas atuais:', grade.scores);
    console.log('Nova média:', grade.average);
  } catch (error) {
    console.error('Erro ao adicionar nota:', error);
  }
}

async function exemploAtualizarNotaEspecifica() {
  try {
    // Atualizar a primeira nota (índice 0)
    const grade = await gradeService.updateScore('id-da-nota', {
      score_index: 0,
      update_score: 8.0
    });
    
    console.log('Nota atualizada!');
    console.log('Notas atuais:', grade.scores);
    console.log('Nova média:', grade.average);
  } catch (error) {
    console.error('Erro ao atualizar nota:', error);
  }
}

async function exemploAtualizarTodasNotas() {
  try {
    const grade = await gradeService.updateAllScores('id-da-nota', {
      scores: [8.0, 7.5, 9.0]
    });
    
    console.log('Todas as notas atualizadas!');
    console.log('Novas notas:', grade.scores);
    console.log('Nova média:', grade.average);
  } catch (error) {
    console.error('Erro ao atualizar notas:', error);
  }
}

// ============================================
// 6. USUÁRIOS
// ============================================

async function exemploListarUsuarios() {
  try {
    const users = await userService.getAll();
    console.log('Total de usuários:', users.length);
    users.forEach(user => {
      console.log(`- ${user.name} (${user.user_type})`);
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
  }
}

async function exemploAtualizarUsuario() {
  try {
    const user = await userService.update('id-do-usuario', {
      name: 'Nome Atualizado',
      address: 'Novo Endereço, 456'
    });
    
    console.log('Usuário atualizado:', user);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
  }
}

// ============================================
// 7. FLUXO COMPLETO DE EXEMPLO
// ============================================

async function exemploFluxoCompleto() {
  try {
    console.log('=== INICIANDO FLUXO COMPLETO ===\n');
    
    // 1. Criar escola
    console.log('1. Criando escola...');
    const schoolId = await exemploCriarEscola();
    
    // 2. Registrar usuário
    console.log('\n2. Registrando usuário...');
    await exemploRegistro();
    
    // 3. Fazer login
    console.log('\n3. Fazendo login...');
    await exemploLogin();
    
    // 4. Criar aluno
    console.log('\n4. Criando aluno...');
    const studentId = await exemploCriarAluno();
    
    // 5. Criar disciplina
    console.log('\n5. Criando disciplina...');
    const subjectId = await exemploCriarDisciplina();
    
    // 6. Criar nota
    console.log('\n6. Criando nota...');
    const gradeId = await exemploCriarNota();
    
    // 7. Adicionar mais uma nota
    console.log('\n7. Adicionando nota...');
    await exemploAdicionarNota();
    
    // 8. Listar notas do aluno
    console.log('\n8. Listando notas do aluno...');
    await exemploListarNotasPorAluno();
    
    console.log('\n=== FLUXO COMPLETO CONCLUÍDO ===');
  } catch (error) {
    console.error('Erro no fluxo:', error);
  }
}

// ============================================
// 8. TRATAMENTO DE ERROS
// ============================================

async function exemploTratamentoErros() {
  try {
    await studentService.getById('id-inexistente');
  } catch (error: any) {
    if (error.response) {
      // Erro da API
      console.error('Status:', error.response.status);
      console.error('Mensagem:', error.response.data.error);
      
      if (error.response.status === 404) {
        console.log('Aluno não encontrado');
      } else if (error.response.status === 401) {
        console.log('Não autorizado - faça login novamente');
      } else if (error.response.status === 422) {
        console.log('Erro de validação:', error.response.data.errors);
      }
    } else if (error.request) {
      // Erro de conexão
      console.error('Erro de conexão:', error.message);
    } else {
      // Outro erro
      console.error('Erro:', error.message);
    }
  }
}

// Exportar exemplos para uso
export {
  exemploAdicionarNota,
  exemploAtualizarNotaEspecifica, exemploCriarAluno, exemploCriarDisciplina, exemploCriarEscola, exemploCriarNota, exemploFluxoCompleto, exemploListarAlunos, exemploListarDisciplinas, exemploListarEscolas, exemploListarNotasPorAluno, exemploListarTodasNotas, exemploLogin, exemploLogout,
  exemploPerfil, exemploRegistro, exemploTratamentoErros
};

