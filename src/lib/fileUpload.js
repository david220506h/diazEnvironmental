export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;
export const MAX_FILES = 10;
export const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export const isAllowedFile = (file) =>
  ALLOWED_MIME_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE_BYTES;

export const cleanFileName = (name) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "_");
