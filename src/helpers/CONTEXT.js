import { createContext } from "react";

export const context = createContext({
  page: 1,
  setPage: () => {},
  searchItem: "",
  setSearchItem: () => {},
  setFilteredGames: () => {},
  filteredGames: [],
  darkMode: false,
  setDarkMode: () => {},
  specs: {},
  setSpecs: () => {},
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
