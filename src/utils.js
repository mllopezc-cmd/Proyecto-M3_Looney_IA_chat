export function cleanMessage(text) {
  return text.trim();
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
    throw new Error(`Error en la petición: ${response.status}`);
  }

  return response.json();
}
