import { createContext } from "react";

export const context = createContext({
  darkMode: false,
  setDarkMode: () => {},
  specs: {},
  setSpecs: () => {},
  gamesData: [],
  setGamesData: () => {},
  report: null,
  setReport: () => {},
  loading: false,
  setLoading: () => {},
});
