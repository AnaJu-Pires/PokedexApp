import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { PokedexScreen } from "./screens/PokedexScreen";
import { PokemonDetailScreen } from "./screens/PokemonDetailScreen";

export type RootStackParamList = {
  Pokedex: undefined;
  PokemonDetail: { pokemonName: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Pokedex"
          screenOptions={{
            headerStyle: { backgroundColor: "#ff0000" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        >
          <Stack.Screen 
            name="Pokedex" 
            component={PokedexScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="PokemonDetail" 
            component={PokemonDetailScreen} 
            options={({ route }) => ({ title: "Detalhes" })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
