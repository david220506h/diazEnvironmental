import { atom } from "nanostores";

// Nace siempre en "en", igual que el HTML generado en build (SSG), para que la
// primera hidratación en cliente coincida con el servidor y no dispare el error
// de hidratación #418. La preferencia guardada en localStorage se aplica después
// de montar (ver LanguageModal), como una actualización normal del store.
export const languageStore = atom<"es" | "en">("en");