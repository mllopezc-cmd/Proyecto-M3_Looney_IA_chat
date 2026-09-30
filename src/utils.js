export function cleanMessage(text) {
  return text.trim();
}

export function escapeHTML(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function createMessage(sender, text) {
  return {
    sender,
    text: cleanMessage(text),
  };
}

export async function fetchData(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    let errorMessage = `Error en la petición: ${response.status}`;

    if (typeof response.json === "function") {
      const data = await response.json();
      errorMessage = data.error || errorMessage;
    }

    const error = new Error(errorMessage);
    error.status = response.status;

    throw error;
  }

  return response.json();
}
