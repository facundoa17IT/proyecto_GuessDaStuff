import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { resetPassword } from '../CallsAPI';
import { textStyles } from "../styles/texts";
import { buttonStyles } from "../styles/buttons";
import BackImage from '../styles/BackImage';

const logo = require("../../assets/GDSsimplelogo.png");

function ResetPassword() {
  const navigation = useNavigation();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  // Manejar el envío del formulario
  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }
    try {
        const response = await resetPassword(token, newPassword);
            if(response){
                setMessage('Contraseña restablecida exitosamente');
                Alert.alert('Éxito', 'Contraseña restablecida con éxito');
                navigation.navigate('Login');
            }
        } catch (error) {
            setMessage('Error al restablecer la contraseña. Por favor, intente de nuevo.');
            console.error(error);
    }
  };

  return (
    <BackImage>
      <Image source={logo} resizeMode="contain" style={styles.logo} />
      <Text style={textStyles.title}>Restablecer contraseña</Text>
      <View style={styles.field}>
        <Text style={styles.subtitle}>Token:</Text>
        <TextInput
          style={styles.input}
          value={token}
          onChangeText={setToken}
          required
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.subtitle}>Nueva contraseña:</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          required
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.subtitle}>Confirmar nueva contraseña:</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          required
        />
      </View>
      {message && <Text style={styles.errorText}>{message}</Text>}
      <Pressable style={buttonStyles.buttonhalfwidth} onPress={handleSubmit}>
        <Text style={styles.buttontext}>Enviar</Text>
      </Pressable>
    </BackImage>
  );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
},
subtitle:{
    fontSize: 20,
    marginBottom: 5,
    color: "#653532",
    fontWeight: "bold",
},
input: {
    backgroundColor: '#FFF',
    borderWidth: 3,
    borderRadius: 5,
    borderColor: '#653532',
    width: '100%',
    padding: 10,
    marginBottom: 10,
    fontSize: 20,
},
errorText: {
    color: "black",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "left",
    width: "100%",
},
buttontext: {
    color: "#FFF",
    fontSize: 19,
    textAlign: "center",
    fontWeight: "bold",
},
logo: {
    width: 300,
    height: 200,
    marginTop: -80,
    marginBottom: 40,
    borderRadius: 25,
},
field: {
    width: "100%",
    marginBottom: 20,
},
});

export default ResetPassword;
