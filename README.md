# GuessDaStuff

Este proyecto es un juego multiplataforma que utiliza varias tecnologías modernas, incluyendo Java con Spring Boot, WebSocket, React Native para dispositivos móviles, React para la web, PostgreSQL para la base de datos, y se despliega en Railway y Vercel.

## Estructura del Proyecto

El proyecto está organizado en varias carpetas principales:

- **`backend/`**: Contiene el código fuente del backend en Spring Boot.
- **`frontend/`**: Contiene el código fuente del frontend en React y React Native.
- **`database/`**: Contiene scripts y configuraciones para la base de datos.
- **`deploy/`**: Contiene configuraciones y scripts para el despliegue en Railway y Vercel.

## Estructura de Ramas

El repositorio utiliza una estructura de ramas basada en Git Flow para gestionar el desarrollo y el mantenimiento del proyecto. A continuación se describe el propósito de cada rama:

### Ramas Principales

- **`main`**:
  - **Propósito**: Esta es la rama principal que contiene el código en producción. Debe estar siempre en un estado estable y libre de errores críticos.
  - **Uso**: Solo se fusionan en esta rama las características y correcciones que han sido completamente desarrolladas y probadas.

- **`develop`**:
  - **Propósito**: Rama de desarrollo donde se integran las nuevas características y se realizan pruebas.
  - **Uso**: Fusiona aquí las ramas de características y correcciones. Esta rama puede ser desplegada en un entorno de staging para pruebas finales antes de pasar a producción.

### Ramas de Características

- **`feature/*`**:
  - **Propósito**: Ramas dedicadas al desarrollo de nuevas funcionalidades o mejoras.
  - **Ejemplos**: `feature/user-authentication`, `feature/game-logic`, `feature/chat-system`
  - **Uso**: Crea una nueva rama `feature` para cada nueva funcionalidad. Después de completar el desarrollo y realizar pruebas, fusiona esta rama en `develop`.

### Ramas de Corrección de Errores

- **`bugfix/*`**:
  - **Propósito**: Ramas para solucionar errores específicos que no son críticos y están en la rama `develop`.
  - **Ejemplos**: `bugfix/fix-login-error`, `bugfix/correct-score-calculation`
  - **Uso**: Crea una nueva rama `bugfix` para cada problema que necesites resolver. Después de solucionar el error, fusiona la rama `bugfix` en `develop`.

### Ramas de Corrección Urgente

- **`hotfix/*`**:
  - **Propósito**: Ramas para solucionar problemas críticos en producción que requieren una corrección inmediata.
  - **Ejemplos**: `hotfix/security-patch`, `hotfix/critical-bug`
  - **Uso**: Crea una nueva rama `hotfix` a partir de `main` para corregir problemas urgentes. Después de solucionar el problema, fusiona la rama `hotfix` en `main` y `develop`.

### Ramas de Preparación de Versiones

- **`release/*`**:
  - **Propósito**: Ramas para preparar nuevas versiones del software.
  - **Ejemplos**: `release/v1.0.0`, `release/v1.1.0`
  - **Uso**: Cuando estés listo para una nueva versión, crea una rama `release` a partir de `develop`. Utiliza esta rama para realizar pruebas finales y correcciones menores. Una vez lista, fusiónala en `main` y `develop`.

## Despliegue

- **Railway**: Utilizado para desplegar el backend en Spring Boot y la base de datos PostgreSQL.
- **Vercel**: Utilizado para desplegar la aplicación web en React.

## Contribuir

Para contribuir al proyecto, por favor sigue el flujo de trabajo de ramas descrito anteriormente. Crea ramas `feature`, `bugfix`, `hotfix` o `release` según corresponda, y realiza pull requests para fusionar tus cambios.
