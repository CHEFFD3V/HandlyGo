# HandlyGo: Sistema de Asistencia para la Comunicación en MSD

## Descripción General

HandlyGo es una solución tecnológica diseñada para cerrar la brecha de comunicación entre personas con discapacidad auditiva y su entorno. El sistema integra un dispositivo wearable (guante sensorial) basado en microcontroladores ESP32 y una aplicación móvil desarrollada en React Native, permitiendo la traducción en tiempo real del Lenguaje de Señas Dominicano (MSD) a texto y audio.

## Objetivos del Proyecto

* **Traducción en Tiempo Real:** Procesamiento de datos de sensores de flexión para la interpretación de gestos.
* **Módulo de Aprendizaje:** Interfaz educativa para la práctica estática de señas mediante gamificación.
* **Persistencia de Datos:** Gestión de perfiles de usuario y progreso académico a través de Firebase.

## Arquitectura del Repositorio

El proyecto se organiza bajo una estructura de monorepo para facilitar la integración continua:

* **/app**: Núcleo de la aplicación móvil. Implementado con Expo Router, TypeScript y arquitectura de componentes.
* **/hardware**: Firmware del sistema embebido. Contiene la lógica de lectura de sensores analógicos y protocolos de comunicación BLE (Bluetooth Low Energy).
* **/docs**: Documentación técnica, diagramas de casos de uso UML, diagramas de flujo de procesos y especificaciones de diseño.

## Especificaciones Técnicas

* **Frontend:** React Native (Expo SDK 50+), TypeScript.
* **Backend/BaaS:** Firebase Auth, Firestore.
* **Hardware:** ESP32 DevKit V1, Sensores de flexión.
* **Comunicación:** Protocolo BLE para baja latencia entre hardware y dispositivo móvil.

## Equipo de Desarrollo - Beta POMAVID 2026

* **Líder de Proyecto:** Francisco Lora
* | Rol | Integrantes |
| :--- | :--- |
| *Frontend* | Julio, Berni, Angel, Brian, Elhian, Kevin, Raylin, Fraudi |
| *Backend* | Bryan, Miguel, Leni, Naymon, Adhelyis |

## Instalación y Configuración

1. Clonar el repositorio: `git clone https://github.com/CHEFFD3V/HandlyGo.git`
2. Instalar dependencias de la aplicación: `cd app && npm install`
3. Ejecutar el entorno de desarrollo: `npx expo start`