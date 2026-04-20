import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { getPokemonDetails, getPokemonSpecies } from "../services/api";
import { capitalize } from "../utils/format";

export function PokemonDetailScreen() {
  const route = useRoute<any>();
  const { pokemonName } = route.params;

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<any>(null);
  const [species, setSpecies] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setLoading(true);
        const [detailsData, speciesData] = await Promise.all([
          getPokemonDetails(pokemonName),
          getPokemonSpecies(pokemonName),
        ]);
        setDetails(detailsData);
        setSpecies(speciesData);
      } catch (err) {
        setError("Não foi possível carregar os detalhes deste Pokémon.");
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [pokemonName]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff0000" />
      </View>
    );
  }

  if (error || !details) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error || "Detalhes não encontrados."}
        </Text>
      </View>
    );
  }

  // Get description in English or Spanish/whatever if preferred, but usually first english
  const flavorTextEntry = species?.flavor_text_entries?.find(
    (entry: any) => entry.language.name === "en" || entry.language.name === "pt"
  );
  
  const description = flavorTextEntry
    ? flavorTextEntry.flavor_text.replace(/\n|\f/g, " ")
    : "Descrição não disponível.";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              details.sprites?.other?.["official-artwork"]?.front_default ||
              details.sprites?.front_default,
          }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.name}>{capitalize(details.name)}</Text>
      <Text style={styles.idNumber}>Nº {details.id.toString().padStart(3, '0')}</Text>

      <View style={styles.typesContainer}>
        {details.types.map((typeInfo: any) => (
          <View key={typeInfo.type.name} style={styles.typeBadge}>
            <Text style={styles.typeText}>{capitalize(typeInfo.type.name)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Altura:</Text>
          <Text style={styles.statValue}>{details.height / 10} m</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Peso:</Text>
          <Text style={styles.statValue}>{details.weight / 10} kg</Text>
        </View>
      </View>

      <View style={styles.aboutContainer}>
        <Text style={styles.aboutTitle}>Sobre</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { padding: 20, alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#ff0000", fontSize: 16 },
  imageContainer: {
    width: 250,
    height: 250,
    backgroundColor: "#fff",
    borderRadius: 125,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  image: { width: 200, height: 200 },
  name: { fontSize: 32, fontWeight: "bold", color: "#333", marginBottom: 5 },
  idNumber: { fontSize: 18, color: "#888", marginBottom: 15, fontWeight: "600" },
  typesContainer: { flexDirection: "row", marginBottom: 25 },
  typeBadge: {
    backgroundColor: "#ff0000",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  typeText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  statsCard: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 15,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  statRow: { alignItems: "center", width: "45%" },
  statLabel: { fontSize: 14, color: "#888", marginBottom: 5 },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#333" },
  divider: { width: 1, backgroundColor: "#eee", height: "100%" },
  aboutContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  aboutTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 10 },
  description: { fontSize: 16, color: "#555", lineHeight: 24 },
});
