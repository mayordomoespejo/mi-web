/**
 * Escribe un texto en el portapapeles del sistema.
 * @param {string} value - Texto a copiar.
 * @returns {Promise<void>}
 * @throws {Error} Si la Clipboard API no está disponible.
 */
export async function copyToClipboard(value) {
  if (!navigator?.clipboard) {
    throw new Error("Clipboard API not available");
  }

  await navigator.clipboard.writeText(value);
}
