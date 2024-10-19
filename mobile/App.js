import React, { useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { buttonStyles } from "./src/styles/buttons";
import { textStyles } from "./src/styles/texts";
import { login } from "./src/CallsAPI";
import Register from "./src/screens/Register";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  Pressable,
  Image,
  ImageBackground,
} from "react-native";

const Stack = createNativeStackNavigator();
const logo = require("./assets/GDSsimplelogo.png");
const fondo = require("./assets/fondo_mobile.jpeg");

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const result = await login(username, password);
    // navigation.navigate("Home");
  };

  return (
    <ImageBackground source={fondo} resizeMode="cover" style={styles.container}>
      <Image source={logo} resizeMode="contain" style={styles.logo} />
      <Text style={textStyles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Pressable style={buttonStyles.buttonhalfwidth} onPress={handleLogin}>
          <Text style={styles.buttontext}>Iniciar sesión</Text>
        </Pressable>
        <View style={styles.spacer} />
        <Pressable
          style={buttonStyles.buttonhalfwidth}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.buttontext}>Registrarse</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Inicia sesión"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    color: "brown",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    backgroundColor: "brown",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 15,
    width: "40%",
  },
  buttontext: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  spacer: {
    width: 50,
  },
  logo: {
    width: "90%",
    height: 200,
    marginBottom: 80,
    marginTop: 20,
    borderRadius: 25,
  },
});