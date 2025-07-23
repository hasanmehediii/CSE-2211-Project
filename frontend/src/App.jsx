import React from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import AppRoutes from './routes';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
      <AppRoutes />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;