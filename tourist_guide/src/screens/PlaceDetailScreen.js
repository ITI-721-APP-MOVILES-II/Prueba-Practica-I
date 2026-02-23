import React, { useMemo } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Platform, Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../store/slices/favoritesSlice";

// Helper para alertas que funcionen en Web
const showAlert = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  }
};

function pickField(raw, keys, fallback = "") {
  for (const k of keys) {
    const v = raw?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return fallback;
}

function normalizeUrl(url) {
  if (!url) return "";
  const u = String(url).trim();
  if (!u) return "";

  // Si viene sin protocolo, agrega https://
  if (!/^https?:\/\//i.test(u)) return `https://${u}`;
  return u;
}

export default function PlaceDetailScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const favorites = useSelector((s) => s.favorites.items);

  const place = route?.params?.place;
  const raw = place?.raw ?? place ?? {};

  const data = useMemo(() => {
    const name = place?.name ?? pickField(raw, ["name", "title"], "Sin nombre");
    const description =
      place?.description ?? pickField(raw, ["description", "summary", "snippet"], "");
    const address =
      place?.address ?? pickField(raw, ["address", "formatted_address", "vicinity"], "");

    const opening =
      pickField(raw, ["opening_hours", "openingHours", "hours"], null) ||
      raw?.opening_hours?.weekday_text ||
      raw?.openingHours?.weekday_text ||
      raw?.hours?.weekday_text ||
      "";

    // Intentar obtener website de múltiples campos posibles
    const website = pickField(raw, [
      "website", 
      "url", 
      "site", 
      "link", 
      "homepage", 
      "web",
      "websiteUrl",
      "webUrl"
    ], "");

    // Si no hay website, usar el campo "details" de la API
    const detailsUrl = raw?.details || "";

    const phone = pickField(raw, ["phone", "formatted_phone_number", "telephone", "tel"], "");
    const email = pickField(raw, ["email", "mail"], "");
    const rating = pickField(raw, ["rating", "score"], "");
    const lat =
      raw?.lat ?? raw?.latitude ?? raw?.location?.lat ?? raw?.geometry?.location?.lat ?? "";
    const lon =
      raw?.lon ??
      raw?.lng ??
      raw?.longitude ??
      raw?.location?.lon ??
      raw?.geometry?.location?.lng ??
      "";

    return { name, description, address, opening, website, detailsUrl, phone, email, rating, lat, lon };
  }, [place, raw]);

  const isFav = favorites.some((f) => f.id === place?.id);

  const onOpenWeb = () => {
    console.log("🌐 onOpenWeb clicked!");
    console.log("🌐 Website:", data.website);
    console.log("🌐 Details URL:", data.detailsUrl);
    
    // Prioridad 1: Sitio web oficial
    let url = normalizeUrl(data.website);
    
    // Prioridad 2: URL de detalles de la API
    if (!url && data.detailsUrl) {
      url = normalizeUrl(data.detailsUrl);
      console.log("🌐 Using details URL:", url);
    }

    // Prioridad 3: Buscar en Google
    if (!url) {
      console.log("❌ No URL available, using Google search");
      const searchQuery = encodeURIComponent(`${data.name} ${data.address}`);
      const googleUrl = `https://www.google.com/search?q=${searchQuery}`;
      
      if (Platform.OS === 'web') {
        const wantSearch = window.confirm(
          `No hay sitio web disponible para "${data.name}".\n\n¿Quieres buscar en Google?`
        );
        if (wantSearch) {
          navigation.navigate("Web", { url: googleUrl, title: `Buscar: ${data.name}` });
        }
      }
      return;
    }

    console.log("✅ Opening URL:", url);
    navigation.navigate("Web", { url, title: data.name });
  };

  const onToggleFavorite = () => {
    console.log("⭐ onToggleFavorite called");
    console.log("Place ID:", place?.id);
    console.log("Current favorites count:", favorites.length);
    console.log("Is favorite:", isFav);
    
    if (!place?.id) {
      showAlert("Error", "No se puede agregar este lugar (ID no válido).");
      return;
    }

    if (isFav) {
      console.log("➖ Removing from favorites");
      dispatch(removeFavorite(place.id));
      showAlert("✅ Eliminado", "El lugar ha sido eliminado de favoritos.");
      return;
    }

    // Verificar límite de 5 ANTES de despachar
    if (favorites.length >= 5) {
      console.log("⚠️ LIMIT REACHED - Cannot add more favorites");
      showAlert(
        "⚠️ Límite de favoritos alcanzado",
        `Ya tienes ${favorites.length} lugares guardados. Solo puedes guardar hasta 5 sitios.\n\nElimina uno para agregar otro.`
      );
      return;
    }

    console.log("➕ Adding to favorites");
    dispatch(addFavorite(place));
    showAlert("✅ ¡Agregado!", `"${data.name}" ha sido guardado en favoritos.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 14, paddingBottom: 28 }}>
      <Text style={styles.h1}>{data.name}</Text>

      {!!data.address && (
        <View style={styles.block}>
          <Text style={styles.label}>Dirección</Text>
          <Text style={styles.text}>{data.address}</Text>
        </View>
      )}

      <View style={styles.block}>
        <Text style={styles.label}>Descripción</Text>
        <Text style={styles.text}>{data.description || "No disponible."}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Horarios</Text>
        {Array.isArray(data.opening) ? (
          data.opening.map((line, idx) => (
            <Text key={idx} style={styles.text}>
              • {line}
            </Text>
          ))
        ) : (
          <Text style={styles.text}>{data.opening ? String(data.opening) : "No disponible."}</Text>
        )}
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Contacto</Text>
        <Text style={styles.text}>Teléfono: {data.phone || "No disponible."}</Text>
        <Text style={styles.text}>Correo: {data.email || "No disponible."}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Extras</Text>
        <Text style={styles.text}>Rating: {data.rating || "No disponible."}</Text>
        <Text style={styles.text}>
          Coordenadas: {data.lat && data.lon ? `${data.lat}, ${data.lon}` : "No disponible."}
        </Text>
      </View>

      <View style={styles.row}>
        <Pressable style={styles.btn} onPress={onOpenWeb}>
          <Text style={styles.btnText}>🌐 Ver sitio web</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, isFav ? styles.btnDanger : styles.btnAlt]}
          onPress={onToggleFavorite}
        >
          <Text style={styles.btnText}>{isFav ? "❤️ Quitar favorito" : "⭐ Guardar favorito"}</Text>
        </Pressable>
      </View>

      <Pressable style={[styles.btn, { marginTop: 10 }]} onPress={() => navigation.navigate("Favorites")}>
        <Text style={styles.btnText}>📋 Ir a favoritos</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  h1: { fontSize: 22, fontWeight: "800", marginBottom: 10 },
  block: {
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    padding: 12,
    marginTop: 10,
  },
  label: { fontSize: 12, color: "#555", marginBottom: 6, fontWeight: "600" },
  text: { fontSize: 14, color: "#222", lineHeight: 20 },
  row: { flexDirection: "row", gap: 10, marginTop: 12 },
  btn: {
    flex: 1,
    backgroundColor: "#111",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnAlt: { backgroundColor: "#2b2b2b" },
  btnDanger: { backgroundColor: "#b00020" },
  btnText: { color: "#fff", fontWeight: "700" },
});