# Documentación: Handly Go

**Preview de la aplicación:**

![documentation_preview.svg](assets/images/documentation/documentation_preview.svg)

La aplicación **HandlyGo** es una plataforma interactiva enfocada en la traducción en tiempo real y el aprendizaje progresivo del lenguaje de señas mediante un guante inteligente.

El flujo inicia con la apertura de la aplicación, accediendo directamente al menú principal (Home), desde donde el usuario puede navegar entre los módulos principales: Traductor, Aprendizaje y Configuración.

La aplicación se centra en dos funcionalidades principales:

- **Traducción en tiempo real (con el guante)**
- **Aprendizaje interactivo por niveles**

Además, incorpora elementos de gamificación como el sistema de XP para motivar el progreso del usuario.

**1. Módulo de Pantalla de Bienvenida (Conversión y Propósito)**

![splash_.screen](assets/images/documentation/documentation/01_splash_.screen.svg)

Esta pantalla funciona como punto de entrada a la aplicación, presentando una interfaz limpia y directa.

**Propósito:**

- Introducir al usuario a la experiencia de HandlyGo  
- Mostrar identidad visual de la aplicación  
- Permitir el acceso inmediato mediante un botón de continuación  

**Elemento principal:**

- Botón "Continuar": permite acceder al Home

[onboarding_bienvenida](assets/images/documentation/documentation/02_onboarding_bienvenida.svg)

**2. Módulo Home (Dashboard Principal): Componentes internos:**

![home_traductor](assets/images/documentation/documentation/03_home_traductor.svg)

Esta pantalla corresponde al módulo principal de la aplicación, donde el usuario puede visualizar información general y acceder a la función de traducción.

**Funcionalidad principal:**
Servir como punto de inicio y permitir al usuario comenzar el proceso de traducción, además de mostrar un resumen de su actividad.

**Elementos visibles en la interfaz:**

**1. Logo de la aplicación**
- Ubicado en la parte superior  
- Función: Identificar visualmente la aplicación  

**2. Mensaje principal**
- Texto de bienvenida o frase informativa  
- Función: Introducir al usuario a la experiencia dentro de la app  

**3. Gestos realizados hoy**
- Muestra la cantidad de gestos ejecutados durante el día  
- Función: Dar un resumen de la actividad diaria del usuario  

**4. Gestos recientes**
- Lista o visualización de las palabras o gestos realizados recientemente  
- Función: Permitir al usuario ver su actividad más reciente  

**5. Botón “Empezar a traducir”**
- Tipo: Botón interactivo  
- Función: Iniciar el proceso de traducción  

**6. Área de traducción**
- Ubicada en la parte inferior (caja de texto)  
- Función: Mostrar el contenido traducido  

**Comportamiento:**
- Al presionar el botón “Empezar a traducir”, el sistema comienza a procesar los gestos  
- El resultado se muestra en la caja de texto inferior en tiempo real  

**Objetivo del módulo:**
Permitir al usuario acceder rápidamente a la función de traducción y visualizar su actividad reciente de forma clara y sencilla.

**3. Módulo: Estado del Guante**

[emparejamiento_dispositivo](assets/images/documentation/documentation/04_emparejamiento_dispositivo_1.svg)

Esta pantalla permite al usuario visualizar el estado actual del guante inteligente, incluyendo su conexión y nivel de batería.

**Funcionalidad principal:**
Mostrar si el guante está conectado o no, así como el nivel de batería disponible, para asegurar su correcto funcionamiento.

**Elementos visibles en la interfaz:**

**1. Logo de la aplicación**
- Ubicado en la parte superior  
- **Función:** Identificar visualmente la aplicación  

**2. Representación del guante**
- Elemento visual principal de la pantalla  
- **Función:** Mostrar el dispositivo con el que se está trabajando  

**3. Indicador de estado (aro de luz)**
- Rodea el guante  
- **Función:** Indicar el estado de conexión  
- **Estados:**
- Verde → Guante conectado  
- Rojo → Guante desconectado  
- **Comportamiento:** Dinámico (cambia según el estado real del dispositivo)  

**4. Información de conexión**
- **Texto:** “Conexión Bluetooth con el guante”  
- **Función:** Informar el tipo de conexión utilizada  

**5. Botón de estado**
- **Texto dinámico:**
- “Guante emparejado” (cuando está conectado)  
- “Guante desconectado” (cuando no está conectado)  
- **Tipo:** Botón interactivo  
- **Función:** Reflejar el estado actual del dispositivo  

**6. Indicador de batería**
[emparejamiento_dispositivo](assets/images/documentation/documentation/05_emparejamiento_dispositivo_2.svg)

[emparejamiento_dispositivo](assets/images/documentation/documentation/06_emparejamiento_dispositivo_3.svg)

- Muestra el porcentaje de batería del guante   
- **Función:** Informar al usuario sobre el nivel de energía disponible  

**Ubicación dentro de la app:**
- Este módulo se encuentra accesible desde la barra de navegación inferior (nav), como una de las opciones principales junto al Home.

**Objetivo del módulo:**
Permitir al usuario conocer en todo momento el estado del guante y su nivel de batería para garantizar un uso adecuado del sistema.

**4. Módulo: Aprendizaje:**

[aprendizaje_menu](assets/images/documentation/documentation/07_aprendizaje_menu.svg)

Este módulo permite al usuario acceder al contenido educativo de la aplicación, organizado por niveles, donde puede aprender y practicar el lenguaje de señas de forma progresiva.

Además, el módulo fue diseñado considerando dos modos de visualización:

* Modo claro
* Modo oscuro

Ambos modos están completamente soportados y se trabajará con ambas versiones para garantizar una buena experiencia visual en diferentes condiciones de uso.

**Funcionalidad principal**

Guiar al usuario a través de diferentes niveles de aprendizaje, permitiéndole visualizar, practicar y repetir gestos según el contenido de cada lección.

**El sistema está estructurado en:**

* 3 niveles de aprendizaje.
* Cada nivel contiene 3 lecciones.
* Total: 9 lecciones.

[aprendizaje_nivel_1](assets/images/documentation/documentation/08_aprendizaje_nivel_1.svg)

[aprendizaje_nivel_2](assets/images/documentation/documentation/09_aprendizaje_nivel_2.svg)

[aprendizaje_nivel_3](assets/images/documentation/documentation/10_aprendizaje_nivel_3.svg)

**Cada lección incluye:**

* Una breve descripción del contenido.
* Visualización del gesto.
* Interacción mediante botones.

1. Pantalla principal de aprendizaje

aprendizaje_menu

**Elementos visibles:**

1. Mensaje de bienvenida

Introduce al usuario a la zona de aprendizaje
Explica brevemente el propósito del módulo

2. Indicadores de progreso

XP ganado: representa la experiencia acumulada
Días estudiando: muestra cuántos días ha practicado
Racha: indica la cantidad de días consecutivos de estudio

3. Niveles de aprendizaje

Nivel 1
Nivel 2
Nivel 3

**Tipo:** Botones interactivos

**Función:** Permitir acceder a cada nivel.

2. Pantalla de niveles (mapa de lecciones)

08_aprendizaje_niveles1
09_aprendizaje_nivel_2
10_aprendizaje_nivel_3

**Funcionalidad:**

* Mostrar las lecciones disponibles dentro de cada nivel.

**Elementos:**

1. Mapa de lecciones

* Contiene las diferentes lecciones organizadas visualmente.
* Cada nivel incluye 3 lecciones.
* Cada lección muestra su nombre y una breve descripción.

**Distribución de lecciones:**

Nivel 1:
Lección 1
Lección 2
Lección 3

Nivel 2:
Lección 1
Lección 2
Lección 3

Nivel 3:
Lección 1
Lección 2
Lección 3

2. Botón "Continuar"

Tipo: Botón interactivo
Función: Permitir avanzar en el progreso del nivel

3. Barra superior del nivel

Ejemplo: “Nivel 1 – Letras y abecedario”
Función: Identificar en qué nivel se encuentra el usuario
Comportamiento: Permite regresar a la pantalla anterior
3. Pantallas de lección (práctica)

**Cada lección cuenta con:**

* Imagen representativa del gesto
* Descripción breve de lo que se va a aprender
* Elementos visuales de apoyo
* Botones de interacción
* Nivel 1 – Letras y abecedario

[leccion1_nivel_1](assets/images/documentation/documentation/11_leccion1_nivel_1.svg)

[leccion2_nivel_1](assets/images/documentation/documentation/12_leccion2_nivel_1.svg)

[leccion3_nivel_1](assets/images/documentation/documentation/13_leccion3_nivel_1.svg)

**Funcionalidad:**

Enseñar al usuario los gestos correspondientes al abecedario.

**Elementos:**

* Representación visual del gesto (mano).
* Instrucciones o indicaciones del movimiento.
* Visualización de la letra correspondiente.
* Descripción breve de la lección.

**Botones:**

* Intentar lección: inicia la práctica.
* Continuar: avanza al siguiente flujo.
* Nivel 2 – Palabras básicas.

[leccion1_nivel_2](assets/images/documentation/documentation/14_leccion1_nivel_2.svg)

[leccion2_nivel_2](assets/images/documentation/documentation/15_leccion2_nivel_2.svg)

[leccion3_nivel_2](assets/images/documentation/documentation/16_leccion3_nivel_2.svg)

**Funcionalidad:**

Permitir al usuario practicar palabras mediante gestos.

**Elementos:**

* Visualización del gesto
* Resultado en forma de palabra
* Descripción de la lección

**Botones:**

* Intentar lección
* Continuar
* Nivel 3 – Frases básicas

[leccion1_nivel_3](assets/images/documentation/documentation/17_leccion1_nivel_3.svg)

[leccion2_nivel_3](assets/images/documentation/documentation/18_leccion2_nivel_3.svg)

[leccion3_nivel_3](assets/images/documentation/documentation/19_leccion3_nivel_3.svg)

Funcionalidad:
Permitir la práctica de frases completas mediante gestos.

**Elementos:**

* Representación del gesto.
* Visualización del resultado en forma de frase.
* Descripción de la lección.

**Botones:**

* Intentar lección.
* Continuar.

4. Pantalla de resultado (feedback)

Después de presionar "Continuar", el usuario es llevado a una nueva pantalla (slice).

[resultado_experiencia](assets/images/documentation/documentation/20_resultado_experiencia.svg)

**Funcionalidad:**

Mostrar el resultado de la lección realizada.

**Elementos:**

* Mensaje positivo (ejemplo: “Lo hiciste excelente”).
* XP ganado.
* Refuerzo visual del logro.

**Botones:**

* Continuar: avanza.
* Volver: regresa al módulo de aprendizaje.
* Ubicación dentro de la app.

Este módulo se encuentra en la barra de navegación inferior (nav), representado por el ícono de libro.

**Objetivo del módulo**

Proporcionar una experiencia de aprendizaje estructurada, progresiva y motivadora, permitiendo al usuario mejorar sus habilidades en lenguaje de señas mediante práctica constante, repetición y retroalimentación inmediata.

### 5 Módulo de Configuración (Calibración del Guante)

![configuracion_calibracion](assets/images/documentation/documentation/21_configuracion_calibracion.svg)

**Funcionalidad principal:**
Permitir al usuario visualizar el estado de los sensores del guante y recalibrarlos en caso de que alguno no esté funcionando correctamente.

**Elementos visibles en la interfaz:**

**1. Logo de la aplicación**
- Ubicado en la parte superior.
- Función: Identificación visual de la app.

**2. Representación de la mano**
- Muestra una mano con los cinco dedos.
- Cada dedo representa un sensor del guante.
- Identificación:
  - Dedo 1  
  - Dedo 2  
  - Dedo 3  
  - Dedo 4  
  - Dedo 5  

**3. Indicadores de estado por dedo**
- Cada dedo cambia de color según su estado.

**Estados:**
- Verde → Sensor calibrado correctamente.
- Rojo → Sensor calibrado incorrectamente.

**4. Botones de los dedos**
- Representan cada uno de los sensores. 
- Función: Visualizar el estado individual de cada dedo.

**5. Botón “Calibrar”**
- Tipo: Botón interactivo.
- Función: Recalibrar los sensores del guante. 

**Comportamiento:**
- Al presionar el botón “Calibrar”, el sistema realiza nuevamente el proceso de calibración.
- Si algún sensor no se calibra correctamente, el dedo correspondiente se muestra en color rojo.
- Si la calibración es exitosa, todos los dedos se muestran en color verde.

**Ubicación dentro de la app:**
Este módulo se encuentra en la barra de navegación inferior (nav), representado por el ícono de configuración (tuerca).

**Objetivo del módulo:**
Garantizar que los sensores del guante funcionen correctamente, permitiendo al usuario identificar errores y recalibrar el dispositivo cuando sea necesario.
