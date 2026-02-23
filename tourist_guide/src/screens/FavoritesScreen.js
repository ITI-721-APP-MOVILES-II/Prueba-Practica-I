import React, { useEffect } from "react";
import { View, Text, Pressable, FlatList, StyleSheet, Alert, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { clearFavorites, removeFavorite } from "../store/slices/favoritesSlice";

// Helper para alertas que funcionen en Web
const showAlert = (title, message, buttons = []) => {
  if (Platform.OS === 'web') {
    if (buttons && buttons.length > 1) {
      const result = window.confirm(`${title}\n\n${message}`);
      if (result && buttons[1]?.onPress) {
        buttons[1].onPress();
      }
    } else {
      window.alert(`${title}\n\n${message}`);
    }
  } else {
    Alert.alert(title, message, buttons);
  }
};

export default function FavoritesScreen({ navigation }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);

  // Log cada vez que cambian los favoritos
  useEffect(() => {
    console.log("🔄 FavoritesScreen re-rendered. Favorites count:", favorites.length);
    console.log("Favorites items:", favorites);
  }, [favorites]);

  const onClearAll = () => {
    console.log("🔴 onClearAll called, favorites count:", favorites.length);
    
    if (favorites.length === 0) {
      showAlert("Sin favoritos", "No hay favoritos para eliminar.");
      return;
    }

    const confirmMessage = `¿Seguro que quieres borrar todos los ${favorites.length} favoritos?`;
    
    if (Platform.OS === 'web') {
      const result = window.confirm(confirmMessage);
      if (result) {
        console.log("✅ User confirmed, dispatching clearFavorites");
        dispatch(clearFavorites());
        
        // Forzar re-render después de 100ms
        setTimeout(() => {
          console.log("⏰ After clearFavorites, current count:", favorites.length);
        }, 100);
      } else {
        console.log("❌ User cancelled");
      }
    } else {
      Alert.alert("Eliminar todos", confirmMessage, [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sí, borrar", 
          style: "destructive", 
          onPress: () => {
            console.log("✅ Dispatching clearFavorites action");
            dispatch(clearFavorites());
          }
        },
      ]);
    }
  };

  const onRemoveOne = (id, name) => {
    console.log("🔴 Removing single favorite:", name, "ID:", id);
    dispatch(removeFavorite(id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Pressable onPress={() => navigation.navigate("Detail", { place: item })} style={{ flex: 1 }}>
        <Text style={styles.title}>{item.name}</Text>
        {!!item.address && <Text style={styles.meta}>{item.address}</Text>}
      </Pressable>

      <Pressable
        style={styles.removeBtn}
        onPress={() => onRemoveOne(item.id, item.name)}
      >
        <Text style={styles.removeText}>Eliminar</Text>
      </Pressable>
    </View>
  );

  console.log("🎨 Rendering FavoritesScreen with", favorites.length, "items");

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.h1}>Mis Favoritos ({favorites.length}/5)</Text>
        <Pressable 
          style={[styles.clearBtn, favorites.length === 0 && styles.clearBtnDisabled]} 
          onPress={onClearAll}
        >
          <Text style={styles.clearText}>Eliminar todos</Text>
        </Pressable>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.helper}>No tienes favoritos guardados.</Text>
          <Pressable style={styles.btn} onPress={() => navigation.navigate("Places")}>
            <Text style={styles.btnText}>Volver a lugares</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
          extraData={favorites.length} // Forzar re-render cuando cambia el length
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerRow: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  h1: { fontSize: 18, fontWeight: "800" },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#b00020",
  },
  clearBtnDisabled: {
    backgroundColor: "#ccc",
  },
  clearText: { color: "#fff", fontWeight: "700" },
  card: {
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: { fontSize: 16, fontWeight: "800" },
  meta: { fontSize: 12, color: "#666", marginTop: 4 },
  removeBtn: {
    backgroundColor: "#111",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  removeText: { color: "#fff", fontWeight: "700" },
  center: { padding: 18, alignItems: "center", gap: 10 },
  helper: { color: "#555" },
  btn: {
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  btnText: { color: "#fff", fontWeight: "700" },
});