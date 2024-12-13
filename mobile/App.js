import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/AppNavigator";
import { SocketProvider } from './src/WebSocketProvider';

export default function App() {
  return (
    <SocketProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SocketProvider>
  );
};
