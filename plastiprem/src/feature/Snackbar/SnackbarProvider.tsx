import React, { useState, ReactNode } from 'react';
import Snackbar from './Snackbar';
import { SnackbarContext } from './SnackbarContext';

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [snackbar, setSnackbar] = useState<{
    message: string;
    isOpen: boolean;
  }>({ message: '', isOpen: false });

  const showSnackbar = (message: string) => {
    setSnackbar({ message, isOpen: true });
    setTimeout(() => {
      setSnackbar({ message: '', isOpen: false });
    }, 1000); // Auto-close after 2 seconds
  };

  const closeSnackbar = () => {
    setSnackbar({ message: '', isOpen: false });
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        message={snackbar.message}
        isOpen={snackbar.isOpen}
        onClose={closeSnackbar}
      />
    </SnackbarContext.Provider>
  );
};
