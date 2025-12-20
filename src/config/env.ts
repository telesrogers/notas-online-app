/**
 * Configuração de ambiente
 * 
 * Centraliza as variáveis de ambiente do app
 */

// Nota: No Expo, use process.env.EXPO_PUBLIC_ como prefixo
// Para variáveis acessíveis no código do app

export const env = {
  // API Base URL
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 
    (__DEV__ 
      ? 'http://localhost:3000'  // Desenvolvimento
      : 'https://sua-api-producao.com'  // Produção
    ),
  
  // Outras configurações
  API_TIMEOUT: 10000,
  TOKEN_EXPIRATION: 48 * 60 * 60 * 1000, // 48 horas em ms
};

// Log para debug (apenas em desenvolvimento)
if (__DEV__) {
  console.log('🔧 Configuração do ambiente:', {
    API_BASE_URL: env.API_BASE_URL,
    API_TIMEOUT: env.API_TIMEOUT,
  });
}
