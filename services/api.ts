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
