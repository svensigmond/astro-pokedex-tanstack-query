import React from 'react';
import { type PokeAPI } from 'pokeapi-types';
import { useStore } from '@nanostores/react';
import { $counterStore } from '@/stores/counterStore';
import { $queryClient } from '@/stores/queryStore';
import { useQuery } from '@tanstack/react-query';
import { getPokemonById } from '@/api/pokemon';
import { H2 } from './typography';
import { capitalizeFirstLetter } from '@/lib/utils';

interface Props {
	pokemon: PokeAPI.Pokemon;
}

const formatId = (num: number): string => {
	return `#${num.toString().padStart(3, '0')}`;
};

export const PokemonHeader: React.FC<Readonly<Props>> = ({ pokemon }) => {
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
				select: ({ id, name }) => ({
					id,
					name,
				}),
			},
			queryClient,
		);
	};

	const pokemonQuery = usePokemon(count);

	if (!pokemonQuery.data) {
		return null;
	}

	const { id, name } = pokemonQuery.data;

	const idFormatted = formatId(id);
	const nameFormatted = capitalizeFirstLetter(name);

	return (
		<H2 className="py-4">
			<div className="flex justify-between gap-4">
				<span>{nameFormatted}</span> <span>{idFormatted}</span>
			</div>
		</H2>
	);
};
