# Protocolo de Gestión de Ramas - HandlyGo

Para mantener la integridad del código y facilitar la integración continua, el equipo de HandlyGo adoptará el siguiente estándar de Git.

## 1. Estructura de Ramas Principales

* **`main`**: Rama de producción. Solo contiene código estable, probado y listo para presentación. Nadie realiza commits directos aquí.
* **`develop`**: Rama de integración. Aquí se consolidan todas las funcionalidades terminadas antes de pasar a `main`.

## 2. Nomenclatura de Ramas de Trabajo (Feature Branches)

Cada integrante del equipo debe crear una rama específica para la tarea que está realizando, partiendo siempre desde `develop`.

**Formato:** `tipo/descripcion-breve`

### Tipos permitidos:

* `feat/`: Para nuevas funcionalidades (Ej: `feat/conexion-bluetooth`, `feat/pantalla-aprendizaje`).
* `fix/`: Para corrección de errores (Ej: `fix/error-lectura-sensor`, `fix/estilos-boton`).
* `docs/`: Para cambios solo en documentación (Ej: `docs/actualizar-readme`).
* `refactor/`: Para mejoras en el código que no cambian la funcionalidad.

## 3. Flujo de Trabajo (Workflow)

1.  Sincronizar localmente: `git checkout develop` seguido de `git pull origin develop`.
2.  Crear rama de tarea: `git checkout -b feat/nombre-tarea`.
3.  Realizar commits descriptivos: `git commit -m "feat: implementar interfaz de traductor"`.
4.  Subir rama al servidor: `git push origin feat/nombre-tarea`.
5.  Solicitar **Pull Request (PR)** hacia la rama `develop` para revisión del Líder Técnico.

## 4. Reglas de Oro

* **Prohibido** subir código que no compile o que rompa la ejecución de la App.
* **Actualización Constante:** Antes de empezar a trabajar, siempre hacer un `pull` de la rama `develop`.
* **Commits Atómicos:** Realizar commits pequeños y específicos en lugar de uno gigante al final del día.
