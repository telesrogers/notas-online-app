/**
 * TESTES RÁPIDOS DOS SERVIÇOS
 * 
 * Use estas funções para validar se os serviços estão funcionando corretamente.
 * Execute no console ou em uma tela de testes.
 */

import {
  authService,
  gradeService,
  schoolService,
  studentService,
  subjectService
} from './services';

// ============================================
// CONFIGURAÇÃO DE TESTE
// ============================================

const TEST_CONFIG = {
  // Ajuste estes valores conforme sua API
  testEmail: 'teste@exemplo.com',
  testPassword: 'senha123',
  schoolId: '', // Será preenchido após criar escola
  userId: '', // Será preenchido após criar usuário
  studentId: '', // Será preenchido após criar aluno
  subjectId: '', // Será preenchido após criar disciplina
  gradeId: '', // Será preenchido após criar nota
};

// ============================================
// TESTES DE AUTENTICAÇÃO
// ============================================

export async function testarConexaoAPI() {
  console.log('🔍 Testando conexão com API...');
  try {
    // Tentar uma requisição simples
    const schools = await schoolService.getAll();
    console.log('✅ Conexão OK! API respondendo.');
    return true;
  } catch (error: any) {
    if (error.message.includes('Network Error')) {
      console.error('❌ Erro de conexão. Verifique:');
      console.error('   1. API está rodando?');
      console.error('   2. URL correta em src/services/api.ts?');
      console.error('   3. Android Emulator usa http://10.0.2.2:3000');
    } else if (error.response?.status === 401) {
      console.error('❌ Erro 401 - Token necessário (mas API está respondendo)');
      console.log('✅ API alcançável!');
      return true;
    } else {
      console.error('❌ Erro:', error.message);
    }
    return false;
  }
}

export async function testarFluxoLogin() {
  console.log('\n📝 Testando fluxo de login...');
  
  try {
    // 1. Criar escola (se ainda não existe)
    console.log('1. Criando escola de teste...');
    const school = await schoolService.create({
      name: 'Escola Teste',
      email: 'teste@escola.com',
      address: 'Rua Teste, 123',
      phone: '(11) 1234-5678'
    });
    TEST_CONFIG.schoolId = school.id;
    console.log('✅ Escola criada:', school.id);
    
    // 2. Registrar usuário
    console.log('\n2. Registrando usuário...');
    const registerResponse = await authService.register({
      name: 'Usuário Teste',
      email: TEST_CONFIG.testEmail,
      password: TEST_CONFIG.testPassword,
      password_confirmation: TEST_CONFIG.testPassword,
      user_type: 'admin',
      school_id: TEST_CONFIG.schoolId,
      address: 'Rua Teste, 456'
    });
    TEST_CONFIG.userId = registerResponse.user.id;
    console.log('✅ Usuário registrado:', registerResponse.user.name);
    console.log('✅ Token recebido:', registerResponse.token.substring(0, 20) + '...');
    
    // 3. Fazer logout
    console.log('\n3. Fazendo logout...');
    await authService.logout();
    console.log('✅ Logout realizado');
    
    // 4. Fazer login novamente
    console.log('\n4. Fazendo login...');
    const loginResponse = await authService.login({
      email: TEST_CONFIG.testEmail,
      password: TEST_CONFIG.testPassword
    });
    console.log('✅ Login bem-sucedido:', loginResponse.user.name);
    
    // 5. Buscar perfil
    console.log('\n5. Buscando perfil...');
    const profile = await authService.getProfile();
    console.log('✅ Perfil obtido:', profile.name);
    
    console.log('\n✅ TODOS OS TESTES DE AUTENTICAÇÃO PASSARAM!\n');
    return true;
  } catch (error: any) {
    console.error('\n❌ FALHA NO TESTE:', error.response?.data || error.message);
    return false;
  }
}

// ============================================
// TESTES DE CRUD
// ============================================

export async function testarCRUDAlunos() {
  console.log('\n📚 Testando CRUD de Alunos...');
  
  try {
    // 1. Criar
    console.log('1. Criando aluno...');
    const novoAluno = await studentService.create({
      name: 'Aluno Teste',
      email: 'aluno@teste.com',
      registration_number: '2024-TEST-001',
      phone: '(11) 98765-4321'
    });
    TEST_CONFIG.studentId = novoAluno.id;
    console.log('✅ Aluno criado:', novoAluno.name);
    
    // 2. Listar
    console.log('\n2. Listando alunos...');
    const alunos = await studentService.getAll();
    console.log(`✅ ${alunos.length} aluno(s) encontrado(s)`);
    
    // 3. Buscar por ID
    console.log('\n3. Buscando aluno específico...');
    const aluno = await studentService.getById(TEST_CONFIG.studentId);
    console.log('✅ Aluno encontrado:', aluno.name);
    
    // 4. Atualizar
    console.log('\n4. Atualizando aluno...');
    const alunoAtualizado = await studentService.update(TEST_CONFIG.studentId, {
      name: 'Aluno Teste Atualizado',
      phone: '(11) 99999-9999'
    });
    console.log('✅ Aluno atualizado:', alunoAtualizado.name);
    
    console.log('\n✅ TODOS OS TESTES DE ALUNOS PASSARAM!\n');
    return true;
  } catch (error: any) {
    console.error('\n❌ FALHA NO TESTE:', error.response?.data || error.message);
    return false;
  }
}

export async function testarCRUDDisciplinas() {
  console.log('\n📖 Testando CRUD de Disciplinas...');
  
  try {
    // 1. Criar
    console.log('1. Criando disciplina...');
    const novaDisciplina = await subjectService.create({
      name: 'Matemática Teste',
      code: 'MAT-TEST-001',
      number_of_grades: 3,
      passing_average: 7.0,
      recovery_average: 5.0,
      teacher_id: TEST_CONFIG.userId
    });
    TEST_CONFIG.subjectId = novaDisciplina.id;
    console.log('✅ Disciplina criada:', novaDisciplina.name);
    
    // 2. Listar
    console.log('\n2. Listando disciplinas...');
    const disciplinas = await subjectService.getAll();
    console.log(`✅ ${disciplinas.length} disciplina(s) encontrada(s)`);
    
    // 3. Buscar por ID
    console.log('\n3. Buscando disciplina específica...');
    const disciplina = await subjectService.getById(TEST_CONFIG.subjectId);
    console.log('✅ Disciplina encontrada:', disciplina.name);
    
    // 4. Atualizar
    console.log('\n4. Atualizando disciplina...');
    const disciplinaAtualizada = await subjectService.update(TEST_CONFIG.subjectId, {
      name: 'Matemática Avançada Teste',
      passing_average: 7.5
    });
    console.log('✅ Disciplina atualizada:', disciplinaAtualizada.name);
    
    console.log('\n✅ TODOS OS TESTES DE DISCIPLINAS PASSARAM!\n');
    return true;
  } catch (error: any) {
    console.error('\n❌ FALHA NO TESTE:', error.response?.data || error.message);
    return false;
  }
}

export async function testarCRUDNotas() {
  console.log('\n📊 Testando CRUD de Notas...');
  
  try {
    // 1. Criar
    console.log('1. Criando registro de notas...');
    const novaNota = await gradeService.create({
      student_id: TEST_CONFIG.studentId,
      subject_id: TEST_CONFIG.subjectId,
      scores: [8.5, 7.0]
    });
    TEST_CONFIG.gradeId = novaNota.id;
    console.log('✅ Nota criada. Média:', novaNota.average);
    console.log('   Status:', novaNota.status);
    
    // 2. Adicionar nota
    console.log('\n2. Adicionando nova nota...');
    const notaComMaisScore = await gradeService.addScore(TEST_CONFIG.gradeId, {
      add_score: 9.0
    });
    console.log('✅ Nota adicionada. Nova média:', notaComMaisScore.average);
    console.log('   Notas:', notaComMaisScore.scores.join(', '));
    
    // 3. Atualizar nota específica
    console.log('\n3. Atualizando primeira nota...');
    const notaAtualizada = await gradeService.updateScore(TEST_CONFIG.gradeId, {
      score_index: 0,
      update_score: 9.5
    });
    console.log('✅ Nota atualizada. Nova média:', notaAtualizada.average);
    console.log('   Notas:', notaAtualizada.scores.join(', '));
    
    // 4. Listar todas
    console.log('\n4. Listando todas as notas...');
    const todasNotas = await gradeService.getAll();
    console.log(`✅ ${todasNotas.length} registro(s) de nota(s) encontrado(s)`);
    
    // 5. Filtrar por aluno
    console.log('\n5. Filtrando notas por aluno...');
    const notasDoAluno = await gradeService.getAll({ 
      student_id: TEST_CONFIG.studentId 
    });
    console.log(`✅ ${notasDoAluno.length} nota(s) do aluno encontrada(s)`);
    
    // 6. Filtrar por disciplina
    console.log('\n6. Filtrando notas por disciplina...');
    const notasDaDisciplina = await gradeService.getAll({ 
      subject_id: TEST_CONFIG.subjectId 
    });
    console.log(`✅ ${notasDaDisciplina.length} nota(s) da disciplina encontrada(s)`);
    
    console.log('\n✅ TODOS OS TESTES DE NOTAS PASSARAM!\n');
    return true;
  } catch (error: any) {
    console.error('\n❌ FALHA NO TESTE:', error.response?.data || error.message);
    return false;
  }
}

// ============================================
// EXECUTAR TODOS OS TESTES
// ============================================

export async function executarTodosOsTestes() {
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║   🧪 INICIANDO TESTES DOS SERVIÇOS       ║');
  console.log('╚═══════════════════════════════════════════╝\n');
  
  const resultados = {
    conexao: false,
    login: false,
    alunos: false,
    disciplinas: false,
    notas: false
  };
  
  try {
    // 1. Testar conexão
    resultados.conexao = await testarConexaoAPI();
    if (!resultados.conexao) {
      throw new Error('Falha na conexão com API');
    }
    
    // 2. Testar login
    resultados.login = await testarFluxoLogin();
    if (!resultados.login) {
      throw new Error('Falha no fluxo de login');
    }
    
    // 3. Testar alunos
    resultados.alunos = await testarCRUDAlunos();
    
    // 4. Testar disciplinas
    resultados.disciplinas = await testarCRUDDisciplinas();
    
    // 5. Testar notas
    resultados.notas = await testarCRUDNotas();
    
  } catch (error: any) {
    console.error('\n❌ Erro ao executar testes:', error.message);
  }
  
  // Resumo
  console.log('\n╔═══════════════════════════════════════════╗');
  console.log('║          📋 RESUMO DOS TESTES            ║');
  console.log('╚═══════════════════════════════════════════╝\n');
  
  const printResultado = (nome: string, passou: boolean) => {
    const status = passou ? '✅' : '❌';
    console.log(`${status} ${nome.padEnd(20)} ${passou ? 'PASSOU' : 'FALHOU'}`);
  };
  
  printResultado('Conexão API', resultados.conexao);
  printResultado('Autenticação', resultados.login);
  printResultado('CRUD Alunos', resultados.alunos);
  printResultado('CRUD Disciplinas', resultados.disciplinas);
  printResultado('CRUD Notas', resultados.notas);
  
  const totalTestes = Object.keys(resultados).length;
  const testesPassaram = Object.values(resultados).filter(r => r).length;
  
  console.log('\n' + '='.repeat(45));
  console.log(`Total: ${testesPassaram}/${totalTestes} testes passaram`);
  console.log('='.repeat(45) + '\n');
  
  if (testesPassaram === totalTestes) {
    console.log('🎉 TODOS OS TESTES PASSARAM! Serviços prontos para uso!\n');
  } else {
    console.log('⚠️  Alguns testes falharam. Verifique os erros acima.\n');
  }
  
  return resultados;
}

// ============================================
// TESTE INDIVIDUAL RÁPIDO
// ============================================

export async function testeRapido() {
  console.log('⚡ Teste Rápido - Verificando se API está acessível...\n');
  
  try {
    const conexaoOk = await testarConexaoAPI();
    
    if (conexaoOk) {
      console.log('\n✅ API ACESSÍVEL! Pronto para integração.\n');
      console.log('Execute executarTodosOsTestes() para testes completos.\n');
    } else {
      console.log('\n❌ API NÃO ACESSÍVEL. Verifique configuração.\n');
    }
    
    return conexaoOk;
  } catch (error) {
    console.error('\n❌ Erro no teste rápido:', error);
    return false;
  }
}
