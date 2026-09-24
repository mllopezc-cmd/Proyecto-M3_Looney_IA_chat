# Looney AI Chat

Aplicación web educativa que presenta una experiencia de chat con personajes de **Looney Tunes** mediante una integración con inteligencia artificial.

### 🔗 Enlaces del proyecto

- **Demo en Vercel:** [Looney AI Chat](https://proyecto-m3-looney-ia-chat-ocned15iw-looney-ai-chat.vercel.app)
- **Repositorio en GitHub:** [Proyecto-M3_Looney_IA_chat](https://github.com/mllopezc-cmd/Proyecto-M3_Looney_IA_chat)

---

El proyecto fue desarrollado como una **POC (Proof of Concept) educativa**, con una arquitectura sencilla y enfocada en practicar conceptos de desarrollo web, navegación SPA, manejo de estado en el navegador, persistencia local, integración con una API externa, pruebas automatizadas y despliegue en Vercel.

## Presentación

**Looney AI Chat** permite seleccionar un personaje y acceder a una conversación independiente mediante una interfaz de chat.

Actualmente se encuentran disponibles:

- Bugs Bunny
- Silvestre
- Pato Lucas

Cada personaje cuenta con información propia, como descripción, personalidad y saludo inicial.

Las conversaciones se almacenan en `localStorage`, permitiendo conservar el historial de cada personaje dentro del navegador.

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
- Eliminación de la conversación del personaje seleccionado.
- Manejo de personajes no encontrados.
- Validación de mensajes vacíos o con espacios.
- Estados de carga durante la generación de respuestas.
- Manejo de errores de la API.
- Integración con Gemini mediante `fetch`.
- Diseño responsive para dispositivos móviles, tablets y escritorio.
- Protección del contenido renderizado mediante escape de HTML.
- Pruebas automatizadas con Vitest.
- Despliegue mediante Vercel.

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
- limpiar la conversación del personaje seleccionado;
- conservar el historial al navegar entre las diferentes secciones;
- conservar el historial después de recargar una ruta en producción.

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

La clave de API no se almacena en el código frontend ni debe incluirse directamente en el repositorio.

No se utiliza un SDK adicional de Google para la integración; se realiza mediante `fetch`, manteniendo la arquitectura sencilla de la POC.

## Testing

El proyecto utiliza **Vitest** para las pruebas automatizadas.

Estado actual:

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

- `src/app.js`: navegación SPA, renderizado de Home, About y elementos generales de la aplicación.
- `src/chat.js`: lógica de personajes, conversaciones, persistencia y comunicación con la API.
- `src/utils.js`: funciones utilitarias y escape de contenido HTML.
- `src/styles.css`: estilos y diseño responsive.
- `src/index.html`: estructura HTML inicial de la aplicación.
- `api/functions.js`: integración backend con Gemini.
- `tests/app.test.js`: pruebas de aplicación, navegación y chat.
- `tests/utils.test.js`: pruebas de funciones utilitarias.

## Instalación

Clonar el repositorio y acceder al directorio del proyecto:

```bash
git clone https://github.com/mllopezc-cmd/Proyecto-M3_Looney_IA_chat.git

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

El proyecto se encuentra desplegado en **Vercel**.

La aplicación fue validada en producción incluyendo:

- navegación entre Home, Chat y About;
- conversaciones independientes por personaje;
- generación de respuestas mediante Gemini;
- persistencia del historial;
- recarga directa de las rutas;
- recarga mediante `F5`;
- rutas con `character` mediante query string.

Para permitir la recarga directa de las rutas SPA en producción se utilizaron **CDN Routing Rules de Vercel**, realizando rewrites hacia la aplicación principal.

Las reglas utilizadas son:

```text
/chat  → /
/about → /
/home  → /
```

No fue necesario incorporar un archivo `vercel.json` para esta solución.

**Vercel:** [Looney AI Chat](https://proyecto-m3-looney-ia-chat-ocned15iw-looney-ai-chat.vercel.app)

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
- [x] Despliegue en Vercel
- [x] Validación de rutas en producción
- [x] Validación de recarga mediante `F5` en producción
- [x] Preparación de documentación
- [ ] Commit final
- [ ] Push final

## Consideraciones de la validación local

Durante la validación con `npx vercel dev`, la navegación interna de la SPA funciona correctamente.

Sin embargo, al realizar una recarga directa mediante `F5` sobre rutas como `/chat` o `/chat?character=...`, el entorno local puede responder con `404`.

Esta situación corresponde al comportamiento observado en el entorno local de desarrollo de Vercel.

En producción, este comportamiento fue resuelto mediante las **CDN Routing Rules de Vercel**, permitiendo que las rutas SPA puedan recargarse directamente sin devolver `404`.

No se incorpora un `vercel.json` únicamente para resolver la diferencia del entorno local.

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

El proyecto queda preparado para su presentación como una POC educativa, con frontend, persistencia local, pruebas automatizadas, integración con inteligencia artificial y despliegue funcional en Vercel.
