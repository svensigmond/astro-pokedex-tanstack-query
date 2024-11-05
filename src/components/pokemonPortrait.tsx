import React from 'react';
import { type PokeAPI } from 'pokeapi-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@nanostores/react';
import { $counterStore } from '@/stores/counterStore';
import { $queryClient } from '@/stores/queryStore';
import { useQuery } from '@tanstack/react-query';
import { getPokemonById } from '@/api/pokemon';
import { capitalizeFirstLetter } from '@/lib/utils';

interface Props {
	pokemon: PokeAPI.Pokemon;
}

export const PokemonPortrait: React.FC<Readonly<Props>> = ({ pokemon }) => {
	const count = useStore($counterStore);
	const queryClient = useStore($queryClient);

	const usePokemon = (count: number) => {
		return useQuery(
			{
				queryKey: ['pokemon', count],
				queryFn: () => getPokemonById(count),
				placeholderData: (previousData) =>
					count !== 1 ? previousData : undefined,
				initialData: () => (count === 1 ? pokemon : undefined),
				staleTime: 1000 * 60, // 1 minute
				select: ({ name, sprites }) => ({
					name,
					sprites,
				}),
			},
			queryClient,
		);
	};

	const pokemonQuery = usePokemon(count);

	if (!pokemonQuery.data) {
		return null;
	}

	const { name, sprites } = pokemonQuery.data;

	const nameFormatted = capitalizeFirstLetter(name);
	const artwork =
		sprites.other?.['official-artwork']?.front_default ?? sprites.front_default;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Picture</CardTitle>
			</CardHeader>
			<CardContent className="md:flex md:items-center md:justify-between md:gap-4">
				<img
					src={artwork}
					alt={nameFormatted}
					className="block aspect-square w-full max-w-sm"
				/>
			</CardContent>
		</Card>
	);
};
