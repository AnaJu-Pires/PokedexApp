export const getPokemons = async (limit: number = 30, offset: number = 0) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Erro ao buscar Pokémons:", error);
    throw error;
  }
};

export const getPokemonDetails = async (nameOrId: string | number) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar detalhes do Pokémon ${nameOrId}:`, error);
    throw error;
  }
};

export const getPokemonSpecies = async (nameOrId: string | number) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameOrId}`);
    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar espécie do Pokémon ${nameOrId}:`, error);
    throw error;
  }
};
