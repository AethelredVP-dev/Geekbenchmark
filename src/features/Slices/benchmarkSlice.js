import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  report: null,
  loading: false,
  error: null,
  games: [],
  specs: {},
  searchItem: "",
  filteredGames: [],
  page: 1,
  Tiers: [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "ultra", label: "Ultra" },
  ],
  darkMode: false,
};

export const benchmarkSlice = createSlice({
  name: "benchmark",
  initialState: initialState,
  reducers: {
    setReport: (state, action) => {
      state.report = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setGames: (state, action) => {
      state.games = action.payload;
    },
    setSearchItem: (state, action) => {
      state.searchItem = action.payload;
    },
    setFilteredGames: (state, action) => {
      state.filteredGames = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSpecs: (state, action) => {
      state.specs = action.payload;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
  },
});

export const {
  setReport,
  setDarkMode,
  setLoading,
  setError,
  setGames,
  setSearchItem,
  setFilteredGames,
  setPage,
  setSpecs,
} = benchmarkSlice.actions;
export default benchmarkSlice.reducer;
