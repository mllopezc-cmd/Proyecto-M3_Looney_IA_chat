import { describe, expect, test, vi } from "vitest";
import { cleanMessage, createMessage, fetchData } from "../src/utils.js";

describe("cleanMessage", () => {
  test("elimina espacios al inicio y al final", () => {
    expect(cleanMessage("  Hola Bugs  ")).toBe("Hola Bugs");
  });

  test("mantiene un mensaje sin espacios innecesarios", () => {
    expect(cleanMessage("Hola")).toBe("Hola");
  });
});

describe("createMessage", () => {
  test("crea correctamente un mensaje de usuario", () => {
    expect(createMessage("user", "Hola")).toEqual({
      sender: "user",
      text: "Hola",
    });
  });

  test("limpia el texto al crear el mensaje", () => {
    expect(createMessage("character", "  Hola  ")).toEqual({
      sender: "character",
      text: "Hola",
    });
  });
});

describe("fetchData", () => {
  test("devuelve correctamente los datos JSON", async () => {
    const mockData = {
      message: "Hola Bugs",
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchData("/api/test");

    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith("/api/test", {});
  });

  test("lanza un error cuando la petición falla", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(fetchData("/api/test")).rejects.toThrow(
      "Error en la petición: 500",
    );
  });
});
