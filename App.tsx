import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TextInput,
  FlatList,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { getPokemons } from "./services/api";
import { PokemonCard } from "./components/PokemonCard";

interface Pokemon {
  name: string;
  url: string;
}

function PokedexApp() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const LIMIT = 30;

  const filteredPokemons = pokemons.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getPokemons(0, LIMIT);
        setPokemons(data);
      } catch (err) {
        setError("Falha ao carregar Pokémons. Verifique sua conexão.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const loadMorePokemons = async () => {
    if (loadingMore || search.length > 0) return;
    try {
      setLoadingMore(true);
      const newOffset = offset + LIMIT;
      const newPokemons = await getPokemons(newOffset, LIMIT);
      setPokemons([...pokemons, ...newPokemons]);
      setOffset(newOffset);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff0000" />
        <Text style={styles.loadingText}>Carregando Pokédex...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Pokédex</Text>
      </View>
      <View style={styles.content}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Pokémon..."
          value={search}
          onChangeText={setSearch}
        />
        <FlatList
          data={filteredPokemons}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item }) => <PokemonCard name={item.name} />}
          onEndReached={loadMorePokemons}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator color="#ff0000" /> : null
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {search ? `Nenhum Pokémon para "${search}"` : "Lista vazia."}
            </Text>
          }
        />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PokedexApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: { padding: 20, backgroundColor: "#ff0000", alignItems: "center" },
  title: { fontSize: 22, color: "#fff", fontWeight: "bold" },
  loadingText: { marginTop: 10, fontSize: 16 },
  errorText: { color: "#ff0000", textAlign: "center", fontSize: 16 },
  content: { flex: 1, padding: 20 },
  emptyText: { textAlign: "center", color: "#666", marginTop: 20 },
  searchInput: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
});
