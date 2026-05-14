/**
 * Safely strips HTML tags from a string using the browser's native DOMParser.
 * @param {string} html - The string containing potential HTML tags.
 * @returns {string} - The cleaned plaintext string.
 */
export const stripHtml = (html) => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || doc.body.innerText || '';
};
