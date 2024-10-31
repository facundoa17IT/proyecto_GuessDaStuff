import { Alert } from "react-native";

const API_URL = "http://192.168.0.105:2024";

//Clase con los endpoints
class ApiService {
  async login(username, password) {
    try {
      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        },
      );

      if (!response.ok) {
        throw new Error("El nombre de usuario y/o la contraseña son incorrectos");
      }else{
        Alert.alert("Login exitoso", "Bienvenido!");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async registrarse(username, email, password) {
    try {
      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password}),
        },
      );

      if (!response.ok) {
        throw new Error("Ha ocurrido un error al intentar registrarte.");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  // agregar endpoints
}

const apiService = new ApiService();

//Se hacen endpoints exportables a otros archivos
export const login = async (username, password) => {
  try {
    const data = await apiService.login(username, password);
    return data;
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};

export const registrarse = async (username, email, password) => {
  try {
    const data = await apiService.registrarse(username, email, password);
    return data;
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};