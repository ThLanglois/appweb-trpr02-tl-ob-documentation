# Revue de code pour EnemyInfo

```vue
<script setup lang="ts">
import { type Trainer, Grade } from "../scripts/types";
import { ref, computed, watch } from "vue";

const props = defineProps<{
  trainer: Trainer;
}>();

const maxHp = ref<number>(props.trainer.pokemon.hp);

// AI watch
watch(
  () => props.trainer.id,
  () => {
    maxHp.value = props.trainer.pokemon.hp;
  },
);

const hpPercentage = computed(() => {
  if (maxHp.value === 0) return 0;
  return Math.floor((props.trainer.pokemon.hp / maxHp.value) * 100);
});
</script>

<template>
  <div class="container mt-4">
    <div class="card shadow">
      <div class="card-body">
        <h3 class="card-title mb-4 text-center">
          👤 Dresseur ennemi {{ trainer.name }}
        </h3>

        <div class="row mb-3 align-items-stretch">
          <div class="col-md-4 d-flex">
            <div class="alert alert-info text-center w-100">
              <strong>Expérience</strong><br />
              {{ Grade[trainer.experience] }}
            </div>
          </div>

          <div class="col-md-4 d-flex">
            <div class="alert alert-warning text-center w-100">
              <strong>Récompense P$</strong><br />
              {{ trainer.reward }}
            </div>
          </div>

          <div class="col-md-4 d-flex">
            <div class="alert alert-success text-center w-100">
              <strong>Pokémon ennemi</strong><br />
              {{ trainer.pokemon.name }}<br />
              ❤️ Points de vie : {{ hpPercentage }} % <br />
              <span class="badge bg-primary">
                Numéro pokédex: {{ trainer.pokemon.id }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
```

- Le `watch` sur `props.trainer.id` fonctionne, mais il serait mieux de surveiller directement `props.trainer` ou `props.trainer.pokemon` si jamais l’ID ne change pas alors que le Pokémon change
- `hpPercentage` retourne un pourcentage, donc l’affichage est bon, mais ce serait bien de renommer certaines variables pour plus de clarté, par exemple `maxInitialHp`
- Le template est correct, mais éviter de répéter du Bootstrap “alert” partout avec de petits composants réutilisables
