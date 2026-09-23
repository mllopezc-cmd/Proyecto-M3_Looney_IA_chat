import { createMessage } from "./utils.js";

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

    return parsedHistory;
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

export function getCharacter(characterId) {
  return characters[characterId] || null;
}

export function getConversationPreview() {
  return Object.keys(characters).map((characterId) => {
    const character = characters[characterId];
    const conversation = conversations[characterId] || [];

    const lastMessage =
      conversation.length > 0 ? conversation[conversation.length - 1] : null;

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

  container.innerHTML = conversation
    .map(
      (message) => `
        <article class="message message-${message.sender}">
          <p>${message.text}</p>
        </article>
      `,
    )
    .join("");

  container.scrollTop = container.scrollHeight;
}

function handleSubmit(event, characterId, messagesContainer) {
  event.preventDefault();

  const input = event.target.elements.message;
  const text = input.value.trim();

  if (!text) {
    return;
  }

  addMessage(characterId, "user", text);

  input.value = "";

  renderMessages(characterId, messagesContainer);
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
        <h1>${character.name}</h1>
        <p>${character.description}</p>
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

  const conversation = getConversation(characterId);

  if (conversation.length === 0) {
    addMessage(characterId, "character", character.greeting);
  }

  renderMessages(characterId, messagesContainer);

  form.addEventListener("submit", (event) => {
    handleSubmit(event, characterId, messagesContainer);
  });

  clearHistoryButton.addEventListener("click", () => {
    clearConversation(characterId);

    addMessage(characterId, "character", character.greeting);

    renderMessages(characterId, messagesContainer);
  });
}
