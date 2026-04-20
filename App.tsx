import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
// usei isso pois o SafeAreaView nativo vai ser deprecated e pesquisei uma alternativa recomendada
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface Pokemon {
  name: string;
  url: string;
}

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
      } catch (err) {
        setError("Falha ao carregar Pokémons. Verifique sua conexão.");
        setLoading(false);
      }
    };
    loadData();
  }, []);

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
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Pokédex</Text>
        </View>

        <View style={styles.content}>
          {}
          {pokemons.length === 0 ? (
            <Text style={styles.emptyText}>A lista está vazia.</Text>
          ) : (
            <Text>Lista carregada com sucesso!</Text>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    padding: 20,
    backgroundColor: "#ff0000",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: "#ff0000",
    textAlign: "center",
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
  },
});
