import { configureStore } from "@reduxjs/toolkit";
import benchmarkReducer from "../features/Slices/benchmarkSlice";

export const store = configureStore({
  reducer: {
    benchmark: benchmarkReducer,
  },
});
