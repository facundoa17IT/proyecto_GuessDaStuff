/** React **/
import React from 'react';

/** Router **/
import AppRouter from './router/AppRouter'

/** Providers **/
import { AuthProvider } from './contextAPI/AuthContext';
import { LoadGameProvider } from './contextAPI/LoadGameContext';
import { ListProvider } from './contextAPI/ListContext';
import { SocketProvider } from './contextAPI/SocketContext';

/** Animations **/
import { AnimatePresence } from "framer-motion";

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
