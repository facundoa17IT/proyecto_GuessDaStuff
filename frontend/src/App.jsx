import React from 'react';

import AppRouter from './router/AppRouter'

import { AuthProvider } from './contextAPI/AuthContext';
import { LoadGameProvider } from './contextAPI/LoadGameContext';
import { ListProvider } from './contextAPI/ListContext';
/** Animations **/
import { AnimatePresence } from "framer-motion";
import { SocketProvider } from './contextAPI/SocketContext';

function App() {
  return (
    <AnimatePresence mode='wait'>
      <AuthProvider>
        <LoadGameProvider>
          <ListProvider>
            <SocketProvider>
              <AppRouter />
            </SocketProvider>
          </ListProvider>
        </LoadGameProvider>
      </AuthProvider>
    </AnimatePresence>
  )
}

export default App
