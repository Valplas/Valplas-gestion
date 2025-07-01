import React, { useEffect, useState } from 'react';
import { AuthContext, LoginProps } from './AuthContext';
import { UserDto } from '../../types/auth.type';
import usePost from '../../hooks/usePost';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import { BACKEND_URL } from '../../envs';



export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const {
    data: userData,
    error: userError,
    postData: postUser,
  } = usePost<UserDto>(`${BACKEND_URL}/auth/login`);

  const {
    data: validateData,
    error: validateError,
    postData: postValidate,
  } = usePost<UserDto>(`${BACKEND_URL}/auth/validate`);


  const login = ({ email, password, token }: LoginProps) => {
    setIsLoading(true)
    postUser({ email, password, token });
  };

  const logout = () => {
    // TO DO
    //postLogout({ email: user?.email });
    Cookies.remove('valplas.token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleInitAuth = async () => {
    const token = Cookies.get('valplas.token');
    setIsLoading(true)
    postValidate({ token });
  };

  useEffect(() => {
    if (validateData) {
      setIsAuthenticated(true);
      setUser(validateData);
    }
    setIsLoading(false)
  }, [validateData, validateError]);

  useEffect(() => {
    if (validateError || userError) {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [validateError, userError]);

  useEffect(() => {
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
    setIsLoading(false)
  }, [userData, userError]);

  useEffect(() => {
    if (isAuthenticated && user?.token) {
      const expires = dayjs().add(1, 'hour').toDate();
      Cookies.set('valplas.token', user?.token, {
        expires,
        sameSite: 'strict',
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    handleInitAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
