import { getCharacter, getConversationPreview, renderChat } from "./chat.js";

const app = document.querySelector("#app");

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

              return `
                <article class="character-card">
                  <div class="character-avatar" aria-hidden="true">
                    ${character.name.charAt(0)}
                  </div>

                  <h3>${character.name}</h3>

                  <p>${character.description}</p>

                  <p class="character-personality">
                    ${character.personality}
                  </p>

                  <a
                    class="character-link"
                    href="/chat?character=${characterId}"
                    data-character="${characterId}"
                  >
                    Chatear con ${character.name}
                  </a>
                </article>
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
                  ${conversation.name.charAt(0)}
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
                          ${conversation.lastMessage.text}
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
        <h1>Sobre el proyecto</h1>
        <p>
          Looney AI Chat es una aplicación web que permite
          conversar con personajes de Looney Tunes mediante
          una interfaz de chat.
        </p>
      </header>

      <section class="about-section">
        <h2>Funcionalidades</h2>

        <ul>
          <li>Navegación entre Home, Chat y About.</li>
          <li>Selección de personajes desde Home.</li>
          <li>URLs individuales para cada personaje.</li>
          <li>Persistencia de conversaciones en localStorage.</li>
        </ul>
      </section>

      <section class="about-section">
        <h2>Personajes</h2>

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

      <section class="about-section">
        <h2>Tecnologías</h2>

        <p>
          HTML, CSS, JavaScript, Vite, Vitest y localStorage.
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

function updateNavigation(route) {
  const currentRoute = document.querySelector("#current-route");

  if (!currentRoute) {
    return;
  }

  const labels = {
    home: "Home",
    chat: "Chat",
    about: "About",
  };

  currentRoute.textContent = labels[route] || "Home";
}

function router() {
  const path = window.location.pathname;
  const route = getRoute(path);

  updateNavigation(route);

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
  const characterButton = event.target.closest("[data-character]");

  if (characterButton) {
    event.preventDefault();

    const characterId = characterButton.dataset.character;

    window.history.pushState({}, "", `/chat?character=${characterId}`);

    router();
    return;
  }

  const link = event.target.closest("[data-route]");

  if (!link) {
    return;
  }

  event.preventDefault();

  const route = link.dataset.route;

  window.history.pushState({}, "", route);

  const navigation = link.closest(".main-nav");

  if (navigation) {
    navigation.removeAttribute("open");
  }

  router();
});

window.addEventListener("popstate", router);

router();

export { getRoute };
