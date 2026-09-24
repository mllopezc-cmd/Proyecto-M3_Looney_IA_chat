<a id="inicio"></a>

# Decisiones del proyecto — Looney AI Chat

## 1. Enfoque del proyecto

- Se decidió mantener **Looney AI Chat como un POC educativo**, priorizando la comprensión del código, la separación de responsabilidades y la facilidad de revisión por encima de una arquitectura orientada a producción.

- Se adoptó un desarrollo progresivo, siguiendo el flujo:

  **Desarrollo → Testing → Correcciones → Mejoras → Testing final → Documentación → Commit → Push**

- Las mejoras se incorporaron de forma incremental y fueron verificadas antes de continuar con la siguiente etapa.

- Se evitó agregar funcionalidades que no fueran necesarias para cumplir el objetivo del proyecto.

- Se priorizaron cambios pequeños y controlados para reducir el riesgo de introducir regresiones.

- Se decidió mantener una cantidad reducida de dependencias y evitar herramientas o abstracciones que no aportaran un beneficio claro al alcance del POC.

## 2. Arquitectura y estructura

- Se decidió mantener una **arquitectura sencilla**, evitando patrones, capas o abstracciones que no aportaran valor al POC.

- Se priorizó una estructura de archivos fácil de localizar y comprender.

- Se evitó crear archivos auxiliares o configuraciones adicionales cuando podían resolverse de manera simple dentro de la estructura existente.

- Se mantuvo una separación clara entre:
  - interfaz y navegación;
  - lógica del chat;
  - funciones utilitarias;
  - integración backend.

- El proyecto utiliza **ES Modules**, manteniendo `"type": "module"` en `package.json`, debido a que este sistema de módulos es compatible con la estructura actual.

- Se evitó incorporar dependencias adicionales únicamente para resolver problemas particulares que no aportaran valor funcional al POC.

- La integración con Gemini se implementó mediante `fetch`, sin incorporar un SDK adicional de Google.

## 3. Navegación y SPA

- Se decidió utilizar una navegación tipo **SPA**, sin incorporar un framework adicional.

- Para gestionar las rutas se utilizó la **History API**, permitiendo cambiar entre vistas sin recargar completamente la aplicación.

- Se mantuvieron las rutas principales:
  - `/home`
  - `/chat`
  - `/about`

- Se incorporó el parámetro de consulta `character` para identificar el personaje activo dentro de `/chat`.

- No se incorporó un sistema de routing externo porque la cantidad de vistas existentes no lo requiere.

- Se mantuvo una solución deliberadamente sencilla y acorde con el carácter educativo del proyecto.

- Durante las mejoras de navegación se mantuvieron los controles de historial del navegador, permitiendo utilizar correctamente **Back** y **Forward**.

## 4. Identificación de personajes

- Se decidió utilizar el parámetro **`character`** para identificar el personaje seleccionado.

- Los identificadores actuales son:
  - `bugs` → Bugs Bunny
  - `silvestre` → Silvestre
  - `lucas` → Pato Lucas

- Esta identificación permite que la interfaz y la lógica del chat sepan qué personaje está activo sin depender del nombre visible.

- Se mantuvo este mecanismo como una solución simple y suficiente para el alcance actual.

- Se decidió conservar información específica de cada personaje, incluyendo:
  - nombre;
  - descripción;
  - personalidad;
  - saludo inicial.

- Los saludos se mantienen personalizados para cada personaje.

- Las particularidades de escritura presentes en algunos saludos forman parte intencional del estilo de los personajes y no deben ser corregidas como si fueran errores accidentales.

## 5. Chat e historial

- Se decidió mantener un **historial independiente por personaje**, evitando mezclar las conversaciones.

- Se utilizó **`localStorage`** para conservar las conversaciones en el navegador.

- Se incorporó un **panel de conversaciones** para consultar y continuar historiales disponibles.

- La persistencia de conversaciones se mantiene en el frontend, sin incorporar una base de datos para almacenar los historiales.

- Se mantuvo la posibilidad de limpiar la conversación correspondiente al personaje seleccionado.

- Se verificó que las conversaciones permanecieran separadas al cambiar entre Bugs Bunny, Silvestre y Pato Lucas.

- También se verificó que el historial pudiera recuperarse después de navegar entre las diferentes vistas y después de recargar una ruta en producción.

- Se decidió mantener el historial asociado al identificador del personaje, evitando que una conversación afecte a otra.

## 6. Testing

- Se decidió utilizar **Vitest** como herramienta de pruebas del proyecto.

- No se instaló `jsdom`, ya que incorporar una nueva dependencia únicamente para proporcionar un entorno DOM completo no aportaba suficiente valor para el POC.

- Se realizaron adaptaciones controladas en la lógica de `chat.js` para facilitar la prueba de sus funciones sin modificar innecesariamente la arquitectura.

- Se priorizó que las pruebas verificaran la lógica relevante del proyecto y no que la aplicación se adaptara de forma excesiva al entorno de testing.

- Se probaron casos normales y situaciones anómalas relacionadas con:
  - rutas;
  - personajes;
  - mensajes;
  - almacenamiento local;
  - navegación;
  - respuestas de API.

- Durante las mejoras se incorporaron pruebas para verificar que un mensaje vacío o compuesto únicamente por espacios no fuera enviado.

- Se identificó y corrigió un problema en el estado de carga de `chat.js`: el estado `isLoading` se establecía antes de validar el contenido del mensaje, lo que podía dejar bloqueado el chat después de un envío vacío.

- La validación se ajustó para comprobar primero el contenido del mensaje y establecer el estado de carga únicamente cuando existe un mensaje válido.

- Se agregó una prueba de regresión para comprobar que después de un envío vacío se pudiera enviar correctamente un nuevo mensaje.

- La validación automática final alcanzó:

  ```text
  Test Files  2 passed
  Tests       42 passed
  ```

- También se realizó una **validación manual en el navegador** para comprobar el comportamiento de la aplicación más allá de las pruebas automatizadas.

## 7. Mejoras visuales y de interacción

- Se decidió mejorar la experiencia visual y de navegación sin aumentar innecesariamente la complejidad del proyecto.

- Se incorporó un encabezado general con el nombre **Looney AI Chat**.

- Se mantuvo una navegación visible entre `Home`, `Chat` y `About`.

- Se mejoró la presentación de los personajes mediante información adicional como personalidad y saludo.

- Se mantuvo la separación del historial por personaje durante estas mejoras.

- Se adaptó la interfaz para dispositivos móviles, tablets y escritorio mediante estilos responsive.

- Se incorporó una presentación más completa de la información de los personajes sin modificar la lógica principal del chat.

- Se eliminaron estilos CSS heredados que ya no correspondían con la estructura actual de la interfaz.

- Se mantuvo el criterio de realizar cambios visuales controlados sin incorporar frameworks o dependencias adicionales.

## 8. Protección del contenido renderizado

- Durante la revisión del código se identificó que los mensajes de usuario y las respuestas de la API podían terminar renderizándose mediante `innerHTML`.

- Se decidió incorporar una función `escapeHTML()` en [`src/utils.js`](src/utils.js) para escapar caracteres HTML antes de insertar contenido dinámico en la interfaz.

- Esta protección se aplicó tanto a los mensajes del chat como a la vista previa de conversaciones mostrada en la interfaz.

- La solución se mantuvo deliberadamente sencilla y no requirió incorporar nuevas dependencias.

- Se agregaron pruebas automatizadas para verificar el escape de contenido HTML.

- La decisión permitió mantener el uso existente de `innerHTML` sin tener que modificar innecesariamente toda la estrategia de renderizado del proyecto.

## 9. Integración con Gemini

- Inicialmente se decidió mantener Gemini para una etapa posterior, mientras se completaban y validaban las funcionalidades frontend.

- Una vez estabilizadas la navegación, el chat, la persistencia y las pruebas, se decidió incorporar la integración con Gemini como parte de la versión funcional final del POC.

- La integración se implementó mediante la función backend ubicada en [`api/functions.js`](api/functions.js).

- Se optó por utilizar `fetch` directamente en lugar de incorporar un SDK adicional, manteniendo la arquitectura sencilla y reduciendo dependencias.

- La función backend se encarga de:
  - validar el método HTTP;
  - validar el personaje solicitado;
  - validar el contenido de la conversación;
  - obtener `GEMINI_API_KEY` desde las variables de entorno;
  - construir las instrucciones correspondientes al personaje;
  - enviar la conversación a Gemini;
  - procesar la respuesta;
  - devolver la respuesta generada al frontend;
  - manejar errores de la API.

- Se decidió mantener la clave de API fuera del frontend y del repositorio mediante variables de entorno.

- Se mantuvo [`.env.example`](.env.example) como referencia para indicar la variable requerida sin exponer la clave real.

- La integración fue validada mediante pruebas automatizadas y posteriormente mediante pruebas manuales en la aplicación desplegada.

## 10. Revisión y corrección del código

- Después de completar las funcionalidades principales se realizó una revisión general de los archivos de aplicación, estilos, utilidades y pruebas.

- Se buscó corregir problemas reales sin convertir la revisión en una reestructuración innecesaria del proyecto.

- Se identificó el problema relacionado con el estado de carga después de un envío vacío y se corrigió manteniendo la arquitectura existente.

- Se identificó el riesgo de insertar directamente contenido dinámico mediante `innerHTML` y se incorporó `escapeHTML()` como solución controlada.

- Se revisaron estilos CSS heredados que ya no correspondían a la estructura actual y fueron eliminados.

- Se verificó que `fetchData()` debía mantenerse en [`src/utils.js`](src/utils.js), debido a que forma parte de las pruebas existentes aunque no sea utilizada directamente por la lógica actual del chat.

- Se actualizó la información tecnológica mostrada en la vista About para que correspondiera con las herramientas realmente utilizadas en el proyecto.

- Después de estas modificaciones se ejecutaron nuevamente las pruebas automatizadas y se obtuvo el resultado de **42 pruebas aprobadas**.

## 11. Producción y deployment

- Se decidió utilizar **Vercel** como plataforma de deployment del proyecto.

- El deployment se realizó después de completar y validar las funcionalidades principales.

- La aplicación se encuentra actualmente desplegada en Vercel:

  [Looney AI Chat — Demo](https://proyecto-m3-looney-ia-chat-ocned15iw-looney-ai-chat.vercel.app)

- Durante la validación de producción se comprobaron:
  - navegación entre Home, Chat y About;
  - selección de personajes;
  - conversaciones independientes;
  - generación de respuestas mediante Gemini;
  - persistencia del historial;
  - navegación Back/Forward;
  - recarga directa de las rutas;
  - recarga mediante `F5`;
  - rutas con `character` mediante query string.

- Se decidió mantener la configuración de deployment fuera del código de la aplicación cuando Vercel permitiera resolver el comportamiento directamente desde su configuración.

## 12. Manejo de rutas SPA en producción

- Durante la validación local con `npx vercel dev` se observó que una recarga directa mediante `F5` sobre rutas como `/chat` o `/chat?character=...` podía devolver `404`.

- Inicialmente se decidió no incorporar un `vercel.json` únicamente para resolver este comportamiento local, ya que la navegación interna de la SPA funcionaba correctamente.

- Durante la preparación de producción se resolvió el comportamiento de las rutas mediante **CDN Routing Rules de Vercel**.

- Las reglas utilizadas realizan los siguientes rewrites:

  ```text
  /chat  → /
  /about → /
  /home  → /
  ```

- Esta solución permite que las rutas SPA puedan ser recargadas directamente en producción sin devolver `404`.

- Se decidió no agregar un `vercel.json`, evitando incorporar un archivo adicional al repositorio cuando la misma necesidad podía resolverse mediante la configuración de Vercel.

- La diferencia entre el comportamiento local y el comportamiento de producción se mantiene documentada como una consideración del entorno de desarrollo.

## 13. Validación final

- Se decidió realizar una revisión final después de completar las mejoras y la integración con Gemini.

- Se verificaron nuevamente las pruebas automatizadas y el funcionamiento manual de la aplicación.

- La validación automática final alcanzó **42 pruebas aprobadas**.

- La validación manual confirmó el funcionamiento de:
  - navegación SPA;
  - selección de personajes;
  - conversaciones independientes;
  - persistencia mediante `localStorage`;
  - limpieza del historial;
  - estados de carga;
  - manejo de errores;
  - integración con Gemini;
  - navegación hacia atrás y adelante;
  - recarga de rutas en producción;
  - recarga mediante `F5`;
  - diseño responsive.

- Se realizó además una revisión final del código para identificar errores, código heredado y posibles mejoras sin aumentar innecesariamente la complejidad.

- Después de la revisión se confirmó que no era necesario incorporar nuevas dependencias ni nuevos archivos para completar el alcance definido.

- No se incorporaron nuevas funcionalidades durante la última etapa; el objetivo fue estabilizar y validar el estado alcanzado antes de pasar al cierre y documentación.

## 14. Alcance y complejidad

- Se decidió **no resolver mediante complejidad adicional las particularidades internas de los tests** cuando estas no representaban un problema real del funcionamiento de la aplicación.

- Se priorizó mantener el código comprensible para un proyecto educativo antes que optimizarlo para escenarios que actualmente no forman parte de su alcance.

- Se evitó incorporar funcionalidades futuras de manera anticipada.

- Las decisiones se tomaron considerando el estado real del proyecto y no necesidades hipotéticas.

- Se mantuvo una cantidad reducida de dependencias para facilitar la instalación, comprensión y mantenimiento.

- La integración backend se mantuvo mínima, utilizando únicamente la función necesaria para comunicarse con Gemini.

- Se evitó agregar configuraciones adicionales cuando podían resolverse mediante las herramientas ya utilizadas, como ocurrió con las rutas SPA en producción mediante las CDN Routing Rules de Vercel.

## 15. Principio general de las decisiones

Las decisiones del proyecto siguieron un criterio común:

> **Mantener la solución lo más sencilla posible, incorporando únicamente la complejidad necesaria para cumplir el objetivo del POC y poder probar, comprender y mantener el código con facilidad.**

A medida que el proyecto evolucionó, las decisiones iniciales fueron revisadas cuando el estado real de la aplicación lo requirió.

La integración con **Gemini**, el **deployment en Vercel**, la solución de las rutas SPA en producción, las mejoras visuales y la protección del contenido renderizado se incorporaron únicamente después de validar que aportaban valor al funcionamiento final del POC.

El resultado es una aplicación educativa con una arquitectura sencilla, navegación SPA, persistencia local, conversaciones independientes por personaje, pruebas automatizadas, integración con inteligencia artificial y deployment funcional en Vercel.

### Enlaces relacionados

- [README.md](README.md) — presentación, instalación, características y estado del proyecto.
- [Demo en Vercel](https://proyecto-m3-looney-ia-chat-ocned15iw-looney-ai-chat.vercel.app)
- [Repositorio en GitHub](https://github.com/mllopezc-cmd/Proyecto-M3_Looney_IA_chat)

[⬆️ Volver al inicio](#inicio)
