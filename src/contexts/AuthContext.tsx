import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';
import { LoginCredentials, RegisterData } from '../types/auth.types';
import type { User } from '../types/user.types';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (userData: RegisterData) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do storage ao iniciar o app
  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData(): Promise<void> {
    try {
      const storedUser = await authService.getCurrentUser();
      const isAuth = await authService.isAuthenticated();
      
      if (isAuth && storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do storage:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(credentials: LoginCredentials): Promise<void> {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  async function signUp(userData: RegisterData): Promise<void> {
    try {
      await authService.register(userData);
      // Alterei para NÃO autenticar automaticamente após cadastro. O app deve voltar para a tela de login.
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  async function signOut(): Promise<void> {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
