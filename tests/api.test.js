import { beforeEach, describe, expect, test, vi } from "vitest";
import handler from "../api/functions.js";

const createResponseMock = () => {
  const response = {
    status: vi.fn(),
    json: vi.fn(),
  };

  response.status.mockReturnValue(response);

  return response;
};

const createValidHistory = (count = 1, text = "Hola Bugs") =>
  Array.from({ length: count }, () => ({
    sender: "user",
    text,
  }));

const mockSuccessfulGeminiResponse = () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      candidates: [
        {
          content: {
            parts: [
              {
                text: "Respuesta de prueba",
              },
            ],
          },
        },
      ],
    }),
  });
};

describe("API handler", () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = "test-api-key";
    vi.restoreAllMocks();
  });

  test("responde 405 cuando el método HTTP no es POST", async () => {
    const request = {
      method: "GET",
    };

    const response = createResponseMock();

    await handler(request, response);

    expect(response.status).toHaveBeenCalledWith(405);
    expect(response.json).toHaveBeenCalledWith({
      error: "Método no permitido.",
    });
  });

  test("responde 400 cuando el body es inválido", async () => {
    const request = {
      method: "POST",
      body: {},
    };

    const response = createResponseMock();

    await handler(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      error: "Personaje no válido.",
    });
  });

  test("responde 400 cuando el historial no cumple la estructura esperada", async () => {
    const request = {
      method: "POST",
      body: {
        characterId: "bugs",
        history: [
          {
            sender: "invalid",
            text: "Hola Bugs",
          },
        ],
      },
    };

    const response = createResponseMock();

    await handler(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      error: "El historial de conversación no es válido.",
    });
  });

  test("responde 502 cuando Gemini devuelve un error", async () => {
    const request = {
      method: "POST",
      body: {
        characterId: "bugs",
        history: createValidHistory(),
      },
    };

    const response = createResponseMock();

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({
        error: {
          message: "Error simulado de Gemini",
        },
      }),
    });

    await handler(request, response);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(502);
    expect(response.json).toHaveBeenCalledWith({
      error: "No se pudo obtener una respuesta de Gemini.",
    });
  });

  test("permite un mensaje de exactamente 2000 caracteres", async () => {
    const request = {
      method: "POST",
      body: {
        characterId: "bugs",
        history: createValidHistory(1, "a".repeat(2000)),
      },
    };

    const response = createResponseMock();

    mockSuccessfulGeminiResponse();

    await handler(request, response);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  test("rechaza un mensaje de más de 2000 caracteres", async () => {
    const request = {
      method: "POST",
      body: {
        characterId: "bugs",
        history: createValidHistory(1, "a".repeat(2001)),
      },
    };

    const response = createResponseMock();

    globalThis.fetch = vi.fn();

    await handler(request, response);

    expect(fetch).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      error: "El historial de conversación no es válido.",
    });
  });

  test("permite un historial de exactamente 20 mensajes", async () => {
    const request = {
      method: "POST",
      body: {
        characterId: "bugs",
        history: createValidHistory(20),
      },
    };

    const response = createResponseMock();

    mockSuccessfulGeminiResponse();

    await handler(request, response);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  test("rechaza un historial de más de 20 mensajes", async () => {
    const request = {
      method: "POST",
      body: {
        characterId: "bugs",
        history: createValidHistory(21),
      },
    };

    const response = createResponseMock();

    globalThis.fetch = vi.fn();

    await handler(request, response);

    expect(fetch).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      error: "El historial de conversación no es válido.",
    });
  });

  test("permite un historial de exactamente 12000 caracteres", async () => {
    const request = {
      method: "POST",
      body: {
        characterId: "bugs",
        history: createValidHistory(6, "a".repeat(2000)),
      },
    };

    const response = createResponseMock();

    mockSuccessfulGeminiResponse();

    await handler(request, response);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  test("rechaza un historial de más de 12000 caracteres", async () => {
    const request = {
      method: "POST",
      body: {
        characterId: "bugs",
        history: [
          ...createValidHistory(5, "a".repeat(2000)),
          {
            sender: "user",
            text: "a".repeat(1999),
          },
          {
            sender: "user",
            text: "aa",
          },
        ],
      },
    };

    const response = createResponseMock();

    globalThis.fetch = vi.fn();

    await handler(request, response);

    expect(fetch).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      error: "El historial de conversación supera el límite permitido.",
    });
  });
});
