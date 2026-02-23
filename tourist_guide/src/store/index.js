import { configureStore } from "@reduxjs/toolkit";
import placesReducer from "./slices/placesSlice";
import favoritesReducer from "./slices/favoritesSlice";

export const store = configureStore({
  reducer: {
    places: placesReducer,
    favorites: favoritesReducer,
  },
});
