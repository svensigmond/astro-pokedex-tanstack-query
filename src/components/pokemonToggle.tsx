import React from 'react';
import { type PokeAPI } from 'pokeapi-types';
import { Button } from './ui/button';
import { useStore } from '@nanostores/react';
import { $counterStore } from '@/stores/counterStore';
import { useQuery } from '@tanstack/react-query';
import { getPokemonById } from '@/api/pokemon';
import { $queryClient } from '@/stores/queryStore';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface Props {
	pokemon: PokeAPI.Pokemon;
	className?: string;
}

export const PokemonToggle: React.FC<Readonly<Props>> = ({ pokemon }) => {
	const count = useStore($counterStore);

	const add = () => $counterStore.set(count + 1);
	const subtract = () => $counterStore.set(count > 1 ? count - 1 : 1);

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
				select: () => ({}),
			},
			queryClient,
		);
	};

	const pokemonQuery = usePokemon(count);

	if (!pokemonQuery.data) {
		return null;
	}

	return (
		<div className="flex justify-center gap-4">
			<Button disabled={count <= 1} onClick={subtract}>
				Previous
			</Button>
			<Button onClick={add}>Next</Button>

			<ReactQueryDevtools client={queryClient} />
		</div>
	);
};
