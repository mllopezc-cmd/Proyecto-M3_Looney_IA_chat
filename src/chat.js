import { createMessage, escapeHTML, fetchData } from "./utils.js";

const characters = {
  bugs: {
    name: "Bugs Bunny",
    description:
      "El conejo astuto, relajado y siempre preparado para responder con ingenio.",
    personality: "Astuto, relajado e ingenioso",
    greeting: "¿Qué hay de nuevo, viejo?",
  },

  silvestre: {
    name: "Silvestre",
    description:
      "El gato persistente que nunca abandona sus intentos de atrapar a su objetivo.",
    personality: "Persistente, expresivo y decidido",
    greeting:
      "Dime, ¿en qué puedo ayudarte antes de que la abuela regssse y crea que le rompí su jarrón otra vez? ¡Sssufrido sssucio sssafari, apúrate antes de que aparezca ese maldito canario!",
  },

  lucas: {
    name: "Pato Lucas",
    description:
      "Un personaje energético, expresivo y con una personalidad bastante particular.",
    personality: "Energético, expresivo y espontáneo",
    greeting:
      "Sssé que estás con la boca abierta y los ojos cuadrados de la emoción por hablar conmigo. Es natural, no te culpo. ¡Sssuelta esa pregunta! Pero hazlo rápido, que mi tiempo vale oro y Hollywood me espera. 💸🎬",
  },
};

const STORAGE_KEY = "looney-chat-history";
const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 20;
const MAX_HISTORY_CHARACTERS = 12000;

const characterImages = {
  bugs: "./assets/characters/bugs-bunny.webp",
  silvestre: "./assets/characters/silvestre.webp",
  lucas: "./assets/characters/pato-lucas.webp",
};

const conversations = loadConversations();

function loadConversations() {
  if (typeof localStorage === "undefined") {
    return {};
  }

  const storedHistory = localStorage.getItem(STORAGE_KEY);

  if (!storedHistory) {
    return {};
  }

  try {
    const parsedHistory = JSON.parse(storedHistory);

    if (
      typeof parsedHistory !== "object" ||
      parsedHistory === null ||
      Array.isArray(parsedHistory)
    ) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsedHistory).map(([characterId, conversation]) => [
        characterId,
        Array.isArray(conversation) ? conversation : [],
      ]),
    );
  } catch {
    return {};
  }
}

function saveConversations() {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

function getHistoryForAPI(conversation) {
  const limitedHistory = [];
  let totalCharacters = 0;

  for (let index = conversation.length - 1; index >= 0; index -= 1) {
    const message = conversation[index];

    if (
      !message ||
      (message.sender !== "user" && message.sender !== "character") ||
      typeof message.text !== "string" ||
      !message.text.trim()
    ) {
      continue;
    }

    const messageLength = message.text.length;

    if (
      limitedHistory.length >= MAX_HISTORY_MESSAGES ||
      totalCharacters + messageLength > MAX_HISTORY_CHARACTERS
    ) {
      break;
    }

    limitedHistory.unshift(message);
    totalCharacters += messageLength;
  }

  return limitedHistory;
}

export function getCharacter(characterId) {
  return characters[characterId] || null;
}

export function getConversationPreview() {
  return Object.keys(characters).map((characterId) => {
    const character = characters[characterId];
    const conversation = conversations[characterId] || [];

    const hasUserMessage = conversation.some(
      (message) => message.sender === "user",
    );

    const lastMessage = hasUserMessage
      ? conversation[conversation.length - 1]
      : null;

    return {
      id: characterId,
      name: character.name,
      personality: character.personality,
      lastMessage,
    };
  });
}

function getConversation(characterId) {
  if (!conversations[characterId]) {
    conversations[characterId] = [];
  }

  return conversations[characterId];
}

function addMessage(characterId, sender, text) {
  const conversation = getConversation(characterId);

  conversation.push(createMessage(sender, text));

  saveConversations();
}

function clearConversation(characterId) {
  conversations[characterId] = [];
  saveConversations();
}

function renderMessages(characterId, container) {
  const conversation = getConversation(characterId);

  container.innerHTML = `
    <div class="chat-watermark" aria-hidden="true">
      <img
        src="${characterImages[characterId]}"
        alt=""
      />
    </div>

    ${conversation
      .map(
        (message) => `
          <article class="message message-${message.sender}">
            <p>${escapeHTML(message.text)}</p>
          </article>
        `,
      )
      .join("")}
  `;

  container.scrollTop = container.scrollHeight;
}

async function handleSubmit(
  event,
  characterId,
  messagesContainer,
  loadingState,
  clearHistoryButton,
) {
  event.preventDefault();

  if (loadingState.isLoading) {
    return;
  }

  const input = event.target.elements.message;
  const text = input.value.trim();

  if (!text) {
    return;
  }

  if (text.length > MAX_MESSAGE_LENGTH) {
    if (typeof input.focus === "function") {
      input.focus();
    }
    return;
  }

  loadingState.isLoading = true;
  clearHistoryButton.disabled = true;

  addMessage(characterId, "user", text);

  input.value = "";

  renderMessages(characterId, messagesContainer);

  input.disabled = true;

  const loadingMessage = document.createElement("article");
  loadingMessage.className = "message message-loading";
  loadingMessage.id = "message-loading";
  loadingMessage.setAttribute("aria-live", "polite");

  const loadingText = document.createElement("p");
  loadingText.textContent = "Escribiendo.";
  loadingMessage.appendChild(loadingText);

  messagesContainer.appendChild(loadingMessage);

  let dots = 1;

  const typingInterval = setInterval(() => {
    dots = dots === 3 ? 1 : dots + 1;

    loadingText.textContent = `Escribiendo${".".repeat(dots)}`;
  }, 500);

  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  try {
    const conversation = getConversation(characterId);
    const historyForAPI = getHistoryForAPI(conversation);

    const data = await fetchData("/api/functions.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        characterId,
        history: historyForAPI,
      }),
    });

    addMessage(characterId, "character", data.reply);

    renderMessages(characterId, messagesContainer);
  } catch (error) {
    console.error("Error al procesar el mensaje:", error);

    let errorMessage =
      "Ocurrió un problema al procesar tu mensaje. Inténtalo nuevamente.";

    if (error?.status === 429) {
      errorMessage =
        "El servicio de IA alcanzó temporalmente su límite de uso. Inténtalo nuevamente más tarde.";
    } else if (error?.status === 500 || error?.status === 502) {
      errorMessage =
        "El servicio de IA no está disponible en este momento. Inténtalo nuevamente.";
    } else if (!error?.status) {
      errorMessage =
        "No se pudo conectar con el servicio. Revisa tu conexión e inténtalo nuevamente.";
    }

    messagesContainer.innerHTML += `
      <article class="message message-error" aria-live="polite">
        <p>${errorMessage}</p>
      </article>
    `;

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  } finally {
    clearInterval(typingInterval);
    if (loadingMessage && typeof loadingMessage.remove === "function") {
      loadingMessage.remove();
    }
    input.disabled = false;
    clearHistoryButton.disabled = false;
    if (typeof input.focus === "function") input.focus();
    loadingState.isLoading = false;
  }
}

export function renderChat(characterId, app) {
  const character = getCharacter(characterId);

  if (!character) {
    app.innerHTML = `
      <main class="chat">
        <h1>Personaje no encontrado</h1>
        <p>No se pudo encontrar el personaje seleccionado.</p>
      </main>
    `;

    return;
  }

  app.innerHTML = `
    <main class="chat">
      <header class="chat-header">
        <div class="chat-profile">
          <img
            class="chat-profile-image"
            src="${characterImages[characterId]}"
            alt="${character.name}"
          />

          <div class="chat-profile-info">
            <h1>${character.name}</h1>
            <p>${character.personality}</p>
          </div>
        </div>

        <p class="chat-description">${character.description}</p>
      </header>

      <section
        class="chat-messages"
        aria-label="Conversación"
      ></section>

      <form class="chat-form">
        <label for="message">Mensaje</label>

        <input
          id="message"
          name="message"
          type="text"
          placeholder="Escribe un mensaje..."
          autocomplete="off"
        />

        <button type="submit">Enviar</button>
      </form>

      <button
        type="button"
        class="clear-history"
        id="clear-history"
      >
        Borrar historial
      </button>
    </main>
  `;

  const messagesContainer = app.querySelector(".chat-messages");
  const form = app.querySelector(".chat-form");
  const clearHistoryButton = app.querySelector("#clear-history");
  const loadingState = {
    isLoading: false,
  };

  const conversation = getConversation(characterId);

  if (conversation.length === 0) {
    addMessage(characterId, "character", character.greeting);
  }

  renderMessages(characterId, messagesContainer);

  form.addEventListener("submit", (event) => {
    return handleSubmit(
      event,
      characterId,
      messagesContainer,
      loadingState,
      clearHistoryButton,
    );
  });

  clearHistoryButton.addEventListener("click", () => {
    if (loadingState.isLoading) return;

    clearConversation(characterId);
    addMessage(characterId, "character", character.greeting);
    renderMessages(characterId, messagesContainer);
  });
}
