import React from 'react';
import { type PokeAPI } from 'pokeapi-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Muted } from './typography';
import { useStore } from '@nanostores/react';
import { $counterStore } from '@/stores/counterStore';
import { $queryClient } from '@/stores/queryStore';
import { useQuery } from '@tanstack/react-query';
import { getPokemonById } from '@/api/pokemon';
import { cn } from '@/lib/utils';

interface Props {
	pokemon: PokeAPI.Pokemon;
	className?: string;
}

type formattedStat = {
	name: string;
	value: number;
	valueIndexed: number;
};

const mapToRange = (input: number): number => {
	const sourceMin = 1;
	const sourceMax = 255;
	const targetMin = 1;
	const targetMax = 100;

	return (
		targetMin +
		((input - sourceMin) * (targetMax - targetMin)) / (sourceMax - sourceMin)
	);
};

const formatStats = (stats: PokeAPI.PokemonStat[]): Array<formattedStat> => {
	return stats.map((stat) => ({
		name: stat.stat.name.split('-').join(' '),
		value: stat.base_stat,
		valueIndexed: mapToRange(stat.base_stat),
	}));
};

export const PokemonStats: React.FC<Readonly<Props>> = ({
	pokemon,
	className,
}) => {
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
				select: ({ stats }) => ({
					stats,
				}),
			},
			queryClient,
		);
	};

	const pokemonQuery = usePokemon(count);

	if (!pokemonQuery.data) {
		return null;
	}

	const { stats } = pokemonQuery.data;

	const statsFormatted = formatStats(stats);

	return (
		<Card className={cn(className, 'flex flex-col')}>
			<CardHeader>
				<CardTitle>Base stats</CardTitle>
			</CardHeader>
			<CardContent className="flex h-full items-center">
				<div className="w-full">
					<div className="grid grid-cols-[min-content,auto,3ch] gap-4">
						{statsFormatted.map((stat) => (
							<div
								key={`stat-${stat.name}`}
								className="col-start-1 -col-end-1 grid grid-cols-subgrid items-center gap-4"
							>
								<Muted className="text-nowrap">{`${stat.name}`}</Muted>
								<Progress value={stat.valueIndexed} className="h-3" />
								<Muted className="text-right">{String(stat.value)}</Muted>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
