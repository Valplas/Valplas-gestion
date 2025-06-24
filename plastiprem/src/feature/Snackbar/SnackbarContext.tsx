import { createContext, useContext } from 'react';

interface SnackbarContextProps {
  showSnackbar: (message: string) => void;
}

export const SnackbarContext = createContext<SnackbarContextProps | undefined>(
  undefined,
);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
