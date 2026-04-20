# Revue de code pour PlayerInfo

```vue
<script setup lang="ts">
import { type Pokemon } from "../scripts/types";

const props = defineProps<{
  name: string;
  grade: string;
  pDollar: number;
  currentPokemon: Pokemon;
  pokemons: Pokemon[];
}>();
</script>
<template>
  <div class="container mt-4">
    <div class="card shadow">
      <div class="card-body">
        <h3 class="card-title mb-4 text-center">👤 Dresseur {{ name }}</h3>

        <div class="row mb-3 align-items-stretch">
          <div class="col-md-4 d-flex">
            <div class="alert alert-info text-center w-100">
              <strong>Expérience</strong><br />
              {{ grade }}
            </div>
          </div>
          <div class="col-md-4 d-flex">
            <div class="alert alert-warning text-center w-100">
              <strong>P$</strong><br />
              {{ pDollar }}
            </div>
          </div>
          <div class="col-md-4 d-flex">
            <div class="alert alert-success text-center w-100">
              <strong>Pokémon actif</strong><br />
              {{ currentPokemon.name }}<br />
              <div v-if="currentPokemon.hp == 0">
                🖤 (Mort) Points de vie : {{ currentPokemon.hp }} %
              </div>
              <div v-else-if="currentPokemon.hp <= 25">
                💔 Points de vie : {{ currentPokemon.hp }} %
              </div>
              <div v-else-if="currentPokemon.hp > 25">
                ❤️ Points de vie : {{ currentPokemon.hp }} %
              </div>
            </div>
          </div>
        </div>

        <h5 class="mb-3">🎒 Équipe de Pokémon</h5>

        <ul class="list-group">
          <li
            v-for="pokemon in pokemons"
            :key="pokemon.id"
            class="list-group-item d-flex justify-content-between align-items-center"
            :class="{ 'pokemon-dead': pokemon.hp === 0 }"
          >
            {{ pokemon.name }}

            <span
              v-if="pokemon.id === currentPokemon.id"
              class="badge bg-danger"
            >
              ⚔️ Actif
            </span>

            <span class="badge bg-primary"
              >Numéro pokédex: {{ pokemon.id }}</span
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<!-- IA -->
<style scoped>
.pokemon-dead {
  opacity: 0.5;
  background-color: #e0e0e0;
}
</style>
```

- Les conditions sur les HP pourraient être un peu simplifiées :
  - `v-else-if="currentPokemon.hp > 25"` peut juste devenir `v-else`.
