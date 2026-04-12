Documentación: Handly Go

**Introducción:\
**HandlyGo es una solución tecnológica innovadora enfocada en la
inclusión y la accesibilidad comunicativa. Su propósito principal es
eliminar las barreras de comunicación entre personas sordas y oyentes
mediante el uso de un guante inteligente capaz de interpretar la Lengua
de Señas Dominicana (LSD) y traducirla a voz en tiempo real.

Además, el sistema se complementa con una aplicación educativa
interactiva que permite a cualquier persona aprender lengua de señas de
manera progresiva, práctica y accesible.

Esta combinación de hardware y software convierte a HandlyGo en una
herramienta integral que no solo facilita la comunicación, sino que
también promueve la educación inclusiva y la integración social.

![](./image1.png){width="6.607717629046369in"
height="6.208333333333333in"}**Diagrama:**

**Preview de la aplicación:**

![](./image2.png){width="2.6875in"
height="2.532638888888889in"}**\
**La aplicación **HandlyGo** es una plataforma interactiva que integra
autenticación de usuarios, aprendizaje progresivo de lengua de señas y
un sistema de traducción en tiempo real mediante un guante inteligente.

El flujo inicia con el acceso del usuario (inicio de sesión o registro),
continúa con un menú principal donde puede elegir entre aprender,
traducir o configurar la aplicación, y se divide en dos grandes
funcionalidades:

-   **Traducción en tiempo real (con el guante)**

-   **Aprendizaje interactivo por niveles**

Además, incluye configuraciones personalizables y validaciones en cada
paso para garantizar una experiencia fluida.

![](./image3.png){width="1.7652373140857394in"
height="3.688678915135608in"}**1. Módulo de Inicio y Onboarding**

Este módulo no solo valida la sesión, sino que también establece la
identidad visual de la marca.

**Submódulos:**

**Splash Screen:** No es solo una imagen estática; es el momento en el
que la aplicación prepara el entorno de ejecución.

**Propósito visual:** Reforzar el *branding*. Se muestra el isotipo de
la mano azul con una animación de "pulso" o una entrada suave
(*fade-in*), junto al nombre de la marca.

La duración oscila entre 2.5 y 3 segundos, un tiempo óptimo para no
frustrar al usuario y, al mismo tiempo, permitir que los procesos se
carguen correctamente.

![](./image4.png){width="1.9375in"
height="3.3027777777777776in"}**2. Módulo de Pantalla de Bienvenida
(Conversión y Propósito)**

Esta es la "puerta de entrada" para los usuarios que no han iniciado
sesión. Su diseño debe ser extremadamente limpio para no abrumar.

**Arquitectura de la información:**

**Eslogan de impacto:** "Comunícate sin barreras". Este texto no es solo
decorativo, sino que define la misión social de **HandlyGo**.

![](./image5.png){width="1.7493055555555554in"
height="3.125in"}**3. Módulo Home (Dashboard Principal):\
Componentes internos:**

**1. Botón de notificaciones**

-   **Tipo:** Botón interactivo

-   **Función:** Mostrar alertas del sistema (mensajes, recordatorios y
    actualizaciones)

**2. Logo de la aplicación**

-   **Tipo:** Elemento visual (branding)

-   **Función:** Identificación de la app

-   **Comportamiento:** Estático (no interactivo o puede redirigir al
    inicio)

**3. Botón de configuración**

-   **Tipo:** Botón interactivo

-   **Función:** Redirigir al módulo de configuración

-   **Evento:** onClick → navegación a ajustes

**Área principal:**

**4. Texto de traducción**

-   **Tipo:** Texto dinámico

-   **Fuente:** Sistema de IA del guante

-   **Función:** Mostrar en tiempo real la interpretación del gesto

**5. Indicador de estado del guante**

-   **Tipo:** Etiqueta de estado (badge)

-   **Estados posibles:** Conectado / Desconectado

-   **Función:** Informar la disponibilidad del dispositivo

**6. Ícono de Bluetooth**

-   **Tipo:** Ícono visual

-   **Función:** Representar la conexión inalámbrica

-   **Estado dinámico:** Activo / Inactivo

**7. Indicador de precisión**

-   **Tipo:** Métrica porcentual

-   **Fuente:** Algoritmo de reconocimiento

-   **Función:** Mostrar el nivel de exactitud del gesto detectado

**Historial y métricas:**

**8. Historial de gestos (gestos recientes)**

-   **Tipo:** Lista dinámica

-   **Fuente:** Registro de actividad del usuario

-   **Contenido:**

    -   Nombre del gesto

    -   Estado (correcto / incorrecto)

-   **Indicadores:**

    -   Correcto → ejecución válida

    -   Incorrecto → error en la ejecución

-   **Función:** Permitir al usuario visualizar su desempeño reciente

**9. Racha de uso**

-   **Tipo:** Indicador numérico

-   **Fuente:** Sistema de seguimiento de actividad

-   **Unidad:** Días consecutivos

-   **Función:** Motivar la constancia del usuario en el aprendizaje

**10. Gestos realizados hoy**

-   **Tipo:** Contador

-   **Fuente:** Actividad diaria del usuario

-   **Función:** Mostrar la cantidad de interacciones realizadas en el
    día

-   **Uso:** Medición de productividad o práctica diaria

**Navegación:**

**11. Barra de navegación inferior (Bottom Navigation)**

Componentes:

**11.1. Botón de aprendizaje**

-   **Ícono:** Libro

-   **Función:** Acceder al módulo educativo

-   **Evento:** Navegación a "Aprendizaje"

**11.2. Botón de inicio**

-   **Ícono:** Casa

-   **Función:** Redirigir al Dashboard

-   **Estado:** Activo cuando está seleccionado

**11.3. Botón de traductor/conexión**

-   **Ícono:** Enlace o conexión

-   **Función:** Acceso al módulo del guante

-   **Evento:** Navegación a traducción

![](./image6.png){width="2.0208333333333335in"
height="3.5930555555555554in"}**4. Módulo: Conexión y Estado del
Guante**

**Este módulo permite visualizar y gestionar la conexión entre la
aplicación HandlyGo y el guante inteligente mediante tecnología
Bluetooth. Su objetivo es asegurar que el dispositivo esté correctamente
emparejado y listo para enviar datos de traducción en tiempo real.**

**Componentes del módulo:**

**1. Visualización del dispositivo (guante)**

**1.1. Imagen del guante**

-   **Tipo: Elemento gráfico representativo**

-   **Función: Mostrar visualmente el dispositivo conectado**

-   **Estado dinámico: Puede cambiar (activo / inactivo)**

**1.2. Efecto visual (halo de estado)**

-   **Tipo: Indicador visual**

-   **Función: Representar el estado de conexión del dispositivo**

-   **Estados posibles:**

    -   **Verde → Conectado**

    -   **Gris o rojo → Desconectado**

**2. Estado de conexión**

**2.1. Indicador de estado de conexión**

-   **Tipo: Etiqueta dinámica (status label)**

-   **Función: Mostrar el estado actual del dispositivo en tiempo real**

-   **Texto: "CONECTADO"**

-   **Estados posibles:**

    -   **Conectado**

    -   **Desconectado**

**3. Información de conexión**

**3.1. Texto informativo de conexión**

-   **Tipo: Texto dinámico**

-   **Fuente: Sistema de conexión Bluetooth**

-   **Ejemplo: "Conexión Bluetooth con ESP32 DevKit V1"**

-   **Función:**

    -   **Indicar el tipo de conexión utilizada (Bluetooth)**

    -   **Mostrar el dispositivo específico (ESP32)**

    -   **Confirmar el canal de comunicación**

**4. Gestión de emparejamiento**

**4.1. Botón de emparejamiento**

-   **Tipo: Botón interactivo / indicador de estado**

-   **Texto: "GUANTE EMPAREJADO"**

-   **Evento: Gestión de conexión**

-   **Función:**

    -   **Confirmar que el guante está vinculado**

    -   **Permitir acciones como:**

        -   **Reconectar**

        -   **Desemparejar**

        -   **Buscar dispositivo**

**5. Indicadores de batería**

**5.1. Indicadores de batería del guante**

-   **Tipo: Indicadores visuales**

-   **Cantidad: 2 (sensores o módulos del guante)**

-   **Función: Mostrar el nivel de energía de los componentes del
    guante**

![](./image7.png){width="2.501388888888889in" height="5.40625in"}\
**5. Módulo: Aprendizaje (Pantalla de niveles):**\
Este módulo permite al usuario acceder a los niveles de aprendizaje y
visualizar su progreso general dentro de la aplicación.

**Componentes:**

**1. Encabezado de bienvenida**

-   **Tipo:** Texto dinámico

-   **Función:** Mostrar un mensaje motivacional personalizado

-   **Características:**

    -   Incluye el nombre del usuario

    -   Refuerza la experiencia personalizada

**2. Sección de niveles**

-   **Tipo:** Lista interactiva

-   **Función:** Permitir la selección de contenido educativo

-   **Niveles disponibles:**

    -   Nivel 1: Letras y abecedario

    -   Nivel 2: Palabras básicas

**3. Panel de estadísticas**

-   **Tipo:** Panel informativo

-   **Función:** Medir y mostrar el progreso del usuario

-   **Indicadores:**

    -   XP ganado

    -   Días estudiados

    -   Errores cometidos

**4. Barra de navegación inferior**

-   **Tipo:** Menú de navegación

-   **Función:** Facilitar el acceso rápido a otras secciones de la
    aplicación

-   **Accesos:**

    -   Aprendizaje

    -   Inicio

    -   Conexión

![](./image8.png){width="1.8611111111111112in"
height="4.114583333333333in"}**6. Módulo: Ejecución de gesto (Intento)**

**Función:** Permitir al usuario practicar los gestos aprendidos
mediante la ejecución guiada.

**Componentes:**

**1. Área de visualización**

-   **Tipo:** Área interactiva / visual

-   **Función:** Mostrar el gesto a realizar

-   **Características:**

    -   Puede incluir animaciones o guías visuales

    -   Facilita la comprensión del movimiento

**2. Estado del guante**

-   **Tipo:** Indicador de estado

-   **Función:** Mostrar si el dispositivo está conectado o desconectado

-   **Importancia:** Condiciona la interacción del usuario con el
    sistema

**3. Botón "Intentar"**

-   **Tipo:** Botón interactivo

-   **Función:** Iniciar la práctica del gesto seleccionado

**4. Botón "Repetir"**

-   **Tipo:** Botón interactivo

-   **Función:** Permitir repetir la lección o el gesto actual

**5. Barra de retroceso**

-   **Tipo:** Control de navegación

-   **Función:** Regresar a la pantalla anterior

![](./image9.png){width="1.7708333333333333in"
height="3.9583333333333335in"}**7. Módulo: Progreso de lección:** Su
función es mostrar el avance del usuario dentro de una lección.

**Componentes:**

1.  **Indicador de progreso:** En esta parte se puede apreciar la
    representación visual del avance del usuario y muestra los pasos
    completados.

**1.2. Estado del guante:** Verifica conexión activa

**1.3. Marcadores de avance:** Señalan pasos completados correctamente

**1.4. Botón "Intentar":** Permite continuar práctica

**1.5. Botón "Repetir":** Reinicia intento

![](./image10.png){width="1.7601968503937009in"
height="3.978669072615923in"}**8. Módulo: Visualización de gesto
(Aprendizaje guiado):** Enseñar al usuario cómo realizar correctamente
un gesto específico.

**Componentes:**

**1.1. Representación del gesto:** Imagen o animación

-   Ejemplo: letra "A"

**1.2. Descripción del gesto:** Explicación textual y guía de ejecución.

**1.3. Botón "Intentar"**

-   Lleva a la práctica

**1.4. Botón "Repetir"**

-   Reproduce explicación

**9. Módulo: Resultado de
lección**![](./image11.png){width="1.7916666666666667in"
height="3.952777777777778in"}**:** Se muestra el resultado final tras
completar una lección.

**Componentes:**

1.  **Mensaje de éxito**

-   "¡Excelente!"

-   Refuerza logro

**1.2. Confirmación de lección completada**

-   Indica finalización

**1.3. Recompensa XP**

-   Cantidad de experiencia ganada

**1.4. Barra de progreso**

-   Visualiza incremento de XP

**1.5. Botón "Siguiente"**

-   Avanza a la siguiente lección

![](./image12.png){width="1.7710804899387576in"
height="3.8963768591426073in"} **10. Módulo: Configuración:** En este
apartado se le permite al usuario personalizar la aplicación y gestionar
su cuenta.\
En esta pantalla sale el usuario y correo que lo identifica.

**Componentes:**

**1.2. Ajuste de apariencia**

-   Modo claro/oscuro

**1.3. Configuración de idioma**

-   Español

**1.4. Estado del guante**

-   Indica si está emparejado
