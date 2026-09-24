import { describe, expect, test, vi, beforeEach } from "vitest";

const storage = {};

const localStorageMock = {
  getItem: vi.fn((key) => storage[key] ?? null),

  setItem: vi.fn((key, value) => {
    storage[key] = value;
  }),

  removeItem: vi.fn((key) => {
    delete storage[key];
  }),

  clear: vi.fn(() => {
    Object.keys(storage).forEach((key) => delete storage[key]);
  }),
};

globalThis.localStorage = localStorageMock;

const messagesContainer = {
  innerHTML: "",
  scrollTop: 0,
  scrollHeight: 100,
};

const input = {
  value: "",
};

const form = {
  addEventListener: vi.fn((event, callback) => {
    if (event === "submit") {
      form.submitHandler = callback;
    }
  }),

  elements: {
    message: input,
  },

  submitHandler: null,
};

const clearHistoryButton = {
  addEventListener: vi.fn((event, callback) => {
    if (event === "click") {
      clearHistoryButton.clickHandler = callback;
    }
  }),

  clickHandler: null,
};

const appElement = {
  innerHTML: "",

  querySelector: vi.fn((selector) => {
    if (selector === ".chat-messages") {
      return messagesContainer;
    }

    if (selector === ".chat-form") {
      return form;
    }

    if (selector === "#clear-history") {
      return clearHistoryButton;
    }

    return null;
  }),
};

let documentClickHandler = null;
let popstateHandler = null;

const documentMock = {
  querySelector: vi.fn((selector) => {
    if (selector === "#app") {
      return appElement;
    }

    return null;
  }),

  addEventListener: vi.fn((event, callback) => {
    if (event === "click") {
      documentClickHandler = callback;
    }

    if (event === "popstate") {
      popstateHandler = callback;
    }
  }),
};

const windowMock = {
  location: {
    pathname: "/",
    search: "",
  },

  history: {
    pushState: vi.fn((state, title, url) => {
      const parsedUrl = new URL(url, "http://localhost");

      windowMock.location.pathname = parsedUrl.pathname;
      windowMock.location.search = parsedUrl.search;
    }),
  },

  addEventListener: vi.fn((event, callback) => {
    if (event === "popstate") {
      popstateHandler = callback;
    }
  }),
};

globalThis.document = documentMock;
globalThis.window = windowMock;

const { getRoute } = await import("../src/app.js");
const { getCharacter, renderChat } = await import("../src/chat.js");

const STORAGE_KEY = "looney-chat-history";

beforeEach(() => {
  localStorageMock.clear();

  appElement.innerHTML = "";

  messagesContainer.innerHTML = "";
  messagesContainer.scrollTop = 0;

  input.value = "";

  form.submitHandler = null;
  clearHistoryButton.clickHandler = null;

  windowMock.location.pathname = "/";
  windowMock.location.search = "";

  vi.clearAllMocks();
});

describe("Datos de los personajes", () => {
  test("obtiene correctamente a Bugs Bunny", () => {
    const character = getCharacter("bugs");

    expect(character).toEqual({
      name: "Bugs Bunny",
      description:
        "El conejo astuto, relajado y siempre preparado para responder con ingenio.",
      personality: "Astuto, relajado e ingenioso",
      greeting: "¿Qué hay de nuevo, viejo?",
    });
  });

  test("obtiene correctamente a Silvestre", () => {
    const character = getCharacter("silvestre");

    expect(character).toEqual({
      name: "Silvestre",
      description:
        "El gato persistente que nunca abandona sus intentos de atrapar a su objetivo.",
      personality: "Persistente, expresivo y decidido",
      greeting:
        "Dime, ¿en qué puedo ayudarte antes de que la abuela regssse y crea que le rompí su jarrón otra vez? ¡Sssufrido sssucio sssafari, apúrate antes de que aparezca ese maldito canario!",
    });
  });

  test("obtiene correctamente al Pato Lucas", () => {
    const character = getCharacter("lucas");

    expect(character).toEqual({
      name: "Pato Lucas",
      description:
        "Un personaje energético, expresivo y con una personalidad bastante particular.",
      personality: "Energético, expresivo y espontáneo",
      greeting:
        "Sssé que estás con la boca abierta y los ojos cuadrados de la emoción por hablar conmigo. Es natural, no te culpo. ¡Sssuelta esa pregunta! Pero hazlo rápido, que mi tiempo vale oro y Hollywood me espera. 💸🎬",
    });
  });

  test("devuelve null para un personaje inexistente", () => {
    expect(getCharacter("personaje-inexistente")).toBeNull();
  });

  test("devuelve null cuando no se proporciona un personaje", () => {
    expect(getCharacter()).toBeNull();
  });

  test("devuelve null cuando el personaje está vacío", () => {
    expect(getCharacter("")).toBeNull();
  });
});

describe("Router", () => {
  test("reconoce la ruta /chat", () => {
    expect(getRoute("/chat")).toBe("chat");
  });

  test("reconoce la ruta /about", () => {
    expect(getRoute("/about")).toBe("about");
  });

  test("reconoce la ruta /home", () => {
    expect(getRoute("/home")).toBe("home");
  });

  test("envía la ruta raíz a Home", () => {
    expect(getRoute("/")).toBe("home");
  });

  test("envía una ruta inexistente a Home", () => {
    expect(getRoute("/ruta-inexistente")).toBe("home");
  });
});

describe("Chat", () => {
  test("muestra el saludo inicial del personaje", () => {
    renderChat("bugs", appElement);

    expect(messagesContainer.innerHTML).toContain("¿Qué hay de nuevo, viejo?");
  });

  test("envía y renderiza un mensaje del usuario", () => {
    renderChat("bugs", appElement);

    input.value = "Hola Bugs";

    form.submitHandler({
      preventDefault: vi.fn(),
      target: form,
    });

    expect(messagesContainer.innerHTML).toContain("Hola Bugs");
    expect(messagesContainer.innerHTML).toContain("message-user");
  });

  test("ignora un mensaje vacío", () => {
    renderChat("silvestre", appElement);

    const previousHTML = messagesContainer.innerHTML;

    input.value = "";

    form.submitHandler({
      preventDefault: vi.fn(),
      target: form,
    });

    expect(messagesContainer.innerHTML).toBe(previousHTML);
    expect(input.value).toBe("");
  });

  test("ignora un mensaje compuesto solamente por espacios", () => {
    renderChat("lucas", appElement);

    const previousHTML = messagesContainer.innerHTML;

    input.value = "     ";

    form.submitHandler({
      preventDefault: vi.fn(),
      target: form,
    });

    expect(messagesContainer.innerHTML).toBe(previousHTML);
    expect(input.value).toBe("     ");
  });

  test("permite enviar un mensaje después de un envío vacío", () => {
    renderChat("bugs", appElement);

    input.value = "";

    form.submitHandler({
      preventDefault: vi.fn(),
      target: form,
    });

    input.value = "Mensaje después del vacío";

    form.submitHandler({
      preventDefault: vi.fn(),
      target: form,
    });

    expect(messagesContainer.innerHTML).toContain("Mensaje después del vacío");
  });

  test("renderChat muestra un mensaje cuando el personaje no existe", () => {
    renderChat("personaje-inexistente", appElement);

    expect(appElement.innerHTML).toContain("Personaje no encontrado");
    expect(appElement.innerHTML).toContain(
      "No se pudo encontrar el personaje seleccionado.",
    );
  });

  test("renderChat muestra un mensaje cuando no se proporciona un personaje", () => {
    renderChat(undefined, appElement);

    expect(appElement.innerHTML).toContain("Personaje no encontrado");
    expect(appElement.innerHTML).toContain(
      "No se pudo encontrar el personaje seleccionado.",
    );
  });

  test("renderChat muestra un mensaje cuando el personaje está vacío", () => {
    renderChat("", appElement);

    expect(appElement.innerHTML).toContain("Personaje no encontrado");
    expect(appElement.innerHTML).toContain(
      "No se pudo encontrar el personaje seleccionado.",
    );
  });

  test("guarda la conversación en localStorage", () => {
    renderChat("silvestre", appElement);

    input.value = "Mensaje persistente";

    form.submitHandler({
      preventDefault: vi.fn(),
      target: form,
    });

    const storedHistory = JSON.parse(storage[STORAGE_KEY]);

    expect(storedHistory.silvestre).toEqual([
      {
        sender: "character",
        text: "Dime, ¿en qué puedo ayudarte antes de que la abuela regssse y crea que le rompí su jarrón otra vez? ¡Sssufrido sssucio sssafari, apúrate antes de que aparezca ese maldito canario!",
      },
      {
        sender: "user",
        text: "Mensaje persistente",
      },
    ]);
  });

  test("mantiene conversaciones independientes entre Bugs, Silvestre y Lucas", () => {
    renderChat("bugs", appElement);

    input.value = "Mensaje de Bugs";

    form.submitHandler({
      preventDefault: vi.fn(),
      target: form,
    });

    renderChat("silvestre", appElement);

    input.value = "Mensaje de Silvestre";

    form.submitHandler({
      preventDefault: vi.fn(),
      target: form,
    });

    renderChat("lucas", appElement);

    input.value = "Mensaje de Lucas";

    form.submitHandler({
      preventDefault: vi.fn(),
      target: form,
    });

    const storedHistory = JSON.parse(storage[STORAGE_KEY]);

    expect(storedHistory.bugs).toContainEqual({
      sender: "user",
      text: "Mensaje de Bugs",
    });

    expect(storedHistory.silvestre).toContainEqual({
      sender: "user",
      text: "Mensaje de Silvestre",
    });

    expect(storedHistory.lucas).toContainEqual({
      sender: "user",
      text: "Mensaje de Lucas",
    });
  });

  test("borra el historial de un personaje sin afectar los demás", () => {
    renderChat("bugs", appElement);

    input.value = "Mensaje de Bugs";

    form.submitHandler({
      preventDefault: vi.fn(),
      target: form,
    });

    renderChat("silvestre", appElement);

    input.value = "Mensaje de Silvestre";

    form.submitHandler({
      preventDefault: vi.fn(),
      target: form,
    });

    renderChat("lucas", appElement);

    input.value = "Mensaje de Lucas";

    form.submitHandler({
      preventDefault: vi.fn(),
      target: form,
    });

    renderChat("bugs", appElement);

    clearHistoryButton.clickHandler();

    const storedHistory = JSON.parse(storage[STORAGE_KEY]);

    expect(storedHistory.bugs).toEqual([
      {
        sender: "character",
        text: "¿Qué hay de nuevo, viejo?",
      },
    ]);

    expect(storedHistory.silvestre).toContainEqual({
      sender: "user",
      text: "Mensaje de Silvestre",
    });

    expect(storedHistory.lucas).toContainEqual({
      sender: "user",
      text: "Mensaje de Lucas",
    });
  });

  test("vuelve a mostrar el historial del personaje al regresar a su conversación", () => {
    renderChat("bugs", appElement);

    input.value = "Conversación de Bugs";

    form.submitHandler({
      preventDefault: vi.fn(),
      target: form,
    });

    renderChat("silvestre", appElement);

    input.value = "Conversación de Silvestre";

    form.submitHandler({
      preventDefault: vi.fn(),
      target: form,
    });

    renderChat("bugs", appElement);

    expect(messagesContainer.innerHTML).toContain("Conversación de Bugs");

    expect(messagesContainer.innerHTML).not.toContain(
      "Conversación de Silvestre",
    );
  });
});

describe("Integración Home → Chat", () => {
  test("selecciona un personaje desde Home y navega a su chat", () => {
    const characterButton = {
      dataset: {
        character: "bugs",
      },

      closest: vi.fn((selector) => {
        if (selector === "[data-character]") {
          return characterButton;
        }

        return null;
      }),
    };

    documentClickHandler({
      target: characterButton,
      preventDefault: vi.fn(),
    });

    expect(windowMock.history.pushState).toHaveBeenCalledWith(
      {},
      "",
      "/chat?character=bugs",
    );

    expect(windowMock.location.pathname).toBe("/chat");
    expect(windowMock.location.search).toBe("?character=bugs");

    expect(appElement.innerHTML).toContain("Bugs Bunny");
    expect(messagesContainer.innerHTML).toContain("¿Qué hay de nuevo, viejo?");
  });

  test("conserva el historial al salir de Home y regresar al chat del personaje", () => {
    const characterButton = {
      dataset: {
        character: "bugs",
      },

      closest: vi.fn((selector) => {
        if (selector === "[data-character]") {
          return characterButton;
        }

        return null;
      }),
    };

    documentClickHandler({
      target: characterButton,
      preventDefault: vi.fn(),
    });

    expect(windowMock.location.pathname).toBe("/chat");
    expect(windowMock.location.search).toBe("?character=bugs");

    input.value = "Hola Bugs";

    form.submitHandler({
      preventDefault: vi.fn(),
      target: form,
    });

    expect(messagesContainer.innerHTML).toContain("Hola Bugs");

    windowMock.location.pathname = "/";
    windowMock.location.search = "";

    popstateHandler();

    expect(appElement.innerHTML).toContain("Elige tu personaje");

    documentClickHandler({
      target: characterButton,
      preventDefault: vi.fn(),
    });

    expect(windowMock.location.pathname).toBe("/chat");
    expect(windowMock.location.search).toBe("?character=bugs");

    expect(messagesContainer.innerHTML).toContain("Hola Bugs");
  });
});

describe("Panel de conversaciones", () => {
  test("muestra el panel al entrar a /chat sin seleccionar personaje", () => {
    windowMock.location.pathname = "/chat";
    windowMock.location.search = "";

    popstateHandler();

    expect(appElement.innerHTML).toContain("Mis conversaciones");
    expect(appElement.innerHTML).toContain("Bugs Bunny");
    expect(appElement.innerHTML).toContain("Silvestre");
    expect(appElement.innerHTML).toContain("Pato Lucas");
  });

  test("muestra el enlace de cada personaje con su ruta correspondiente", () => {
    windowMock.location.pathname = "/chat";
    windowMock.location.search = "";

    popstateHandler();

    expect(appElement.innerHTML).toContain('href="/chat?character=bugs"');

    expect(appElement.innerHTML).toContain('href="/chat?character=silvestre"');

    expect(appElement.innerHTML).toContain('href="/chat?character=lucas"');
  });

  test("muestra el último mensaje de una conversación existente", () => {
    windowMock.location.pathname = "/chat";
    windowMock.location.search = "?character=bugs";

    popstateHandler();

    input.value = "Hola Bugs";

    form.submitHandler({
      preventDefault: vi.fn(),
      target: form,
    });

    windowMock.location.search = "";

    popstateHandler();

    expect(appElement.innerHTML).toContain("Hola Bugs");
    expect(appElement.innerHTML).toContain("Tú:");
    expect(appElement.innerHTML).toContain("Continuar conversación");
  });
});

describe("Navegación SPA", () => {
  test("navega mediante un enlace data-route usando pushState", () => {
    const preventDefault = vi.fn();

    const link = {
      dataset: {
        route: "/about",
      },

      closest: vi.fn((selector) => {
        if (selector === "[data-character]") {
          return null;
        }

        if (selector === "[data-route]") {
          return link;
        }

        return null;
      }),
    };

    documentClickHandler({
      target: link,
      preventDefault,
    });

    expect(preventDefault).toHaveBeenCalled();

    expect(windowMock.history.pushState).toHaveBeenCalledWith({}, "", "/about");

    expect(windowMock.location.pathname).toBe("/about");
    expect(appElement.innerHTML).toContain("About");
  });

  test("ejecuta el router cuando cambia la navegación mediante popstate", () => {
    windowMock.location.pathname = "/about";
    windowMock.location.search = "";

    popstateHandler();

    expect(appElement.innerHTML).toContain("About");
  });

  test("permite regresar a Home mediante popstate", () => {
    windowMock.location.pathname = "/home";
    windowMock.location.search = "";

    popstateHandler();

    expect(appElement.innerHTML).toContain("Elige tu personaje");
  });
});

describe("Recuperación de conversación", () => {
  test("ignora un historial con JSON inválido", async () => {
    storage[STORAGE_KEY] = "esto no es JSON";

    vi.resetModules();

    const { renderChat: renderChatWithInvalidData } =
      await import("../src/chat.js");

    renderChatWithInvalidData("bugs", appElement);

    expect(messagesContainer.innerHTML).toContain("¿Qué hay de nuevo, viejo?");
  });

  test("ignora un historial con una estructura JSON inválida", async () => {
    storage[STORAGE_KEY] = JSON.stringify(null);

    vi.resetModules();

    const { renderChat: renderChatWithInvalidStructure } =
      await import("../src/chat.js");

    renderChatWithInvalidStructure("bugs", appElement);

    expect(messagesContainer.innerHTML).toContain("¿Qué hay de nuevo, viejo?");

    expect(JSON.parse(storage[STORAGE_KEY]).bugs).toEqual([
      {
        sender: "character",
        text: "¿Qué hay de nuevo, viejo?",
      },
    ]);
  });

  test("recupera una conversación existente desde localStorage", async () => {
    storage[STORAGE_KEY] = JSON.stringify({
      bugs: [
        {
          sender: "character",
          text: "¿Qué hay de nuevo, viejo?",
        },
        {
          sender: "user",
          text: "Conversación recuperada",
        },
      ],
    });

    vi.resetModules();

    const { renderChat: renderChatWithStoredData } =
      await import("../src/chat.js");

    renderChatWithStoredData("bugs", appElement);

    expect(messagesContainer.innerHTML).toContain("Conversación recuperada");

    expect(messagesContainer.innerHTML).toContain("¿Qué hay de nuevo, viejo?");
  });
});
