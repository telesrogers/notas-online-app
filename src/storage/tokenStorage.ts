import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@api_notas_token';
const USER_KEY = '@api_notas_user';

export const tokenStorage = {
  // Salvar token e dados do usuário
  async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
      throw error;
    }
  },

  // Recuperar token
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Erro ao recuperar token:', error);
      return null;
    }
  },

  // Remover token (logout)
  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Erro ao remover token:', error);
      throw error;
    }
  },

  // Salvar dados do usuário
  async saveUser(user: any): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      throw error;
    }
  },

  // Recuperar dados do usuário
  async getUser(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erro ao recuperar usuário:', error);
      return null;
    }
  },

  // Verificar se está autenticado
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  }
};
