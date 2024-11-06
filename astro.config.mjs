// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import inoxToolsRequestNanostores from '@inox-tools/request-nanostores';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
	integrations: [
		react(),
		tailwind({
			applyBaseStyles: false,
		}),
		inoxToolsRequestNanostores(),
	],

	output: 'server',

	adapter: node({
		mode: 'standalone',
	}),
});
