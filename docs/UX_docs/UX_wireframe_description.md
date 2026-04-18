# Descripción UX

Este entregable consiste en el diseño UX de una aplicación móvil para la traducción y el aprendizaje del lenguaje de señas mediante un guante inteligente.

El flujo de usuario inicia con la apertura de la aplicación, accediendo directamente al menú principal (Home). Desde allí, el usuario puede navegar entre los módulos principales de la aplicación: Traductor, Aprendizaje y Configuración.

El módulo Traductor (pantalla principal) permite:

- Observar el estado de conexión del guante traductor.  
- Visualizar la traducción en tiempo real de los gestos realizados.  
- Acceder al historial o visualización completa del texto traducido.  

El módulo de Aprendizaje permite al usuario avanzar progresivamente a través de lecciones estructuradas, donde se presentan contenidos como letras, números u otros gestos, organizados por niveles que se desbloquean según el progreso del usuario.

El módulo de Configuración está enfocado en la calibración de los sensores del guante, permitiendo ajustar su funcionamiento para mejorar la precisión en la detección de gestos. 

El módulo de Emparejamiento permite:

- Conectar el guante en caso de que se encuentre desconectado.

- Observar el nivel de batería del guante.

El módulo de Aprendizaje permite:

- Un sistema por niveles para enseñar lenguaje de señas mediante ejercicios interactivos.

- Durante las lecciones, el usuario tendrá la opción de repetir si gusta.

* Contar con un sistema de experiencia (XP) y conteo de racha del usuario.

El sistema de progreso está basado en la acumulación de experiencia (XP) y en el seguimiento de la racha de uso del usuario. Cada vez que el usuario completa una lección y presiona el botón *“Continuar”*, se le otorga automáticamente una cantidad de XP.

Este proceso *no incluye validación del desempeño*, ya que actualmente no existe un mecanismo que permita verificar si la lección fue realizada correctamente. Por lo tanto:

* El otorgamiento de XP es automático
* Se basa únicamente en la finalización de la lección
* No depende de precisión ni evaluación del gesto

Además, cada interacción contribuye al mantenimiento o incremento de la *racha de estudio*, incentivando la constancia dentro del módulo de aprendizaje.

El módulo de Configuración permite:

El módulo de Configuración está enfocado en la calibración de los sensores flex del guante inteligente, con el objetivo de optimizar la precisión en la detección e interpretación de los gestos. A través de esta funcionalidad, el sistema ajusta los valores de los sensores según la posición de la mano del usuario, permitiendo una experiencia más precisa y personalizada en el uso del dispositivo.