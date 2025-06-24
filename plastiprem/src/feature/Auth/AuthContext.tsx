import { createContext, useContext } from 'react';
import { UserDto } from '../../types/auth.type';

export interface LoginProps{
    email?: string
    password?: string
    token?: string
}
export interface AuthContextProps {
  user: UserDto | null;
  login: ({email, password, token}:LoginProps) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextProps | null>(
  null
);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
