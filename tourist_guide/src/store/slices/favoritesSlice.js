import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "FAVORITES_V1";

// Función helper para guardar (con manejo de errores)
const saveToStorage = async (favorites) => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(favorites));
    console.log("✅ Saved to storage:", favorites.length, "items");
  } catch (error) {
    console.error("❌ Error saving to storage:", error);
  }
};

// Thunk para cargar favoritos al iniciar
export const loadFavoritesFromStorage = () => async (dispatch) => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : [];
    console.log("📦 Loaded from storage:", data.length, "items");
    dispatch(setFavorites(data));
  } catch (error) {
    console.error("❌ Error loading from storage:", error);
    dispatch(setFavorites([]));
  }
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: { items: [] },
  reducers: {
    setFavorites(state, action) {
      state.items = action.payload ?? [];
      console.log("📝 Set favorites:", state.items.length, "items");
    },
    
    addFavorite(state, action) {
      const place = action.payload;
      
      console.log("➕ Adding favorite:", place.name);
      console.log("Current count:", state.items.length);

      // Verificar si ya existe
      const exists = state.items.some((p) => p.id === place.id);
      if (exists) {
        console.log("⚠️ Place already in favorites");
        return;
      }

      // NO permitir más de 5
      if (state.items.length >= 5) {
        console.log("⚠️ Maximum favorites reached (5/5)");
        return;
      }

      state.items = [place, ...state.items];
      
      // Guardar en storage (fire and forget)
      saveToStorage(state.items);
      console.log("✅ Favorite added. New count:", state.items.length);
    },
    
    removeFavorite(state, action) {
      const id = action.payload;
      console.log("➖ Removing favorite with ID:", id);
      console.log("Before removal, count:", state.items.length);
      
      state.items = state.items.filter((p) => p.id !== id);
      
      console.log("After removal, count:", state.items.length);
      saveToStorage(state.items);
      console.log("✅ Favorite removed. New count:", state.items.length);
    },
    
    clearFavorites(state) {
      console.log("🗑️ CLEARING ALL FAVORITES");
      console.log("Before clear, count:", state.items.length);
      
      // IMPORTANTE: Asignar array vacío directamente
      state.items = [];
      
      console.log("After clear, count:", state.items.length);
      console.log("State items is now:", state.items);
      
      // Guardar array vacío en storage
      saveToStorage([]);
      console.log("✅ All favorites cleared and saved to storage");
    },
  },
});

export const { setFavorites, addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;