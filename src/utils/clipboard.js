export async function copyToClipboard(value) {
  if (!navigator?.clipboard) {
    throw new Error("Clipboard API no disponible");
  }

  await navigator.clipboard.writeText(value);
}
