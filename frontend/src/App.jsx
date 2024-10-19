import React from 'react';

import AppRouter from './router/AppRouter'

import { AuthProvider } from './contextAPI/AuthContext';

/** Animations **/
import { AnimatePresence } from "framer-motion";

function App() {
  return (
    <AnimatePresence mode='wait'>
      <AuthProvider>
          <AppRouter />
      </AuthProvider>
    </AnimatePresence>
  )
}

export default App
