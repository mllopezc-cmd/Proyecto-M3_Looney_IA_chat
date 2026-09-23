# Looney AI Chat

Aplicación web educativa que presenta una experiencia de chat con personajes de **Looney Tunes**.

El proyecto fue desarrollado como una **POC (Proof of Concept) educativa**, con una arquitectura sencilla y enfocada en practicar conceptos de desarrollo web, navegación SPA, manejo de estado en el navegador, pruebas automatizadas y organización básica de una aplicación frontend.

## Presentación

**Looney AI Chat** permite seleccionar un personaje y acceder a una conversación independiente mediante una interfaz de chat.

Actualmente se encuentran disponibles:

- Bugs Bunny
- Silvestre
- Pato Lucas

Cada personaje cuenta con información propia, como descripción, personalidad y saludo inicial.

Las conversaciones se almacenan en `localStorage`, permitiendo conservar el historial de cada personaje dentro del navegador.

> **Nota:** La integración con Gemini/API queda preparada para una etapa posterior y no forma parte del estado actual del proyecto.

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
- Diseño responsive para dispositivos móviles, tablets y escritorio.
- Pruebas automatizadas con Vitest.

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
- limpiar la conversación del personaje seleccionado.

## Testing

El proyecto utiliza **Vitest** para las pruebas automatizadas.

Estado actual:

- **2 archivos de pruebas**
- **39 pruebas**
- **39 pruebas aprobadas**

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
- manejo de respuestas de API.

## Tecnologías

- HTML
- CSS
- JavaScript
- Vitest
- Vercel
- `localStorage`

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

El archivo `api/functions.js` se mantiene actualmente vacío y queda reservado para una futura etapa de integración con servicios externos.

## Instalación

Clonar el repositorio y acceder al directorio del proyecto:

```bash
git clone <URL_DEL_REPOSITORIO>
cd Proyecto-M3_Looney_IA_chat
```

Instalar las dependencias:

```bash
npm install
```

## Ejecución

Para ejecutar las pruebas:

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

La variable queda preparada para una futura integración con Gemini. La clave real no debe incluirse en el repositorio.

## Demo

La publicación final en Vercel se incorporará posteriormente.

**Vercel:** `Pendiente de publicación`

## Documentación

La documentación del proyecto se concentra en los siguientes archivos:

- [`README.md`](README.md) — presentación general, características y forma de ejecución.
- [`decisiones.md`](decisiones.md) — principales decisiones tomadas durante el desarrollo.

## Estado del proyecto

- [x] Desarrollo de la estructura inicial
- [x] Implementación de la navegación SPA
- [x] Implementación del chat
- [x] Persistencia de conversaciones
- [x] Separación de historiales por personaje
- [x] Mejoras visuales y responsive
- [x] Implementación de pruebas automatizadas
- [x] Validación automática
- [x] Validación manual
- [x] Revisión final del código
- [x] Preparación de documentación
- [ ] Publicación final en Vercel
- [ ] Integración futura con Gemini

## Consideraciones de la validación local

Durante la validación con `npx vercel dev`, la navegación interna de la SPA funciona correctamente.

Sin embargo, al realizar una recarga directa mediante `F5` sobre rutas como `/chat` o `/chat?character=...`, el entorno local puede responder con `404`.

Esta situación queda registrada como una limitación de la validación local. No se incorpora una configuración adicional únicamente para resolver este comportamiento, ya que no forma parte del alcance actual de la POC.

## Enfoque del proyecto

El objetivo del proyecto no es construir una arquitectura compleja, sino desarrollar una aplicación funcional, comprensible y fácil de presentar.

Por esta razón se priorizaron:

- código sencillo;
- separación clara de responsabilidades;
- pocas dependencias;
- pruebas automatizadas;
- persistencia local;
- cambios controlados;
- facilidad de mantenimiento y explicación.

La integración con servicios de inteligencia artificial y la publicación definitiva en Vercel quedan como etapas posteriores.
