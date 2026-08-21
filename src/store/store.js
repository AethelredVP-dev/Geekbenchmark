import { configureStore } from "@reduxjs/toolkit";
import benchmarkReducer from "@/store/benchmarkSlice";

export const store = configureStore({
  reducer: {
    benchmark: benchmarkReducer,
  },
});
