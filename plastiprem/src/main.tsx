import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import { SnackbarProvider } from './feature/Snackbar/SnackbarProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './feature/Auth/AuthProvider';

//@ts-ignore
const VITE_GOOGLE_AUTH = import.meta.env.VITE_GOOGLE_AUTH;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SnackbarProvider>
         <Router>
        <GoogleOAuthProvider clientId={VITE_GOOGLE_AUTH}>
          
            <App />
        </GoogleOAuthProvider>
         </Router>
       
    </SnackbarProvider>
  </React.StrictMode>,
);
