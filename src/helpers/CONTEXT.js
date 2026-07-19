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
  Tiers: [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "ultra", label: "Ultra" },
  ],
});
