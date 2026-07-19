import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Base path must match the GitHub Pages project subpath.
export default defineConfig({
  base: '/hermes-town-game/',
  plugins: [svelte()],
});
