# Decisiones del proyecto — Looney AI Chat

## 1. Enfoque del proyecto

- Se decidió mantener **Looney AI Chat como un POC educativo**, priorizando la comprensión del código, la separación de responsabilidades y la facilidad de revisión por encima de una arquitectura orientada a producción.

- Se adoptó un desarrollo progresivo, siguiendo el flujo:

  **Desarrollo → Testing → Correcciones → Mejoras → Testing final → Documentación → Commit → Push**

- Las mejoras se incorporaron de forma incremental y fueron verificadas antes de continuar con la siguiente etapa.

- Se evitó agregar funcionalidades que no fueran necesarias para cumplir el objetivo actual del proyecto.

## 2. Arquitectura y estructura

- Se decidió mantener una **arquitectura sencilla**, evitando patrones, capas o abstracciones que no aportaran valor al POC.
- Se priorizó una estructura de archivos fácil de localizar y comprender.
- Se evitó crear archivos auxiliares o configuraciones adicionales cuando podían resolverse de manera simple dentro de la estructura existente.
- Se mantuvo una separación clara entre la interfaz, la lógica del chat y las utilidades.
- Se decidió conservar `"type": "commonjs"` en `package.json`, ya que cambiar el sistema de módulos no era necesario para el proyecto.
- Se evitó incorporar dependencias adicionales únicamente para resolver problemas particulares que no aportaran valor funcional.

## 3. Navegación

- Se decidió utilizar una navegación tipo **SPA**, sin incorporar un framework adicional.
- Para gestionar las rutas se utilizó la **History API**, permitiendo cambiar entre vistas sin recargar completamente la aplicación.
- Se mantuvieron las rutas principales:
  - `/home`
  - `/chat`
  - `/about`

- No se incorporó un sistema de routing externo porque la cantidad de vistas existentes no lo requiere.
- La navegación se mantuvo deliberadamente sencilla y acorde con el carácter educativo del proyecto.

## 4. Identificación de personajes

- Se decidió utilizar el parámetro **`character`** para identificar el personaje seleccionado.
- Esta identificación permite que la interfaz y la lógica del chat sepan qué personaje está activo sin depender del nombre visible del personaje.
- Se mantuvo este mecanismo como una solución simple y suficiente para el alcance actual.

## 5. Chat e historial

- Se decidió mantener un **historial independiente por personaje**, evitando mezclar las conversaciones de los distintos personajes.
- Se utilizó **`localStorage`** para conservar las conversaciones en el navegador.
- Se incorporó un **panel de conversaciones** para consultar y continuar los historiales disponibles.
- La persistencia se mantiene actualmente en el frontend, sin incorporar un backend para almacenamiento de conversaciones.
- Los saludos iniciales se definieron de forma **personalizada para cada personaje**.
- Se mantuvo la posibilidad de limpiar la conversación correspondiente al personaje seleccionado.

## 6. Testing

- Se decidió utilizar **Vitest** como herramienta de pruebas del proyecto.

- No se instaló `jsdom`, ya que incorporar una nueva dependencia únicamente para proporcionar un entorno DOM completo no aportaba suficiente valor para el POC.

- Se realizaron adaptaciones controladas en la lógica de `chat.js` para facilitar la prueba de sus funciones sin modificar innecesariamente la arquitectura.

- Se priorizó que las pruebas verificaran la lógica relevante del proyecto y no que la aplicación se adaptara de forma excesiva al entorno de testing.

- Se probaron tanto casos normales como situaciones anómalas relacionadas con rutas, personajes, mensajes y almacenamiento local.

- La validación automática final obtuvo:

  ```text
  Test Files  2 passed
  Tests       39 passed
  ```

- También se realizó una **validación manual en el navegador** para comprobar el comportamiento de la aplicación más allá de las pruebas automatizadas.

## 7. Mejoras visuales y de interacción

- Se decidió mejorar la experiencia visual y de navegación sin aumentar innecesariamente la complejidad del proyecto.
- Se incorporó un encabezado general con el nombre **Looney AI Chat**.
- Se mantuvo una navegación visible entre `Home`, `Chat` y `About`.
- Se mejoró la presentación de los personajes mediante información adicional como personalidad y saludo.
- Se mantuvo la separación del historial por personaje durante estas mejoras.
- Las modificaciones se limitaron a los cambios necesarios para mejorar la experiencia sin introducir una arquitectura adicional.

## 8. Validación final

- Se decidió realizar una revisión final después de completar las mejoras.
- Se verificaron nuevamente las pruebas automatizadas y el funcionamiento manual de la aplicación.
- Se comprobó que los cambios realizados no introdujeran regresiones en las funcionalidades existentes.
- No se añadieron nuevas funcionalidades durante esta etapa; el objetivo fue validar el estado alcanzado antes de pasar a la documentación y cierre.

## 9. Alcance y complejidad

- Se decidió **no resolver mediante complejidad adicional las particularidades internas de los tests** cuando estas no representaban un problema real del funcionamiento de la aplicación.
- Se priorizó mantener el código comprensible para un proyecto educativo antes que optimizarlo para escenarios que actualmente no forman parte de su alcance.
- Se evitó incorporar funcionalidades futuras de manera anticipada.
- Las decisiones se tomaron considerando el estado real del proyecto y no necesidades hipotéticas.

## 10. Integración con Gemini

- Se decidió mantener **Gemini para una etapa posterior**.
- El proyecto actual se mantiene como una POC frontend funcional, sin incorporar todavía la integración con el servicio de IA.
- El archivo `.env.example` deja preparada la variable `GEMINI_API_KEY` como referencia para esa futura integración.
- La integración futura podrá abordarse como una etapa independiente, evitando añadir complejidad prematuramente al estado actual.

## 11. Producción y deployment

- Se decidió mantener el **deployment final en Vercel para una etapa posterior**.
- Primero se priorizó completar y validar el proyecto antes de abordar su publicación definitiva.
- Durante la validación local con `npx vercel dev` se comprobó que la navegación interna funciona correctamente.
- Se observó que una recarga directa mediante `F5` sobre rutas como `/chat` o `/chat?character=...` puede devolver `404` en el entorno local.
- No se incorporó una configuración adicional únicamente para resolver este comportamiento, ya que no forma parte del alcance actual del POC.
- La publicación definitiva y cualquier configuración específica de producción se evaluarán durante la etapa de deployment.

## 12. Principio general de las decisiones

Las decisiones del proyecto siguieron un criterio común:

> **Mantener la solución lo más sencilla posible, incorporando únicamente la complejidad necesaria para cumplir el objetivo del POC y poder probar, comprender y mantener el código con facilidad.**

Las futuras integraciones o mejoras, como **Gemini** y el **deployment definitivo**, se consideran nuevas etapas del proyecto y deberán evaluarse y validarse de forma independiente.
