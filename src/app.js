import { getCharacter, getConversationPreview, renderChat } from "./chat.js";
import { escapeHTML } from "./utils.js";

const app = document.querySelector("#app");

const characterImages = {
  bugs: "./assets/characters/bugs-bunny.webp",
  silvestre: "./assets/characters/silvestre.webp",
  lucas: "./assets/characters/pato-lucas.webp",
};

function renderHome() {
  const characters = ["bugs", "silvestre", "lucas"];

  app.innerHTML = `
    <main class="home">
      <header class="home-header">
        <p>
          Conversa con tus personajes favoritos de Looney Tunes
          mediante inteligencia artificial.
        </p>
      </header>

      <section class="characters" aria-labelledby="characters-title">
        <h2 id="characters-title">Elige tu personaje</h2>

        <div class="character-list">
          ${characters
            .map((characterId) => {
              const character = getCharacter(characterId);
              const characterImage = characterImages[characterId];

              return `
                <a
                  class="character-card"
                  href="/chat?character=${characterId}"
                  data-character="${characterId}"
                  aria-label="Chatear con ${character.name}"
                >
                  <div class="character-image-wrapper">
                    <img
                      class="character-image"
                      src="${characterImage}"
                      alt="${character.name}"
                    />
                  </div>

                  <div class="character-content">
                    <h3>${character.name}</h3>

                    <p class="character-personality">
                      ${character.personality}
                    </p>

                    <p class="character-description">
                      ${character.description}
                    </p>

                    <span class="character-link">
                      Chatear con ${character.name}
                    </span>
                  </div>
                </a>
              `;
            })
            .join("")}
        </div>
      </section>
    </main>
  `;
}

function renderChatHome() {
  const conversations = getConversationPreview();

  app.innerHTML = `
    <main class="conversation-panel">
      <header class="conversation-header">
        <h1>Mis conversaciones</h1>

        <p>
          Continúa una conversación existente o inicia una nueva
          con uno de los personajes.
        </p>
      </header>

      <section
        class="conversation-list"
        aria-labelledby="conversation-list-title"
      >
        <h2 id="conversation-list-title">Conversaciones</h2>

        ${conversations
          .map(
            (conversation) => `
              <article class="conversation-card">
                <div class="conversation-avatar">
                  <img
                    class="conversation-avatar-image"
                    src="${characterImages[conversation.id]}"
                    alt="${conversation.name}"
                  />
                </div>

                <div class="conversation-content">
                  <h3>${conversation.name}</h3>

                  <p class="conversation-personality">
                    ${conversation.personality}
                  </p>

                  ${
                    conversation.lastMessage
                      ? `
                        <p class="conversation-preview">
                          <strong>
                            ${
                              conversation.lastMessage.sender === "user"
                                ? "Tú:"
                                : `${conversation.name}:`
                            }
                          </strong>
                          ${escapeHTML(conversation.lastMessage.text)}
                        </p>
                      `
                      : `
                        <p class="conversation-empty">
                          Todavía no has iniciado una conversación.
                        </p>
                      `
                  }
                </div>

                <a
                  class="conversation-link"
                  href="/chat?character=${conversation.id}"
                  data-character="${conversation.id}"
                >
                  ${
                    conversation.lastMessage
                      ? "Continuar conversación"
                      : "Iniciar conversación"
                  }
                </a>
              </article>
            `,
          )
          .join("")}
      </section>
    </main>
  `;
}

function renderAbout() {
  const characterIds = ["bugs", "silvestre", "lucas"];

  const characters = characterIds
    .map((characterId) => getCharacter(characterId))
    .filter(Boolean);

  app.innerHTML = `
    <main class="about">
      <header class="about-header">
        <h1>Sobre Looney AI Chat</h1>

        <p>
          Una experiencia de conversación con tus personajes
          favoritos de Looney Tunes mediante inteligencia artificial.
        </p>
      </header>

      <section class="about-section">
        <h2>Características</h2>

        <div class="about-features">
          <article class="about-feature">
            <h3>🤖 Inteligencia artificial</h3>

            <p>
              Genera respuestas para crear conversaciones
              dinámicas con los personajes.
            </p>
          </article>

          <article class="about-feature">
            <h3>💬 Conversaciones</h3>

            <p>
              Cada personaje mantiene su propia conversación
              para que puedas retomarla posteriormente.
            </p>
          </article>

          <article class="about-feature">
            <h3>🎭 Personajes</h3>

            <p>
              Personajes clásicos de Looney Tunes, conocidos por sus
              personalidades únicas, situaciones humorísticas y aventuras.
            </p>
          </article>

          <article class="about-feature">
            <h3>📱 Experiencia responsive</h3>

            <p>
              La interfaz está adaptada para utilizarse
              cómodamente desde diferentes dispositivos.
            </p>
          </article>
        </div>
      </section>

      <section class="about-section">
        <h2>Personajes disponibles</h2>

        <div class="about-characters">
          ${characters
            .map(
              (character) => `
                <article class="about-character">
                  <h3>${character.name}</h3>

                  <p>${character.description}</p>

                  <p>
                    <strong>Personalidad:</strong>
                    ${character.personality}
                  </p>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>

      <section class="about-action">
        <h2>¿Listo para conversar?</h2>

        <p>
          Elige un personaje y comienza tu conversación.
        </p>

        <a class="about-action-link" href="/home">
          Comenzar a conversar
        </a>
      </section>

      <section class="about-section">
        <h2>Tecnologías</h2>

        <p class="about-technologies">
          HTML · CSS · JavaScript · Vitest · Vercel · localStorage
        </p>
      </section>

      <section class="about-section credits-section">
        <h2>Créditos</h2>

        <p>
          Proyecto desarrollado por <strong>MAURICIO LOPEZ</strong>.
        </p>

        <div class="credits-links">
          <a
            href="https://github.com/mllopezc-cmd"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub personal
          </a>

          <a
            href="https://github.com/mllopezc-cmd/Proyecto-M3_Looney_IA_chat"
            target="_blank"
            rel="noopener noreferrer"
          >
            Repositorio del proyecto
          </a>
        </div>

        <p class="credits-disclaimer">
          Proyecto independiente de desarrollo de software orientado a la exploración de experiencias conversacionales 
          con inteligencia artificial, concebido como una base tecnológica con potencial de evolución comercial. 
          Looney Tunes y sus personajes son propiedad de Warner Bros. Discovery y/o de sus respectivos titulares de derechos. 
          Este proyecto es independiente y no está afiliado, patrocinado, autorizado ni respaldado por Warner Bros. Discovery.
        </p>
      </section>
    </main>
  `;
}

function getRoute(pathname) {
  if (pathname === "/chat") {
    return "chat";
  }

  if (pathname === "/about") {
    return "about";
  }

  if (pathname === "/" || pathname === "/home") {
    return "home";
  }

  return "home";
}

function router() {
  const path = window.location.pathname;
  const route = getRoute(path);

  if (route === "chat") {
    const params = new URLSearchParams(window.location.search);
    const characterId = params.get("character");

    if (!characterId) {
      renderChatHome();
      return;
    }

    renderChat(characterId, app);
    return;
  }

  if (route === "about") {
    renderAbout();
    return;
  }

  renderHome();
}

document.addEventListener("click", (event) => {
  const characterLink = event.target.closest("[data-character]");

  if (characterLink) {
    event.preventDefault();

    const characterId = characterLink.dataset.character;

    window.history.pushState({}, "", `/chat?character=${characterId}`);

    router();
    return;
  }

  const link = event.target.closest("[data-route]");

  if (link) {
    event.preventDefault();

    const route = link.dataset.route;
    window.history.pushState({}, "", route);

    const navigation = link.closest(".main-nav");

    if (navigation) {
      navigation.removeAttribute("open");
    }

    router();
    return;
  }

  if (mainNav?.open && !event.target.closest(".main-nav")) {
    mainNav.removeAttribute("open");
  }
});

window.addEventListener("popstate", router);

const mainNav = document.querySelector(".main-nav");

if (mainNav) {
  const menuButton = mainNav.querySelector("summary");

  mainNav.addEventListener("toggle", () => {
    const isOpen = mainNav.open;

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación",
    );
  });
}

const themeToggle = document.querySelector("#theme-toggle");
const savedTheme = localStorage.getItem("looney-theme");

if (themeToggle) {
  const themeIcon = themeToggle.querySelector(".theme-icon");
  const themeLabel = themeToggle.querySelector(".theme-label");

  const updateThemeButton = (isDarkMode) => {
    themeIcon.textContent = isDarkMode ? "☀️" : "🌙";
    themeLabel.textContent = isDarkMode ? "Modo claro" : "Modo oscuro";

    themeToggle.setAttribute(
      "aria-label",
      isDarkMode ? "Activar modo claro" : "Activar modo oscuro",
    );
  };

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  updateThemeButton(document.body.classList.contains("dark-mode"));

  themeToggle.addEventListener("click", () => {
    const isDarkMode = document.body.classList.toggle("dark-mode");

    updateThemeButton(isDarkMode);

    localStorage.setItem("looney-theme", isDarkMode ? "dark" : "light");
  });
}

router();

export { getRoute };
