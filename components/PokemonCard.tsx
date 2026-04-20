import React from "react";
import { StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { capitalize } from "../utils/format";

interface PokemonCardProps {
  name: string;
}

export const PokemonCard = ({ name }: PokemonCardProps) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        Alert.alert("Pokémon", `Você selecionou o ${capitalize(name)}!`)
      }
    >
      <Text style={styles.name}>{capitalize(name)}</Text>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  arrow: {
    fontSize: 24,
    color: "#ff0000",
    fontWeight: "bold",
  },
});
