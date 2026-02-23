import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "./src/store";
import { loadFavoritesFromStorage } from "./src/store/slices/favoritesSlice";
import AppNavigator from "./src/navigation/AppNavigator";

// Componente interno que carga los favoritos
function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("🚀 App started - Loading favorites from storage...");
    dispatch(loadFavoritesFromStorage());
  }, [dispatch]);

  return <AppNavigator />;
}

// Componente principal con Provider
export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}