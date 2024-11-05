import type { PokeAPI } from "pokeapi-types";

const API_URL = "https://pokeapi.co/api/v2";

export const getPokemonById = async (
	idOrName: string | number,
): Promise<PokeAPI.Pokemon> => {
	const url = `${API_URL}/pokemon/${idOrName}`;

	const response = await fetch(url);

	return await response.json();
};
