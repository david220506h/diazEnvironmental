import { atom } from "nanostores";

const savedLang = typeof localStorage !== "undefined" 
  ? (localStorage.getItem("language") as "es" | "en") 
  : "es";

export const languageStore = atom<"es" | "en">(savedLang ?? "es");