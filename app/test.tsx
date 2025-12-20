import { authService, studentService } from '@/src/services';
import { Student } from '@/src/types';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TestScreen() {
  // Estados de autenticação
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Estados de alunos
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  
  // Estados para criar/editar aluno
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentRegistration, setStudentRegistration] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Estados para Alert customizado
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertButtons, setAlertButtons] = useState<{text: string, onPress?: () => void, style?: string}[]>([]);

  // Função para mostrar alert customizado
  const showAlert = (title: string, message: string, buttons?: {text: string, onPress?: () => void, style?: string}[]) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertButtons(buttons || [{text: 'OK', onPress: () => setAlertVisible(false)}]);
    setAlertVisible(true);
  };

  // Login
  const handleLogin = async () => {
    console.log('handleLogin chamado');
    if (!email || !password) {
      console.log('Validação falhou - campos vazios');
      showAlert('Erro', 'Preencha email e senha');
      return;
    }

    setLoading(true);
    console.log('Iniciando login...');
    try {
      const response = await authService.login({ email, password });
      console.log('Login bem-sucedido:', response.user);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      showAlert('Sucesso', `Bem-vindo, ${response.user.name}!`);
    } catch (error: any) {
      console.error('Erro no login:', error);
      const errorMessage = error.response?.data?.errors 
        ? error.response.data.errors.join('\n')
        : error.response?.data?.error || 'Verifique suas credenciais';
      showAlert('Erro no login', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setStudents([]);
      setEmail('');
      setPassword('');
      showAlert('Sucesso', 'Logout realizado!');
    } catch (error) {
      console.error('Erro no logout:', error);
      showAlert('Erro', 'Não foi possível fazer logout');
    }
  };

  // Listar alunos
  const handleLoadStudents = async () => {
    setLoadingStudents(true);
    try {
      const data = await studentService.getAll();
      console.log('Dados recebidos:', JSON.stringify(data[0], null, 2));
      setStudents(data);
      showAlert('Sucesso', `${data.length} aluno(s) carregado(s)`);
    } catch (error: any) {
      console.error('Erro ao carregar alunos:', error);
      const errorMessage = error.response?.data?.errors 
        ? error.response.data.errors.join('\n')
        : error.response?.data?.error || 'Não foi possível carregar alunos';
      showAlert('Erro', errorMessage);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Criar aluno
  const handleCreateStudent = async () => {
    console.log('handleCreateStudent chamado');
    if (!studentName || !studentEmail || !studentRegistration) {
      console.log('Validação falhou - campos obrigatórios vazios');
      showAlert('Erro', 'Preencha nome, email e matrícula');
      return;
    }

    setLoadingStudents(true);
    console.log('Criando aluno...');
    try {
      await studentService.create({
        name: studentName,
        email: studentEmail,
        registration_number: studentRegistration,
        phone: studentPhone || undefined,
      });
      console.log('Aluno criado com sucesso');
      showAlert('Sucesso', 'Aluno criado com sucesso!');
      clearForm();
      handleLoadStudents();
    } catch (error: any) {
      console.error('Erro ao criar aluno:', error);
      const errorMessage = error.response?.data?.errors 
        ? error.response.data.errors.join('\n')
        : error.response?.data?.error || 'Não foi possível criar aluno';
      showAlert('Erro', errorMessage);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Editar aluno
  const handleUpdateStudent = async () => {
    if (!editingStudent) return;
    
    if (!studentName || !studentEmail || !studentRegistration) {
      showAlert('Erro', 'Preencha nome, email e matrícula');
      return;
    }

    setLoadingStudents(true);
    try {
      await studentService.update(editingStudent.id, {
        name: studentName,
        email: studentEmail,
        registration_number: studentRegistration,
        phone: studentPhone || undefined,
      });
      showAlert('Sucesso', 'Aluno atualizado com sucesso!');
      clearForm();
      handleLoadStudents();
    } catch (error: any) {
      console.error('Erro ao atualizar aluno:', error);
      const errorMessage = error.response?.data?.errors 
        ? error.response.data.errors.join('\n')
        : error.response?.data?.error || 'Não foi possível atualizar aluno';
      showAlert('Erro', errorMessage);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Deletar aluno
  const handleDeleteStudent = async (id: string, name: string) => {
    showAlert(
      'Confirmar exclusão',
      `Deseja realmente deletar ${name}?`,
      [
        { text: 'Cancelar', onPress: () => setAlertVisible(false) },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            setAlertVisible(false);
            setLoadingStudents(true);
            try {
              await studentService.delete(id);
              showAlert('Sucesso', 'Aluno deletado com sucesso!');
              setSelectedStudent(null);
              handleLoadStudents();
            } catch (error: any) {
              console.error('Erro ao deletar aluno:', error);
              const errorMessage = error.response?.data?.errors 
                ? error.response.data.errors.join('\n')
                : error.response?.data?.error || 'Não foi possível deletar aluno';
              showAlert('Erro', errorMessage);
            } finally {
              setLoadingStudents(false);
            }
          },
        },
      ]
    );
  };

  // Ver detalhes de um aluno
  const handleViewStudent = async (id: string) => {
    setLoadingStudents(true);
    try {
      const student = await studentService.getById(id);
      setSelectedStudent(student);
    } catch (error: any) {
      console.error('Erro ao buscar aluno:', error);
      const errorMessage = error.response?.data?.errors 
        ? error.response.data.errors.join('\n')
        : error.response?.data?.error || 'Não foi possível buscar aluno';
      showAlert('Erro', errorMessage);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Abrir formulário para editar
  const openEditForm = (student: Student) => {
    setEditingStudent(student);
    setStudentName(student.name);
    setStudentEmail(student.email);
    setStudentRegistration(student.registration_number);
    setStudentPhone(student.phone || '');
    setShowForm(true);
    setSelectedStudent(null);
  };

  // Limpar formulário
  const clearForm = () => {
    setShowForm(false);
    setEditingStudent(null);
    setStudentName('');
    setStudentEmail('');
    setStudentRegistration('');
    setStudentPhone('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧪 Tela de Testes</Text>
        <Text style={styles.subtitle}>API Notas Online</Text>
      </View>

      {!isAuthenticated ? (
        // Formulário de Login
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔐 Login</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.hint}>
            💡 Use as credenciais da sua API
          </Text>
        </View>
      ) : (
        // Área Autenticada
        <>
          {/* Informações do Usuário */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👤 Usuário Logado</Text>
            
            <View style={styles.userInfo}>
              <Text style={styles.userInfoLabel}>Nome:</Text>
              <Text style={styles.userInfoValue}>{currentUser?.name}</Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userInfoLabel}>Email:</Text>
              <Text style={styles.userInfoValue}>{currentUser?.email}</Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userInfoLabel}>Tipo:</Text>
              <Text style={styles.userInfoValue}>{currentUser?.user_type}</Text>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.dangerButton]}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
          </View>

          {/* Seção de Alunos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👨‍🎓 Alunos - CRUD Completo</Text>
            
            {/* Botões de Ação Principal */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton, styles.buttonFlex]}
                onPress={handleLoadStudents}
                disabled={loadingStudents}
              >
                {loadingStudents ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>📋 Listar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.successButton, styles.buttonFlex]}
                onPress={() => setShowForm(true)}
                disabled={loadingStudents}
              >
                <Text style={styles.buttonText}>➕ Novo</Text>
              </TouchableOpacity>
            </View>

            {/* Formulário Criar/Editar */}
            {showForm && (
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>
                  {editingStudent ? '✏️ Editar Aluno' : '➕ Novo Aluno'}
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Nome completo *"
                  value={studentName}
                  onChangeText={setStudentName}
                  editable={!loadingStudents}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Email *"
                  value={studentEmail}
                  onChangeText={setStudentEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loadingStudents}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Matrícula *"
                  value={studentRegistration}
                  onChangeText={setStudentRegistration}
                  editable={!loadingStudents}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Telefone (opcional)"
                  value={studentPhone}
                  onChangeText={setStudentPhone}
                  keyboardType="phone-pad"
                  editable={!loadingStudents}
                />

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.successButton, styles.buttonFlex]}
                    onPress={editingStudent ? handleUpdateStudent : handleCreateStudent}
                    disabled={loadingStudents}
                  >
                    <Text style={styles.buttonText}>
                      {editingStudent ? '💾 Salvar' : '➕ Criar'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.secondaryButton, styles.buttonFlex]}
                    onPress={clearForm}
                    disabled={loadingStudents}
                  >
                    <Text style={styles.buttonText}>❌ Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Detalhes de um aluno */}
            {selectedStudent && (
              <View style={styles.detailContainer}>
                <Text style={styles.detailTitle}>
                  👤 Detalhes do Aluno
                </Text>

                <View style={styles.detailCard}>
                  <Text style={styles.detailLabel}>Nome:</Text>
                  <Text style={styles.detailValue}>{selectedStudent.name}</Text>

                  <Text style={styles.detailLabel}>Email:</Text>
                  <Text style={styles.detailValue}>{selectedStudent.email}</Text>

                  <Text style={styles.detailLabel}>Matrícula:</Text>
                  <Text style={styles.detailValue}>
                    {selectedStudent.registration_number}
                  </Text>

                  {selectedStudent.phone && (
                    <>
                      <Text style={styles.detailLabel}>Telefone:</Text>
                      <Text style={styles.detailValue}>{selectedStudent.phone}</Text>
                    </>
                  )}

                  <Text style={styles.detailLabel}>ID:</Text>
                  <Text style={[styles.detailValue, styles.detailId]}>
                    {selectedStudent.id}
                  </Text>

                  <Text style={styles.detailLabel}>Criado em:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(selectedStudent.created_at).toLocaleString('pt-BR')}
                  </Text>

                  <Text style={styles.detailLabel}>Atualizado em:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(selectedStudent.updated_at).toLocaleString('pt-BR')}
                  </Text>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.primaryButton, styles.buttonFlex]}
                    onPress={() => openEditForm(selectedStudent)}
                    disabled={loadingStudents}
                  >
                    <Text style={styles.buttonText}>✏️ Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.dangerButton, styles.buttonFlex]}
                    onPress={() => handleDeleteStudent(selectedStudent.id, selectedStudent.name)}
                    disabled={loadingStudents}
                  >
                    <Text style={styles.buttonText}>🗑️ Deletar</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => setSelectedStudent(null)}
                  disabled={loadingStudents}
                >
                  <Text style={styles.buttonText}>⬅️ Voltar para Lista</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Lista de alunos */}
            {students.length > 0 && !showForm && !selectedStudent && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>
                  📋 {students.length} aluno(s) encontrado(s):
                </Text>
                
                {students.map((student, index) => (
                  <View key={student.id} style={styles.studentCard}>
                    <View style={styles.studentHeader}>
                      <Text style={styles.studentNumber}>#{index + 1}</Text>
                      <Text style={styles.studentName}>{student.name}</Text>
                    </View>
                    
                    <Text style={styles.studentDetail}>📧 {student.email}</Text>
                    <Text style={styles.studentDetail}>
                      🎓 {student.registration_number}
                    </Text>
                    {student.phone && (
                      <Text style={styles.studentDetail}>📱 {student.phone}</Text>
                    )}

                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={[styles.buttonSmall, styles.primaryButton]}
                        onPress={() => handleViewStudent(student.id)}
                      >
                        <Text style={styles.buttonSmallText}>👁️ Ver</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.buttonSmall, styles.successButton]}
                        onPress={() => openEditForm(student)}
                      >
                        <Text style={styles.buttonSmallText}>✏️ Editar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.buttonSmall, styles.dangerButton]}
                        onPress={() => handleDeleteStudent(student.id, student.name)}
                      >
                        <Text style={styles.buttonSmallText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </>
      )}

      {/* Informações de Debug */}
      <View style={styles.debugSection}>
        <Text style={styles.debugTitle}>🔧 Debug Info</Text>
        <Text style={styles.debugText}>
          Status: {isAuthenticated ? '✅ Autenticado' : '❌ Não autenticado'}
        </Text>
        <Text style={styles.debugText}>
          Alunos carregados: {students.length}
        </Text>
      </View>

      {/* Alert Modal Customizado */}
      <Modal
        visible={alertVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAlertVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{alertTitle}</Text>
            <Text style={styles.modalMessage}>{alertMessage}</Text>
            <View style={styles.modalButtons}>
              {alertButtons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modalButton,
                    button.style === 'destructive' && styles.modalButtonDestructive,
                    alertButtons.length === 1 && styles.modalButtonSingle,
                  ]}
                  onPress={() => {
                    if (button.onPress) {
                      button.onPress();
                    } else {
                      setAlertVisible(false);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      button.style === 'destructive' && styles.modalButtonTextDestructive,
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    marginTop: 15,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userInfoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  userInfoValue: {
    fontSize: 14,
    color: '#333',
  },
  resultContainer: {
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  studentCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentNumber: {
    fontSize: 12,
    color: '#999',
    marginRight: 10,
    fontWeight: '600',
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  studentDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  buttonFlex: {
    flex: 1,
  },
  buttonSmall: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonSmallText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  successButton: {
    backgroundColor: '#34C759',
  },
  formContainer: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailContainer: {
    backgroundColor: '#fff5e6',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#FF9500',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  detailId: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Courier',
  },
  debugSection: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 30,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#666',
  },
  debugText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  // Estilos do Modal de Alert
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    minWidth: 280,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  modalButtonSingle: {
    flex: 1,
  },
  modalButtonDestructive: {
    backgroundColor: '#FF3B30',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextDestructive: {
    color: '#fff',
  },
});
