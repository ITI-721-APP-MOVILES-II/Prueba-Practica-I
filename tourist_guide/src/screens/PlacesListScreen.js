import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlaces, setQuery } from "../store/slices/placesSlice";
import { loadFavoritesFromStorage } from "../store/slices/favoritesSlice";

// Normaliza campos comunes entre "sources" (GooglePlaces, etc.)
function normalizePlace(raw, index = 0) {
  const id =
    raw?.id ??
    raw?.place_id ??
    raw?._id ??
    raw?.uri ??
    `${raw?.name ?? "place"}-${index}`;

  const name = raw?.name ?? raw?.title ?? "Sin nombre";
  const description = raw?.description ?? raw?.summary ?? raw?.snippet ?? "";
  const address = raw?.address ?? raw?.formatted_address ?? raw?.vicinity ?? "";

  return {
    id,
    name,
    description,
    address,
    // guarda el objeto completo por si en detalle hay otros campos
    raw,
  };
}

export default function PlacesListScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items, loading, error, query } = useSelector((s) => s.places);

  // Carga favoritos una vez al entrar a la app
  useEffect(() => {
    dispatch(loadFavoritesFromStorage());
  }, [dispatch]);

  const [location, setLocation] = useState(query.location ?? "Barcelona");
  const [category, setCategory] = useState(query.category ?? "attraction");
  const [source, setSource] = useState(query.source ?? "GooglePlaces");
  const [keyword, setKeyword] = useState(query.keyword ?? "");

  const normalized = useMemo(() => {
    return (items ?? []).map((p, idx) => normalizePlace(p, idx));
  }, [items]);

  const onSearch = () => {
    const nextQuery = {
      location: location.trim() || "Barcelona",
      category: category.trim() || "attraction",
      source: source.trim() || "GooglePlaces",
      keyword: keyword.trim(),
    };
    dispatch(setQuery(nextQuery));
    dispatch(fetchPlaces(nextQuery));
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.card}
      onPress={() => navigation.navigate("Detail", { place: item })}
    >
      <Text style={styles.title}>{item.name}</Text>
      {!!item.description && (
        <Text style={styles.desc} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      {!!item.address && <Text style={styles.meta}>{item.address}</Text>}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Buscador/Filtros */}
      <View style={styles.searchBox}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Barcelona"
          style={styles.input}
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          value={category}
          onChangeText={setCategory}
          placeholder="attraction | restaurant | ..."
          style={styles.input}
        />

        <Text style={styles.label}>Source</Text>
        <TextInput
          value={source}
          onChangeText={setSource}
          placeholder="GooglePlaces"
          style={styles.input}
        />

        <Text style={styles.label}>Keyword</Text>
        <TextInput
          value={keyword}
          onChangeText={setKeyword}
          placeholder="rabbit beer"
          style={styles.input}
        />

        <View style={styles.row}>
          <Pressable style={styles.btn} onPress={onSearch}>
            <Text style={styles.btnText}>Buscar</Text>
          </Pressable>

          <Pressable
            style={[styles.btn, styles.btnSecondary]}
            onPress={() => navigation.navigate("Favorites")}
          >
            <Text style={styles.btnText}>Favoritos</Text>
          </Pressable>
        </View>
      </View>

      {/* Estados */}
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.helper}>Cargando lugares…</Text>
        </View>
      )}

      {!!error && !loading && (
        <View style={styles.center}>
          <Text style={styles.error}>Error: {error}</Text>
          <Pressable style={styles.btn} onPress={onSearch}>
            <Text style={styles.btnText}>Reintentar</Text>
          </Pressable>
        </View>
      )}

      {!loading && !error && normalized.length === 0 && (
        <View style={styles.center}>
          <Text style={styles.helper}>No hay resultados. Prueba otra búsqueda.</Text>
        </View>
      )}

      {/* Lista */}
      {!loading && !error && (
        <FlatList
          data={normalized}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  searchBox: { padding: 12, borderBottomWidth: 1, borderColor: "#eee" },
  label: { fontSize: 12, color: "#555", marginTop: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 4,
  },
  row: { flexDirection: "row", gap: 10, marginTop: 10 },
  btn: {
    flex: 1,
    backgroundColor: "#111",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnSecondary: { backgroundColor: "#444" },
  btnText: { color: "#fff", fontWeight: "600" },
  card: {
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  desc: { fontSize: 13, color: "#444" },
  meta: { fontSize: 12, color: "#666", marginTop: 6 },
  center: { padding: 16, alignItems: "center", gap: 10 },
  helper: { color: "#555" },
  error: { color: "#b00020", textAlign: "center" },
});
