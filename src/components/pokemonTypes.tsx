import React from 'react';
import { type PokeAPI } from 'pokeapi-types';
import { Button } from './ui/button';
import { useStore } from '@nanostores/react';
import { $counterStore } from '@/stores/counterStore';
import { useQuery } from '@tanstack/react-query';
import { getPokemonById } from '@/api/pokemon';
import { $queryClient } from '@/stores/queryStore';
import { Badge } from './ui/badge';

interface Props {
	pokemon: PokeAPI.Pokemon;
	className?: string;
}

const formatTypes = (types: PokeAPI.PokemonType[]): Array<string> => {
	return types.map((type) => type.type.name);
};

export const PokemonTypes: React.FC<Readonly<Props>> = ({ pokemon }) => {
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
				select: ({ types }) => ({
					types,
				}),
			},
			queryClient,
		);
	};

	const pokemonQuery = usePokemon(count);

	if (!pokemonQuery.data) {
		return null;
	}

	const typesFormatted = formatTypes(pokemonQuery.data.types);

	return (
		<div className="flex gap-1">
			{typesFormatted.map((type) => (
				<Badge>{type}</Badge>
			))}
		</div>
	);
};
