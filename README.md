# Looney AI Chat

Aplicación web educativa que presenta una experiencia de chat con personajes de **Looney Tunes** mediante una integración con inteligencia artificial.

## 🔗 Enlaces del proyecto

- **Demo en Vercel:** [Looney AI Chat](https://proyecto-m3-looney-ia-chat-ocned15iw-looney-ai-chat.vercel.app?utm_source=chatgpt.com)
- **Repositorio en GitHub:** [Proyecto-M3_Looney_IA_chat](https://github.com/mllopezc-cmd/Proyecto-M3_Looney_IA_chat?utm_source=chatgpt.com)

---

El proyecto fue desarrollado como una **POC (Proof of Concept) educativa**, con una arquitectura sencilla y enfocada en practicar conceptos de desarrollo web, navegación SPA, manejo de estado en el navegador, persistencia local, integración con una API externa, pruebas automatizadas y despliegue en Vercel.

## Presentación

**Looney AI Chat** permite seleccionar un personaje y acceder a una conversación independiente mediante una interfaz de chat.

Actualmente se encuentran disponibles:

- Bugs Bunny
- Silvestre
- Pato Lucas

Cada personaje cuenta con información propia, como descripción, personalidad y saludo inicial.

Las conversaciones se almacenan en `localStorage`, permitiendo conservar el historial independiente de cada personaje dentro del navegador.

La aplicación también integra **Gemini** mediante una función backend ubicada en `api/functions.js`. La clave de API se mantiene como variable de entorno y no se expone directamente en el frontend.

> **Nota:** El proyecto es una POC educativa y no pretende reproducir oficialmente a los personajes ni construir una arquitectura de producción compleja.

## Características actuales

- Navegación entre las secciones **Home**, **Chat** y **About**.
- Navegación SPA mediante History API.
- Selección de personajes desde Home.
- URLs independientes para cada conversación.
- Historial independiente para cada personaje.
- Persistencia de conversaciones mediante `localStorage`.
- Recuperación de conversaciones existentes.
- Panel de **Mis conversaciones**.
- Visualización del último mensaje de cada conversación.
- Continuación de conversaciones existentes.
- Eliminación de la conversación del personaje seleccionado.
- Restauración del saludo inicial después de limpiar una conversación.
- Manejo de personajes no encontrados.
- Validación de mensajes vacíos o con espacios.
- Indicador visual de escritura durante la generación de respuestas.
- Watermark visual asociado al personaje seleccionado.
- Manejo de errores de la API.
- Integración con Gemini mediante `fetch`.
- Modo claro y modo oscuro con persistencia de la preferencia.
- Diseño responsive para dispositivos móviles, tablets y escritorio.
- Protección del contenido renderizado mediante escape de HTML.
- Pruebas automatizadas con Vitest.
- Despliegue mediante Vercel.
- Validación del funcionamiento de las rutas SPA en producción.
- Recarga mediante `F5` de las rutas internas en producción.

## Rutas principales

| Ruta                        | Descripción                 |
| --------------------------- | --------------------------- |
| `/`                         | Página principal            |
| `/home`                     | Página principal            |
| `/chat`                     | Panel de conversaciones     |
| `/chat?character=bugs`      | Conversación con Bugs Bunny |
| `/chat?character=silvestre` | Conversación con Silvestre  |
| `/chat?character=lucas`     | Conversación con Pato Lucas |
| `/about`                    | Información del proyecto    |

## Persistencia de conversaciones

Las conversaciones se almacenan localmente mediante `localStorage`.

Cada personaje mantiene su propio historial, por lo que las conversaciones de Bugs Bunny, Silvestre y Pato Lucas no se mezclan.

También es posible:

- recuperar una conversación existente;
- continuar una conversación desde el panel de Chat;
- visualizar el último mensaje registrado;
- limpiar la conversación del personaje seleccionado;
- conservar el historial al navegar entre las diferentes secciones;
- restaurar correctamente el historial asociado al personaje seleccionado;
- conservar el historial después de recargar la aplicación en producción.

La persistencia y recuperación de las conversaciones fueron validadas tanto durante las pruebas locales como en el deployment de Vercel.

## Integración con Gemini

La aplicación utiliza Gemini para generar las respuestas de los personajes.

La integración se encuentra en:

```text
api/functions.js
```

El frontend envía el historial de la conversación y el identificador del personaje a la función backend.

La función:

- valida el método HTTP;
- valida el personaje solicitado;
- valida que exista contenido en la conversación;
- obtiene `GEMINI_API_KEY` desde las variables de entorno;
- construye las instrucciones del personaje;
- envía la conversación a Gemini;
- procesa la respuesta;
- devuelve únicamente la respuesta generada al frontend;
- maneja errores de la API.

La clave de API no se almacena en el código frontend ni se incluye directamente en el repositorio.

No se utiliza un SDK adicional de Google para la integración; se realiza mediante `fetch`, manteniendo la arquitectura sencilla de la POC.

La integración con Gemini fue validada correctamente en el entorno de producción de Vercel.

## Testing

El proyecto utiliza **Vitest** para las pruebas automatizadas.

Estado final:

- **2 archivos de pruebas**
- **42 pruebas**
- **42 pruebas aprobadas**

Las pruebas cubren principalmente:

- datos de personajes;
- rutas y navegación;
- renderizado del chat;
- saludos iniciales;
- envío de mensajes;
- validación de mensajes vacíos;
- persistencia en `localStorage`;
- independencia entre conversaciones;
- recuperación de conversaciones;
- limpieza del historial;
- navegación SPA;
- funciones utilitarias;
- escape de contenido HTML;
- manejo de respuestas de API;
- comportamiento después de un envío vacío.

Además de las pruebas automatizadas, se realizó una validación manual de:

- navegación entre las rutas;
- selección de personajes;
- conversaciones independientes;
- recuperación del historial;
- limpieza de conversaciones;
- diseño responsive;
- modo claro y oscuro;
- menú de navegación;
- perfil de los personajes;
- watermark;
- indicador de escritura;
- página About;
- casos límite principales;
- navegación Back/Forward;
- recarga mediante `F5`;
- funcionamiento de las rutas en producción;
- integración con Gemini en Vercel.

## Tecnologías

- HTML
- CSS
- JavaScript
- Vitest
- Vercel
- `localStorage`
- Gemini API mediante `fetch`

El proyecto mantiene una arquitectura deliberadamente sencilla para facilitar su comprensión y presentación como POC educativa.

## Estructura principal

```text
Looney AI Chat/
├── api/
│   └── functions.js
├── src/
│   ├── app.js
│   ├── assets/
│   │   └── characters/
│   │       ├── bugs-bunny.webp
│   │       ├── silvestre.webp
│   │       └── pato-lucas.webp
│   ├── chat.js
│   ├── index.html
│   ├── styles.css
│   └── utils.js
├── tests/
│   ├── app.test.js
│   └── utils.test.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── decisiones.md
```

### Responsabilidad de los principales archivos

- `src/app.js`: navegación SPA, renderizado de Home, About, panel de conversaciones y elementos generales de la aplicación.
- `src/chat.js`: lógica de personajes, conversaciones, persistencia y comunicación con la API.
- `src/utils.js`: funciones utilitarias y escape de contenido HTML.
- `src/styles.css`: estilos, modo claro/oscuro y diseño responsive.
- `src/index.html`: estructura HTML inicial de la aplicación.
- `api/functions.js`: integración backend con Gemini.
- `tests/app.test.js`: pruebas de aplicación, navegación y chat.
- `tests/utils.test.js`: pruebas de funciones utilitarias.
- `src/assets/characters/`: imágenes locales utilizadas para representar a los personajes.

## Instalación

Clonar el repositorio y acceder al directorio del proyecto:

```bash
git clone <repositorio-de-GitHub>
cd Proyecto-M3_Looney_IA_chat
```

Instalar las dependencias:

```bash
npm install
```

## Ejecución y testing

Para ejecutar las pruebas automatizadas:

```bash
npm test
```

Para realizar la validación mediante el entorno local de Vercel:

```bash
npx vercel dev
```

## Variables de entorno

El proyecto incluye un archivo `.env.example` como referencia:

```env
GEMINI_API_KEY=
```

Para ejecutar la integración con Gemini se debe configurar la variable `GEMINI_API_KEY` en el entorno correspondiente.

La clave real **no debe incluirse en el repositorio**.

## Despliegue

El proyecto se encuentra desplegado y validado en **Vercel**.

Durante la validación final en producción se comprobaron:

- navegación entre Home, Chat y About;
- conversaciones independientes por personaje;
- generación de respuestas mediante Gemini;
- persistencia del historial;
- recuperación de conversaciones;
- recarga directa de las rutas;
- recarga mediante `F5`;
- rutas con `character` mediante query string;
- navegación mediante Back/Forward.

La aplicación funciona correctamente en producción.

Durante la validación local con `npx vercel dev` se había observado que una recarga directa de determinadas rutas internas podía devolver `404`. Sin embargo, esta situación no se reproduce en el deployment final de Vercel.

Por lo tanto, **no fue necesario incorporar un archivo `vercel.json` ni reglas de rewrite adicionales**. La configuración actual de Vercel es suficiente para el funcionamiento del enrutamiento SPA.

**Vercel:** [Looney AI Chat](https://proyecto-m3-looney-ia-chat-ocned15iw-looney-ai-chat.vercel.app?utm_source=chatgpt.com)

## Documentación

La documentación principal del proyecto se concentra en los siguientes archivos:

- [`README.md`](README.md) — presentación general, características, arquitectura y forma de ejecución.
- [`decisiones.md`](decisiones.md) — principales decisiones tomadas durante el desarrollo y los criterios utilizados para mantener una arquitectura sencilla.

## Estado del proyecto

- [x] Desarrollo de la estructura inicial
- [x] Implementación de la navegación SPA
- [x] Implementación del chat
- [x] Persistencia de conversaciones
- [x] Separación de historiales por personaje
- [x] Mejoras visuales y responsive
- [x] Implementación de pruebas automatizadas
- [x] Integración con Gemini
- [x] Validación automática
- [x] Validación manual
- [x] Revisión final del código
- [x] Revisión de documentación
- [x] Preparación para despliegue en Vercel
- [x] Validación de Gemini en producción
- [x] Validación de rutas SPA en producción
- [x] Validación de recarga mediante `F5`
- [x] Validación de persistencia en producción
- [x] Commit final
- [x] Push final
- [x] Deployment final en Vercel

## Consideraciones de la validación local

Durante la validación con `npx vercel dev`, la navegación interna de la SPA funcionó correctamente.

Inicialmente se observó que una recarga directa mediante `F5` sobre rutas como `/chat` o `/chat?character=...` podía responder con `404` en el entorno local.

Este comportamiento fue posteriormente contrastado con el deployment real en Vercel.

La validación en producción confirmó que:

- las rutas internas cargan correctamente;
- las rutas con `character` funcionan correctamente;
- la recarga mediante `F5` funciona correctamente;
- la navegación SPA continúa funcionando;
- la persistencia de las conversaciones se mantiene correctamente.

Por este motivo, no fue necesario agregar `vercel.json` ni otra configuración adicional para solucionar el comportamiento observado exclusivamente en el entorno local.

## Enfoque del proyecto

El objetivo del proyecto no es construir una arquitectura compleja, sino desarrollar una aplicación funcional, comprensible y fácil de presentar.

Por esta razón se priorizaron:

- código sencillo;
- separación clara de responsabilidades;
- pocas dependencias;
- pruebas automatizadas;
- persistencia local;
- integración backend mínima;
- protección básica del contenido renderizado;
- cambios controlados;
- facilidad de mantenimiento y explicación.

La integración con Gemini se implementó mediante una función backend sencilla y `fetch`, evitando agregar dependencias innecesarias.

Las imágenes de los personajes se mantienen como recursos locales dentro de `src/assets/characters/`, evitando dependencias externas para su presentación visual.

El proyecto queda finalizado y preparado para su presentación como una **POC educativa**, con frontend, persistencia local, pruebas automatizadas, integración con inteligencia artificial y deployment validado en Vercel.
