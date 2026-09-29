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

  appendChild: vi.fn(),
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

const navigationSummary = {
  setAttribute: vi.fn(),
};

const navigationMenu = {
  open: false,

  querySelector: vi.fn((selector) => {
    if (selector === "summary") {
      return navigationSummary;
    }

    return null;
  }),

  addEventListener: vi.fn((event, callback) => {
    if (event === "toggle") {
      navigationMenu.toggleHandler = callback;
    }
  }),

  removeAttribute: vi.fn((attribute) => {
    if (attribute === "open") {
      navigationMenu.open = false;
    }
  }),

  toggleHandler: null,
};

const createElementMock = (tagName) => {
  const element = {
    tagName: tagName.toUpperCase(),
    className: "",
    id: "",
    textContent: "",
    disabled: false,
    children: [],

    setAttribute: vi.fn(),

    appendChild: vi.fn((child) => {
      element.children.push(child);
    }),

    remove: vi.fn(),
  };

  return element;
};

const documentMock = {
  querySelector: vi.fn((selector) => {
    if (selector === "#app") {
      return appElement;
    }

    if (selector === ".main-nav") {
      return navigationMenu;
    }

    return null;
  }),

  createElement: vi.fn((tagName) => createElementMock(tagName)),

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
  messagesContainer.appendChild.mockClear();

  input.value = "";

  form.submitHandler = null;
  clearHistoryButton.clickHandler = null;

  navigationMenu.open = false;

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

  test("muestra el indicador de carga mientras procesa el mensaje", () => {
    renderChat("bugs", appElement);

    input.value = "Hola Bugs";

    form.submitHandler({
      preventDefault: vi.fn(),
      target: form,
    });

    expect(document.createElement).toHaveBeenCalledWith("article");
    expect(document.createElement).toHaveBeenCalledWith("p");

    expect(messagesContainer.appendChild).toHaveBeenCalled();

    const loadingMessage = messagesContainer.appendChild.mock.calls
      .map(([element]) => element)
      .find((element) => element.className === "message message-loading");

    expect(loadingMessage).toBeDefined();
    expect(loadingMessage.id).toBe("message-loading");
    expect(loadingMessage.setAttribute).toHaveBeenCalledWith(
      "aria-live",
      "polite",
    );
  });

  test("bloquea nuevos envíos mientras procesa el mensaje", () => {
    renderChat("bugs", appElement);

    input.value = "Primer mensaje";

    form.submitHandler({
      preventDefault: vi.fn(),
      target: form,
    });

    expect(input.disabled).toBe(true);
    expect(clearHistoryButton.disabled).toBe(true);

    const htmlAfterFirstSubmit = messagesContainer.innerHTML;

    input.value = "Segundo mensaje";

    form.submitHandler({
      preventDefault: vi.fn(),
      target: form,
    });

    expect(messagesContainer.innerHTML).toBe(htmlAfterFirstSubmit);
    expect(messagesContainer.innerHTML).not.toContain("Segundo mensaje");
  });

  test("restablece los controles y elimina el indicador al finalizar la respuesta", async () => {
    renderChat("bugs", appElement);

    let resolveFetch;

    globalThis.fetch = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    );

    input.value = "Hola Bugs";

    form.submitHandler({
      preventDefault: vi.fn(),
      target: form,
    });

    expect(input.disabled).toBe(true);
    expect(clearHistoryButton.disabled).toBe(true);

    const loadingMessage = messagesContainer.appendChild.mock.calls
      .map(([element]) => element)
      .find((element) => element.className === "message message-loading");

    expect(loadingMessage).toBeDefined();

    resolveFetch({
      ok: true,
      json: async () => ({
        reply: "Respuesta de Bugs",
      }),
    });

    await vi.waitFor(() => {
      expect(input.disabled).toBe(false);
      expect(clearHistoryButton.disabled).toBe(false);
    });

    expect(messagesContainer.innerHTML).toContain("Respuesta de Bugs");
    expect(loadingMessage.textContent).not.toBe("Escribiendo.");
  });

  test("muestra un mensaje de error y restablece los controles cuando falla la respuesta", async () => {
    renderChat("bugs", appElement);

    let rejectFetch;

    globalThis.fetch = vi.fn(
      () =>
        new Promise((_, reject) => {
          rejectFetch = reject;
        }),
    );

    input.value = "Hola Bugs";

    form.submitHandler({
      preventDefault: vi.fn(),
      target: form,
    });

    expect(input.disabled).toBe(true);
    expect(clearHistoryButton.disabled).toBe(true);

    rejectFetch(new Error("Error de conexión"));

    await vi.waitFor(() => {
      expect(input.disabled).toBe(false);
      expect(clearHistoryButton.disabled).toBe(false);
    });

    expect(messagesContainer.innerHTML).toContain(
      "Lo siento, no pude responder en este momento. Inténtalo nuevamente.",
    );
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

describe("Tarjetas de personajes en Home", () => {
  test("renderiza cada tarjeta como un enlace hacia el chat correspondiente", () => {
    windowMock.location.pathname = "/home";
    windowMock.location.search = "";

    popstateHandler();

    expect(appElement.innerHTML).toContain('class="character-card"');

    expect(appElement.innerHTML).toContain('href="/chat?character=bugs"');

    expect(appElement.innerHTML).toContain('href="/chat?character=silvestre"');

    expect(appElement.innerHTML).toContain('href="/chat?character=lucas"');
  });

  test("mantiene la acción de chat como contenido visual dentro de la tarjeta", () => {
    windowMock.location.pathname = "/home";
    windowMock.location.search = "";

    popstateHandler();

    expect(appElement.innerHTML).toContain("Chatear con Bugs Bunny");

    expect(appElement.innerHTML).toContain("Chatear con Silvestre");

    expect(appElement.innerHTML).toContain("Chatear con Pato Lucas");
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
  test("dispone del handler toggle del menú principal", () => {
    expect(navigationMenu.toggleHandler).toEqual(expect.any(Function));
  });

  test("actualiza el estado ARIA cuando el menú está cerrado", () => {
    navigationMenu.open = false;

    navigationMenu.toggleHandler();

    expect(navigationSummary.setAttribute).toHaveBeenCalledWith(
      "aria-expanded",
      "false",
    );

    expect(navigationSummary.setAttribute).toHaveBeenCalledWith(
      "aria-label",
      "Abrir menú de navegación",
    );
  });

  test("actualiza el estado ARIA cuando el menú está abierto", () => {
    navigationMenu.open = true;

    navigationMenu.toggleHandler();

    expect(navigationSummary.setAttribute).toHaveBeenCalledWith(
      "aria-expanded",
      "true",
    );

    expect(navigationSummary.setAttribute).toHaveBeenCalledWith(
      "aria-label",
      "Cerrar menú de navegación",
    );
  });

  test("restablece el estado ARIA cuando el menú vuelve a cerrarse", () => {
    navigationMenu.open = true;
    navigationMenu.toggleHandler();

    navigationMenu.open = false;
    navigationMenu.toggleHandler();

    expect(navigationSummary.setAttribute).toHaveBeenCalledWith(
      "aria-expanded",
      "false",
    );

    expect(navigationSummary.setAttribute).toHaveBeenCalledWith(
      "aria-label",
      "Abrir menú de navegación",
    );
  });

  test("cierra el menú al navegar mediante un enlace data-route", () => {
    navigationMenu.open = true;

    const preventDefault = vi.fn();

    const link = {
      dataset: { route: "/about" },

      closest: vi.fn((selector) => {
        if (selector === "[data-character]") return null;
        if (selector === "[data-route]") return link;
        if (selector === ".main-nav") return navigationMenu;
        return null;
      }),
    };

    documentClickHandler({
      target: link,
      preventDefault,
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(navigationMenu.removeAttribute).toHaveBeenCalledWith("open");
    expect(windowMock.history.pushState).toHaveBeenCalledWith({}, "", "/about");
  });

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
    expect(appElement.innerHTML).toContain("Sobre Looney AI Chat");
  });

  test("ejecuta el router cuando cambia la navegación mediante popstate", () => {
    windowMock.location.pathname = "/about";
    windowMock.location.search = "";

    popstateHandler();

    expect(appElement.innerHTML).toContain("Sobre Looney AI Chat");
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
