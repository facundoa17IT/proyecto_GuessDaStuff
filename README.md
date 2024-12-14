# Proyecto: GuessDaStuff - Tecnologo 2024

GuessDaStuff! es un juego de adivinanzas multi-temáticas desarrollado como parte de la asignatura Proyecto de la carrera Tecnólogo en Informática. El proyecto busca fomentar el entretenimiento y la agilidad mental, ofreciendo modos de juego individuales y multijugador en plataformas web y móviles.

## Tabla de Contenidos
1. [Descripción General](#descripción-general)
2. [Estructura del Repositorio](#estructura-del-repositorio)
3. [Requisitos Previos](#requisitos-previos)
4. [Instrucciones de Instalación](#instrucciones-de-instalación)
5. [Guía de Uso](#guía-de-uso)
6. [Detalles Técnicos](#detalles-técnicos)
7. [Contribuciones](#contribuciones)
8. [Autores](#autores)
9. [Licencia](#licencia)

---

## Descripción General
GuessDaStuff! es una plataforma diseñada para ofrecer una experiencia atractiva y competitiva a través de adivinanzas en diversos temas. La aplicación soporta modos de juego individual y multijugador, con las siguientes características principales:
- Experiencia interactiva y educativa.
- Accesible en plataformas web y móviles.
- Escalabilidad y mantenibilidad gracias al uso de tecnologías modernas.

### Perfiles de Usuario
1. **Administrador**: Gestión de usuarios, categorías y títulos; acceso exclusivo vía web.
2. **Jugador**: Participación en partidas, acceso a rankings y estadísticas.
3. **Invitado**: Acceso limitado para explorar la aplicación y jugar partidas individuales.

---

## Estructura del Repositorio
```plaintext
/
├── .vscode/          # Configuración del editor Visual Studio Code
├── backend/          # Código fuente del backend
├── frontend/         # Código fuente del frontend
├── mobile/           # Aplicación móvil
├── .gitignore        # Archivos y carpetas ignoradas por Git
├── README.md         # Este archivo
├── Railway.toml      # Configuración para Railway
├── package-lock.json # Dependencias de Node.js
```

### Descripción de las Carpetas
- **backend**: Contiene la lógica del servidor utilizando Java y Spring Boot.
- **frontend**: Código para la interfaz web desarrollado con React.
- **mobile**: Aplicación móvil creada con React Native.

---

## Requisitos Previos
Antes de iniciar, asegúrate de tener instalados los siguientes programas y herramientas:
- Node.js v20+
- Java 17+
- Android Studio (para desarrollo móvil)
- PostgreSQL (para la base de datos)
- Docker (opcional para desplegar el entorno completo)

---

## Instrucciones de Instalación
1. Clona este repositorio:
   ```bash
   git clone https://github.com/usuario/GuessDaStuff.git
   cd GuessDaStuff
   ```

2. Configura las dependencias del backend:
   ```bash
   cd backend
   ./mvnw install
   ./mvnw spring-boot:run
   ```

3. Configura las dependencias del frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. Configura la aplicación móvil:
   ```bash
   cd mobile
   npm install
   npx react-native run-android
   ```

---

## Guía de Uso
1. Inicia el servidor backend para manejar las APIs y la lógica del negocio.
2. Inicia el frontend para la aplicación web.
3. Inicia la aplicación móvil en un emulador o dispositivo físico.
4. Regístrate como usuario o inicia sesión para acceder a las funcionalidades completas.

---

## Detalles Técnicos
- **Tecnologías utilizadas**:
  - Backend: Java, Spring Boot, PostgreSQL.
  - Frontend: React, WebSockets.
  - Móvil: React Native.
- **Arquitectura**:
  - Basada en una arquitectura en capas (presentación, negocio, datos).
  - Despliegue en Railway para backend y base de datos.
  - Almacenamiento de imágenes de perfil en Cloudinary.
- **Base de datos**: PostgreSQL.

---

## Contribuciones
Este repositorio es el resultado de un proyecto de tesis, pero estamos abiertos a recibir sugerencias o mejoras. Si deseas contribuir, sigue estos pasos:
1. Haz un fork del repositorio.
2. Crea una nueva rama para tus cambios (`git checkout -b feature/nueva-funcion`).
3. Realiza un pull request.

---

## Autores
- Mateo Tambasco 
- Agustín López 
- Facundo Aparicio
- Nicolás Lepore
- Leandro Rodríguez
- Santiago Pavan 
- Santiago Tutzo
- Angelo Giroldi

