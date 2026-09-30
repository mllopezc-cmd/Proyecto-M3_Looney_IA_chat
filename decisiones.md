<a id="inicio"></a>

# Decisiones del proyecto — Looney AI Chat

## 1. Enfoque del proyecto

- Se decidió mantener **Looney AI Chat como una POC (Proof of Concept) independiente de desarrollo de software**, priorizando la comprensión del código, la separación de responsabilidades, la mantenibilidad y una evolución controlada de la solución.

- Aunque el proyecto se desarrolló inicialmente dentro de un contexto académico, su estructura se planteó como una **base tecnológica funcional susceptible de futuras iteraciones y una eventual evolución hacia un producto**.

- Se adoptó un desarrollo progresivo, siguiendo el flujo:

  **Desarrollo → Testing → Correcciones → Mejoras → Testing final → Revisión final → Documentación → Commit/Push**

- Las mejoras se incorporaron de forma incremental y fueron verificadas antes de continuar con la siguiente etapa.

- Se evitó agregar funcionalidades que no fueran necesarias para cumplir el alcance definido de la POC.

- Se priorizaron cambios pequeños y controlados para reducir el riesgo de introducir regresiones.

- Se decidió mantener una cantidad reducida de dependencias y evitar herramientas o abstracciones que no aportaran un beneficio claro al alcance actual.

- Se priorizó que cada mejora tuviera una justificación funcional, visual o de calidad del código antes de incorporarla.

---

## 2. Arquitectura y estructura

- Se decidió mantener una **arquitectura sencilla y proporcional al alcance de la POC**, evitando patrones, capas o abstracciones que no aportaran valor funcional o de mantenimiento.

- Se priorizó una estructura de archivos fácil de localizar, comprender y modificar.

- Se evitó crear archivos auxiliares o configuraciones adicionales cuando podían resolverse de manera simple dentro de la estructura existente.

- Se mantuvo una separación clara entre:
  - interfaz y navegación;
  - lógica del chat;
  - funciones utilitarias;
  - integración backend.

- El proyecto utiliza **ES Modules**, manteniendo `"type": "module"` en `package.json`, debido a que este sistema de módulos es compatible con la estructura actual.

- Se evitó incorporar dependencias adicionales únicamente para resolver problemas particulares que no aportaran valor funcional al alcance del proyecto.

- La integración con Gemini se implementó mediante `fetch`, sin incorporar un SDK adicional de Google.

- Se mantuvo una arquitectura basada en HTML, CSS y JavaScript, sin incorporar un framework frontend.

- La simplicidad arquitectónica se considera una decisión de diseño orientada a facilitar el mantenimiento y permitir futuras iteraciones sin introducir complejidad prematura.

---

## 3. Navegación y SPA

- Se decidió utilizar una navegación tipo **SPA**, sin incorporar un framework adicional.

- Para gestionar las rutas se utilizó la **History API**, permitiendo cambiar entre vistas sin recargar completamente la aplicación.

- Se mantuvieron las rutas principales:
  - `/home`
  - `/chat`
  - `/about`

- Se incorporó el parámetro de consulta `character` para identificar el personaje activo dentro de `/chat`.

- No se incorporó un sistema de routing externo porque la cantidad de vistas existentes no lo requiere.

- Se mantuvo una solución deliberadamente sencilla y proporcional al alcance actual del proyecto.

- Durante las mejoras de navegación se mantuvieron los controles de historial del navegador, permitiendo utilizar correctamente **Back** y **Forward**.

- Se centralizó la gestión de la navegación en el router existente para evitar lógica duplicada.

- Se mantuvo el comportamiento de la aplicación como SPA sin necesidad de introducir una dependencia específica para routing.

---

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

- Se mantuvieron imágenes locales específicas para cada personaje, evitando depender de recursos externos para la presentación principal.

---

## 5. Chat e historial

- Se decidió mantener un **historial independiente por personaje**, evitando mezclar las conversaciones.

- Se utilizó **`localStorage`** para conservar las conversaciones en el navegador.

- Se incorporó un **panel de conversaciones** para consultar y continuar historiales disponibles.

- La persistencia de conversaciones se mantiene en el frontend, sin incorporar una base de datos para almacenar los historiales.

- Se mantuvo la posibilidad de limpiar la conversación correspondiente al personaje seleccionado.

- Se verificó que las conversaciones permanecieran separadas al cambiar entre Bugs Bunny, Silvestre y Pato Lucas.

- También se verificó que el historial pudiera recuperarse después de navegar entre las diferentes vistas y después de recargar la aplicación.

- Se decidió mantener el historial asociado al identificador del personaje, evitando que una conversación afecte a otra.

- Se incorporó validación de los datos recuperados desde `localStorage`, evitando que JSON inválido o estructuras incorrectas rompan la aplicación.

- La vista de conversaciones diferencia entre:
  - **Iniciar conversación**, cuando no existe historial;
  - **Continuar conversación**, cuando existe una conversación previa.

- Cuando existe historial se muestra una vista previa de la última interacción disponible.

- Se decidió mantener el historial completo almacenado localmente aunque el contexto enviado al backend pueda ser limitado por las restricciones de la API. De esta manera, las restricciones de tamaño no provocan la pérdida del historial visible para el usuario.

---

## 6. Testing

- Se decidió utilizar **Vitest** como herramienta de pruebas del proyecto.

- No se instaló `jsdom`, ya que incorporar una nueva dependencia únicamente para proporcionar un entorno DOM completo no aportaba suficiente valor para el alcance actual.

- Se utilizaron mocks controlados para representar las partes del navegador necesarias durante las pruebas.

- Se priorizó que las pruebas verificaran la lógica relevante del proyecto sin adaptar excesivamente la aplicación al entorno de testing.

- Se probaron casos normales y situaciones anómalas relacionadas con:
  - rutas;
  - personajes;
  - mensajes;
  - almacenamiento local;
  - navegación;
  - respuestas de API;
  - estados de carga;
  - manejo de errores;
  - interacción entre las diferentes vistas.

- Se probaron casos relacionados con mensajes vacíos o compuestos únicamente por espacios.

- Se identificó y corrigió un problema en el estado de carga de `chat.js`: el estado `isLoading` se establecía antes de validar el contenido del mensaje, lo que podía dejar bloqueado el chat después de un envío vacío.

- La validación se ajustó para comprobar primero el contenido del mensaje y establecer el estado de carga únicamente cuando existe un mensaje válido.

- Se agregó una prueba de regresión para comprobar que después de un envío vacío se pudiera enviar correctamente un nuevo mensaje.

- Se incorporaron pruebas para comprobar que no fuera posible realizar nuevos envíos mientras una respuesta de la IA se encontraba en proceso.

- Se incorporaron pruebas para verificar que los controles de la interfaz se deshabilitaran durante el procesamiento y fueran restaurados al finalizar la operación.

- Se incorporaron pruebas para verificar el comportamiento ante diferentes tipos de error durante la comunicación con la API.

- Se incorporaron pruebas específicas para el endpoint backend mediante `tests/api.test.js`.

- Las pruebas del backend verifican:
  - método HTTP permitido;
  - personajes válidos;
  - estructura del historial;
  - remitentes válidos;
  - límite de caracteres por mensaje;
  - límite de cantidad de mensajes;
  - límite total de caracteres;
  - respuestas de error de Gemini;
  - respuestas exitosas simuladas.

- Durante las pruebas de API no se realizan solicitudes reales a Gemini. Las respuestas del servicio externo se simulan mediante mocks.

- La validación automática final alcanzó:

  ```text
  Test Files  3 passed (3)
  Tests       72 passed (72)
  ```

- El resultado final fue **72 pruebas aprobadas de 72**, sin pruebas fallidas ni errores no controlados.

- Los mensajes mostrados en `stderr` durante determinadas pruebas corresponden a escenarios de error simulados deliberadamente y registrados mediante `console.error`; no representan errores no controlados de Vitest.

- También se realizó una **validación manual en el navegador** para comprobar comportamientos visuales y de interacción que no resultaba necesario cubrir completamente mediante pruebas automatizadas.

---

## 7. Mejoras visuales y de interacción

- Se decidió mejorar la experiencia visual y de navegación sin aumentar innecesariamente la complejidad del proyecto.

- Se incorporó un encabezado general con el nombre **Looney AI Chat**.

- Se rediseñó la navegación principal mediante un **menú hamburguesa**, reduciendo el espacio ocupado por los enlaces y manteniendo una interfaz más limpia.

- Se decidió que el menú de navegación fuera seleccionable mediante el icono de tres líneas, sin mostrar permanentemente los textos de navegación en el encabezado.

- Se incorporaron dentro del menú las opciones principales:
  - Home;
  - Chat;
  - About;
  - modo claro/oscuro.

- Se incorporaron estados accesibles mediante atributos ARIA para representar la apertura y cierre del menú.

- Se decidió cerrar el menú después de seleccionar una opción de navegación.

- También se incorporó el cierre del menú cuando el usuario realiza una interacción fuera de este.

- Se mantuvo el foco visual mediante `:focus-visible` para conservar una navegación accesible mediante teclado.

- Las tarjetas de personajes del Home se hicieron **completamente clicables**, permitiendo seleccionar un personaje desde cualquier zona de la tarjeta en lugar de limitar la interacción a un enlace específico.

- Se mantuvo información adicional de cada personaje, incluyendo personalidad y saludo.

- Se incorporaron imágenes locales para la presentación visual de Bugs Bunny, Silvestre y Pato Lucas.

- Se incorporó un perfil visual del personaje dentro de la vista de chat.

- Se añadió una marca de agua visual del personaje dentro del área de conversación.

- Se incorporó un indicador de escritura mientras se espera la respuesta de la IA.

- El indicador utiliza el texto animado:

  `Escribiendo.` → `Escribiendo..` → `Escribiendo...`

- Se decidió que el indicador tuviera el comportamiento visual de una burbuja de mensaje y no ocupara innecesariamente todo el ancho disponible.

- Se incorporó un bloqueo temporal de nuevos envíos mientras se procesa una respuesta para evitar solicitudes duplicadas.

- También se deshabilitó temporalmente la acción de limpiar el historial durante el procesamiento de una respuesta.

- Al finalizar correctamente la respuesta, los controles se restauran y el campo de entrada vuelve a quedar disponible.

- En caso de error, los controles también se restauran y se muestra un mensaje controlado al usuario.

- Se incorporó un modo claro y oscuro con persistencia de la preferencia mediante `localStorage`.

- Se decidió colocar el control de tema dentro del menú hamburguesa para mantener el encabezado más limpio y concentrar las opciones de navegación en un único espacio.

- Se mejoró la vista **Mis conversaciones**, mostrando el personaje, su personalidad, la última interacción disponible y una acción para continuar o iniciar la conversación.

- Se adaptó la interfaz para dispositivos móviles, tablets y escritorio mediante estilos responsive.

- Se incorporaron mejoras tipográficas y visuales para diferenciar títulos, textos y elementos de interfaz, manteniendo las fuentes mediante Google Fonts.

- Se incorporaron elementos visuales temáticos para reducir la apariencia genérica de la interfaz sin convertir el proyecto en una implementación visual excesivamente compleja.

- Se eliminaron estilos CSS heredados que ya no correspondían con la estructura actual de la interfaz.

- Se mantuvo el criterio de realizar cambios visuales controlados sin incorporar frameworks o dependencias adicionales.

---

## 8. Protección del contenido renderizado

- Durante la revisión del código se identificó que los mensajes de usuario y las respuestas de la API podían terminar renderizándose mediante `innerHTML`.

- Se decidió incorporar una función `escapeHTML()` en `src/utils.js` para escapar caracteres HTML antes de insertar contenido dinámico en la interfaz.

- Esta protección se aplicó tanto a los mensajes del chat como a la vista previa de conversaciones mostrada en la interfaz.

- La solución se mantuvo deliberadamente sencilla y no requirió incorporar nuevas dependencias.

- Se agregaron pruebas automatizadas para verificar el escape de contenido HTML.

- La decisión permitió mantener el uso existente de `innerHTML` sin tener que modificar innecesariamente toda la estrategia de renderizado del proyecto.

---

## 9. Integración con Gemini

- Inicialmente se decidió mantener Gemini para una etapa posterior, mientras se completaban y validaban las funcionalidades frontend.

- Una vez estabilizadas la navegación, el chat, la persistencia y las pruebas, se decidió incorporar la integración con Gemini como parte de la versión funcional de la POC.

- La integración se implementó mediante la función backend ubicada en `api/functions.js`.

- Se optó por utilizar `fetch` directamente en lugar de incorporar un SDK adicional, manteniendo la arquitectura sencilla y reduciendo dependencias.

- La función backend se encarga de:
  - validar el método HTTP;
  - validar el personaje solicitado;
  - validar el contenido de la conversación;
  - validar la estructura de los mensajes;
  - validar los límites de las solicitudes;
  - obtener `GEMINI_API_KEY` desde las variables de entorno;
  - construir las instrucciones correspondientes al personaje;
  - transformar el historial al formato esperado por Gemini;
  - enviar la conversación a Gemini;
  - procesar la respuesta;
  - devolver la respuesta generada al frontend;
  - manejar errores del servicio.

- Se decidió mantener la clave de API fuera del frontend y del repositorio mediante variables de entorno.

- Se mantuvo `.env.example` como referencia para indicar la variable requerida sin exponer la clave real.

- La integración utiliza el modelo configurado en `api/functions.js`, manteniendo la configuración centralizada en el backend.

- La integración con Gemini fue validada durante las pruebas funcionales realizadas sobre el deployment de Vercel.

- La arquitectura mantiene la integración con el proveedor desacoplada del frontend, permitiendo modificar posteriormente la estrategia de integración sin alterar la estructura principal de la interfaz.

---

## 10. Límites y validaciones de las solicitudes

- Se decidió establecer límites explícitos para controlar el tamaño de las solicitudes enviadas a Gemini.

- Los límites actuales son:

  ```text
  Máximo por mensaje:       2000 caracteres
  Máximo de mensajes:       20
  Máximo de caracteres:     12000
  ```

- Estos límites se aplican tanto en el frontend como en el backend.

- El frontend evita enviar un mensaje que supere los 2000 caracteres.

- El frontend limita el historial que se envía al backend a un máximo de 20 mensajes y 12000 caracteres.

- Esta limitación del contexto enviado a la API no elimina ni modifica el historial completo almacenado localmente.

- El backend vuelve a validar los mismos límites antes de realizar la solicitud a Gemini.

- Se decidió realizar la validación también en backend para no depender exclusivamente de las restricciones del cliente.

- Las solicitudes que incumplen los límites se rechazan antes de realizar una petición al servicio externo.

- Se incorporaron pruebas para los valores límite exactos y para los valores que exceden cada restricción.

- Los valores exactos permitidos se verifican mediante pruebas automatizadas:
  - 2000 caracteres por mensaje;
  - 20 mensajes;
  - 12000 caracteres acumulados.

---

## 11. Manejo de errores

- Se decidió evitar mostrar directamente al usuario detalles técnicos innecesarios provenientes de la API.

- El backend conserva respuestas HTTP diferenciadas para representar distintos tipos de fallo.

- El frontend transforma estos estados en mensajes comprensibles para el usuario.

- Para un error **429**, se informa que el servicio de IA alcanzó temporalmente su límite de uso.

- Para errores **500/502**, se informa que el servicio de IA no está disponible en ese momento.

- Para errores de conexión, se informa que no fue posible conectar con el servicio.

- Para otros errores, se muestra un mensaje general solicitando volver a intentar la operación.

- Los detalles técnicos se mantienen disponibles mediante `console.error` para facilitar la depuración sin exponer información innecesaria en la interfaz.

- Se decidió mantener la interfaz disponible después de cualquier error mediante la restauración de los controles en el bloque `finally`.

- Se incorporaron pruebas automatizadas para verificar que los errores no dejen bloqueado el formulario de chat.

---

## 12. Revisión y corrección del código

- Después de completar las funcionalidades principales se realizó una revisión general de los archivos de aplicación, estilos, utilidades y pruebas.

- Se buscó corregir problemas reales sin convertir la revisión en una reestructuración innecesaria del proyecto.

- Se identificó el problema relacionado con el estado de carga después de un envío vacío y se corrigió manteniendo la arquitectura existente.

- Se identificó el riesgo de insertar directamente contenido dinámico mediante `innerHTML` y se incorporó `escapeHTML()` como solución controlada.

- Se revisaron estilos CSS heredados que ya no correspondían a la estructura actual y fueron eliminados.

- Se verificó que `fetchData()` debía mantenerse en `src/utils.js`, debido a que forma parte de las utilidades y pruebas existentes, aunque la lógica actual del chat no dependa directamente de ella para realizar la petición a Gemini.

- Se actualizó la información tecnológica mostrada en la vista About para que correspondiera con las herramientas realmente utilizadas en el proyecto.

- Se revisó la estructura final del proyecto para mantener únicamente los archivos necesarios para el alcance definido.

- Se revisó la lógica de navegación para evitar listeners duplicados y mantener un único flujo de interacción para el menú y las rutas.

- Se incorporaron pruebas específicas del backend sin modificar innecesariamente `api/functions.js` únicamente para facilitar su testing.

- Después de estas modificaciones se ejecutaron nuevamente las pruebas automatizadas y se obtuvo el resultado final de **72 pruebas aprobadas de 72**.

---

## 13. Producción y deployment

- Se decidió utilizar **Vercel** como plataforma de deployment del proyecto.

- El deployment se realizó después de completar y validar las funcionalidades principales.

- La aplicación cuenta con un deployment en Vercel utilizado para la validación de los principales flujos en producción.

- La validación del deployment comprobó:
  - navegación entre Home, Chat y About;
  - selección de personajes;
  - conversaciones independientes;
  - integración con Gemini;
  - persistencia del historial;
  - navegación Back/Forward;
  - rutas con `character` mediante query string;
  - funcionamiento de las rutas internas durante la navegación y recarga.

- Se decidió mantener la configuración de deployment sencilla y evitar archivos de configuración adicionales cuando no fueran necesarios.

---

## 14. Manejo de rutas SPA en producción

- Durante la validación local con `npx vercel dev` se observó que una recarga directa mediante `F5` sobre rutas como `/chat` o `/chat?character=...` podía devolver `404`.

- Inicialmente se decidió no incorporar un `vercel.json` únicamente para resolver este comportamiento local, ya que la navegación interna de la SPA funcionaba correctamente.

- Se realizó posteriormente la comprobación directamente sobre el deployment real en Vercel.

- La validación de producción confirmó el funcionamiento de:

  ```text
  /home
  /chat
  /chat?character=bugs
  /about
  ```

  mediante la navegación de la aplicación y las rutas utilizadas por el proyecto.

- Las rutas que utilizan el parámetro `character` también se mantienen funcionales en el deployment.

- Debido a que el deployment de Vercel resuelve correctamente el enrutamiento utilizado por la aplicación, **no fue necesario incorporar `vercel.json`**.

- Se decidió mantener el proyecto sin reglas de rewrite adicionales.

- La diferencia observada inicialmente entre el entorno local y el deployment de producción queda documentada como una particularidad del entorno local de desarrollo de Vercel.

- La configuración actual de Vercel se considera suficiente para el funcionamiento del enrutamiento SPA utilizado por el proyecto.

---

## 15. Validación final

- Se decidió realizar una revisión final después de completar las mejoras, las validaciones backend y la integración con Gemini.

- Se verificaron nuevamente las pruebas automatizadas y el funcionamiento manual de la aplicación.

- La validación automática final alcanzó:

  ```text
  Test Files  3 passed (3)
  Tests       72 passed (72)
  ```

- El resultado final fue **72/72 pruebas aprobadas**, sin pruebas fallidas ni errores no controlados.

- La validación manual confirmó el funcionamiento de:
  - navegación SPA;
  - selección de personajes;
  - tarjetas de personajes completamente clicables;
  - conversaciones independientes;
  - persistencia mediante `localStorage`;
  - limpieza del historial;
  - panel de conversaciones;
  - estados de carga;
  - bloqueo de nuevos envíos durante el procesamiento;
  - restauración de controles después de la respuesta;
  - manejo diferenciado de errores;
  - diseño responsive;
  - menú hamburguesa;
  - cierre del menú después de navegar;
  - cierre del menú al hacer clic fuera;
  - estados ARIA del menú;
  - modo claro y oscuro;
  - persistencia del tema;
  - navegación hacia atrás y adelante;
  - vista de conversaciones;
  - presentación visual de los personajes;
  - página About;
  - rutas con `character`;
  - integración con Gemini durante la etapa de validación.

- Se comprobó la persistencia del historial después de la navegación y de la recarga de la aplicación.

- Se verificó que las rutas con query string para seleccionar personajes continúan funcionando correctamente.

- Se realizó además una revisión final del código para identificar errores, código heredado y posibles mejoras sin aumentar innecesariamente la complejidad.

- Después de la revisión se confirmó que no era necesario incorporar nuevas dependencias ni nuevos archivos para completar el alcance definido.

- No se incorporaron nuevas funcionalidades durante la última etapa de testing; el objetivo fue estabilizar y validar el estado alcanzado antes del cierre y la documentación.

- La documentación final fue sincronizada con el estado validado del código y del deployment.

- El código, las pruebas, la documentación y el deployment quedaron alineados con el alcance final definido para la POC.

---

## 16. Alcance y complejidad

- Se decidió **no resolver mediante complejidad adicional las particularidades internas de los tests** cuando estas no representaban un problema real del funcionamiento de la aplicación.

- Se priorizó mantener el código comprensible y mantenible antes que optimizarlo para escenarios que actualmente no forman parte de su alcance.

- Se evitó incorporar funcionalidades futuras de manera anticipada.

- Las decisiones se tomaron considerando el estado real del proyecto y no necesidades hipotéticas.

- Se mantuvo una cantidad reducida de dependencias para facilitar la instalación, comprensión y mantenimiento.

- La integración backend se mantuvo mínima, utilizando únicamente la función necesaria para comunicarse con Gemini.

- Se evitó agregar configuraciones adicionales mientras no fueran necesarias para resolver un problema comprobado en el deployment.

- La validación de producción confirmó que no era necesario incorporar `vercel.json`.

- Se mantuvo la configuración proporcionada por Vercel para resolver el enrutamiento de la aplicación.

- Las mejoras visuales se implementaron mediante CSS y JavaScript existentes, evitando incorporar librerías de componentes, frameworks CSS o soluciones externas.

- Se mantuvo un nivel de complejidad coherente con el alcance de una POC, dejando al mismo tiempo una base organizada para futuras iteraciones.

- Se priorizó que la solución pudiera evolucionar sin introducir prematuramente una arquitectura más compleja de la que requieren sus funcionalidades actuales.

---

## 17. Principio general de las decisiones

Las decisiones del proyecto siguieron un criterio común:

> **Mantener la solución lo más sencilla posible, incorporando únicamente la complejidad necesaria para cumplir el objetivo de la POC y poder probar, comprender, mantener y evolucionar el código con facilidad.**

A medida que el proyecto evolucionó, las decisiones iniciales fueron revisadas cuando el estado real de la aplicación lo requirió.

La integración con **Gemini**, las mejoras visuales, la protección del contenido renderizado, las validaciones frontend/backend, la navegación SPA, el menú hamburguesa, el modo claro/oscuro y el deployment en **Vercel** se incorporaron únicamente después de validar que aportaban valor al funcionamiento final de la solución.

Las mejoras de UX/UI se realizaron sin modificar innecesariamente la arquitectura general. Se priorizó que las nuevas interacciones, como el menú, las tarjetas clicables, el indicador de escritura y el bloqueo temporal del formulario, se integraran sobre la estructura existente.

La estrategia de routing de producción también fue validada directamente en Vercel. Debido a que las rutas utilizadas por la SPA funcionan correctamente en producción, no fue necesario incorporar configuración adicional mediante `vercel.json`.

El resultado final es una **POC independiente de desarrollo de software**, con navegación SPA, persistencia local, conversaciones independientes por personaje, pruebas automatizadas, protección del contenido renderizado, manejo de estados y errores, validaciones frontend/backend, integración con inteligencia artificial y deployment en Vercel.

Su estructura permite utilizarla como **base tecnológica para futuras iteraciones y una eventual evolución hacia un producto**, manteniendo una arquitectura proporcional al alcance actual y evitando complejidad prematura.

---

## Estado final de las decisiones

Las decisiones técnicas y de alcance documentadas en este archivo corresponden al **estado final validado del proyecto**.

El proyecto se considera cerrado en términos de:

- desarrollo;
- funcionalidades;
- UX/UI;
- validaciones;
- testing;
- revisión de código;
- integración con Gemini;
- deployment;
- documentación;
- evidencia audiovisual de la interacción con IA.

La documentación final incluye un GIF de demostración de la interacción con Bugs Bunny, donde se evidencia el envío de un mensaje, el estado de carga y la respuesta generada por la IA. El archivo se encuentra en `docs/screenshots/chat-bugs-bunny.gif` y está referenciado desde el `README.md`.

No quedan decisiones técnicas pendientes para completar el alcance actual de la POC.

Cualquier funcionalidad, cambio arquitectónico o evolución futura deberá considerarse una nueva iteración del proyecto y evaluarse según su necesidad y aporte funcional.

---

## Enlaces relacionados

- [`README.md`](README.md) — presentación, instalación, características y estado final del proyecto.
- Demo en Vercel: https://proyecto-m3-looney-ia-chat.vercel.app/
- Repositorio en GitHub: https://github.com/mllopezc-cmd/Proyecto-M3_Looney_IA_chat

[⬆️ Volver al inicio](#inicio)
