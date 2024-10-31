import React, { useState } from "react";
import { buttonStyles } from "../styles/buttons";
import { textStyles } from "../styles/texts";
import { registrarse } from "../CallsAPI";
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Image,
  Alert,
  ImageBackground,
} from "react-native";

const logo = require("../../assets/GDSsimplelogo.png");
const fondo = require("../../assets/fondo_mobile.jpeg");

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  // const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    username: "",
  });

  // const handlePickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setProfileImage(result.uri);
  //   }
  // };

  const validateFields = () => {
    let isValid = true;
    let newErrors = { email: "", password: "", username: "" };

    if (!email) {
      newErrors.email = "Este campo es requerido";
      isValid = false;
    }
    if (!password) {
      newErrors.password = "Este campo es requerido";
      isValid = false;
    }
    if (!username) {
      newErrors.username = "Este campo es requerido";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (validateFields()) {
      const result = await registrarse(username, email, password);
      if (result) {
        Alert.alert("Registro exitoso", `Email: ${email}\nUsername: ${username}`);
      }
    }
  };

  return (
    <ImageBackground source={fondo} resizeMode="cover" style={styles.container}>
      <Image source={logo} resizeMode="contain" style={styles.logo} />
      <Text style={textStyles.title}>Registrarse</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email ? (
        <Text style={styles.errorText}>{errors.email}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password ? (
        <Text style={styles.errorText}>{errors.password}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      {errors.username ? (
        <Text style={styles.errorText}>{errors.username}</Text>
      ) : null}
      
{/* 
      <Pressable style={buttonStyles.buttonfullwidth} onPress={handlePickImage}>
        <Text style={styles.buttonText}>Seleccionar imagen de perfil</Text>
      </Pressable> */}

      {/* {profileImage && (
        <Image source={{ uri: profileImage }} style={styles.image} />
      )} */}

      <Pressable style={buttonStyles.buttonfullwidth} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </Pressable>
    </ImageBackground>
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
  errorText: {
    color: "black",
    fontSize: 12,
    marginBottom: 10,
    textAlign: "left",
    width: "100%",
  },
  button: {
    backgroundColor: "brown",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 15,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: "90%",
    height: 200,
    marginTop: 20,
    marginBottom: 80,
    borderRadius: 25,
  },
});
