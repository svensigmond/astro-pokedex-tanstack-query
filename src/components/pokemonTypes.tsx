import React from 'react';
import { type PokeAPI } from 'pokeapi-types';
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

function getPokemonTypeColor(type: string): string {
	switch (type) {
		case 'bug':
			return 'bg-green-500';
		case 'dark':
			return 'bg-gray-800';
		case 'dragon':
			return 'bg-purple-600';
		case 'electric':
			return 'bg-yellow-400';
		case 'fairy':
			return 'bg-pink-300';
		case 'fighting':
			return 'bg-red-700';
		case 'fire':
			return 'bg-red-500';
		case 'flying':
			return 'bg-blue-300';
		case 'ghost':
			return 'bg-indigo-700';
		case 'grass':
			return 'bg-green-400';
		case 'ground':
			return 'bg-yellow-700';
		case 'ice':
			return 'bg-blue-200';
		case 'normal':
			return 'bg-gray-400';
		case 'poison':
			return 'bg-purple-500';
		case 'psychic':
			return 'bg-pink-500';
		case 'rock':
			return 'bg-yellow-600';
		case 'steel':
			return 'bg-gray-500';
		case 'water':
			return 'bg-blue-500';
		default:
			return '';
	}
}

const formatTypes = (
	types: PokeAPI.PokemonType[],
): Array<{ name: string; color: string }> => {
	return types.map((type) => ({
		name: type.type.name,
		color: getPokemonTypeColor(type.type.name),
	}));
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
					count !== pokemon.id ? previousData : undefined,
				initialData: () => (count === pokemon.id ? pokemon : undefined),
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
				<Badge key={`type-${type.name}`} className={type.color}>
					{type.name}
				</Badge>
			))}
		</div>
	);
};
