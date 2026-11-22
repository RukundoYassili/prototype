const idPattern = /^[0-9a-f]{8}-[0-9a-f-]{27,}$/i;
const text = (value, max) => typeof value === "string" && value.length <= max;
const stringArray = (value, max) =>
  Array.isArray(value) &&
  value.length <= max &&
  value.every((item) => text(item, 500));
const types = {
  heading: ["text"],
  paragraph: ["text"],
  quote: ["text"],
  notice: ["text"],
  list: ["items"],
  table: ["headers", "rows"],
  question: ["question", "answer"],
  link: ["label", "url"],
  download: ["label", "url"],
  image: ["mediaId", "alt", "caption"],
};
export function safeEditorialUrl(value) {
  if (typeof value !== "string" || value.length > 2000 || /\s|\\/.test(value))
    return false;
  if (!value) return true;
  if (value.startsWith("/")) return !value.startsWith("//");
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}
export function validBlocks(blocks) {
  if (blocks === undefined) return true;
  if (!Array.isArray(blocks) || blocks.length > 100) return false;
  const ids = new Set();
  return blocks.every((block) => {
    if (
      !block ||
      typeof block !== "object" ||
      Array.isArray(block) ||
      typeof block.type !== "string" ||
      !Object.hasOwn(types, block.type) ||
      !text(block.id, 40) ||
      !idPattern.test(block.id) ||
      ids.has(block.id)
    )
      return false;
    ids.add(block.id);
    if (
      Object.keys(block).some(
        (key) => !["id", "type", ...types[block.type]].includes(key),
      )
    )
      return false;
    if (["heading", "paragraph", "quote", "notice"].includes(block.type))
      return text(block.text, 5000);
    if (block.type === "list") return stringArray(block.items, 50);
    if (block.type === "table")
      return (
        stringArray(block.headers, 12) &&
        block.headers.length > 0 &&
        Array.isArray(block.rows) &&
        block.rows.length <= 50 &&
        block.rows.every(
          (row) => stringArray(row, 12) && row.length === block.headers.length,
        )
      );
    if (block.type === "question")
      return text(block.question, 2000) && text(block.answer, 5000);
    if (block.type === "link" || block.type === "download")
      return text(block.label, 300) && safeEditorialUrl(block.url);
    return (
      text(block.mediaId, 40) &&
      (!block.mediaId || idPattern.test(block.mediaId)) &&
      text(block.alt, 300) &&
      text(block.caption, 500)
    );
  });
}
export function blocksComplete(blocks) {
  return blocks.every((block) => {
    if (["heading", "paragraph", "quote", "notice"].includes(block.type))
      return block.text.trim().length > 0;
    if (block.type === "list")
      return (
        block.items.length > 0 && block.items.every((value) => value.trim())
      );
    if (block.type === "table")
      return (
        block.rows.length > 0 &&
        block.headers.every((value) => value.trim()) &&
        block.rows.every((row) => row.every((value) => value.trim()))
      );
    if (block.type === "question")
      return !!block.question.trim() && !!block.answer.trim();
    if (block.type === "link" || block.type === "download")
      return !!block.label.trim() && !!block.url;
    return !!block.mediaId && !!block.alt.trim();
  });
}
