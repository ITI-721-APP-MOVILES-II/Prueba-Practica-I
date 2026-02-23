import React, { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { WebView } from "react-native-webview";

function normalizeUrl(url) {
  if (!url) return "";
  const u = String(url).trim();
  if (!u) return "";
  if (!/^https?:\/\//i.test(u)) return `https://${u}`;
  return u;
}

export default function WebScreen({ route, navigation }) {
  const { url, title } = route.params ?? {};
  const safeUrl = useMemo(() => normalizeUrl(url), [url]);

  const [loadError, setLoadError] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topTitle} numberOfLines={1}>
          {title ?? "Sitio web"}
        </Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Text style={styles.closeText}>Cerrar</Text>
        </Pressable>
      </View>

      {!safeUrl ? (
        <View style={styles.center}>
          <Text>No hay URL disponible.</Text>
        </View>
      ) : loadError ? (
        <View style={styles.center}>
          <Text style={{ marginBottom: 10, textAlign: "center" }}>
            No se pudo cargar el sitio web.
          </Text>
          <Pressable
            style={styles.retryBtn}
            onPress={() => {
              setLoadError(false);
            }}
          >
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <WebView
          source={{ uri: safeUrl }}
          onError={() => {
            setLoadError(true);
            Alert.alert("Error", "No se pudo abrir el sitio web.");
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topBar: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  topTitle: { flex: 1, fontWeight: "800" },
  closeBtn: {
    backgroundColor: "#111",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  closeText: { color: "#fff", fontWeight: "700" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  retryBtn: { backgroundColor: "#111", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: "#fff", fontWeight: "700" },
});
