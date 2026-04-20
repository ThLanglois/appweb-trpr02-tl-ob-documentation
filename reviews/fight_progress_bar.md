# Revue de code pour FightProgressBar

```vue
<!-- components/FightProgressBar.vue -->
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  current: number;
  total: number;
}>();

// variable avec AI
const progressPct = computed(() =>
  Math.round((props.current / props.total) * 100),
);
</script>

<template>
  <div class="d-flex align-items-center gap-2">
    <span class="text-muted" style="white-space: nowrap">
      Combat <strong>{{ current }}</strong> / {{ total }}
    </span>
    <div class="progress flex-grow-1" style="height: 18px">
      <div
        class="progress-bar"
        role="progressbar"
        :style="{ width: progressPct + '%' }"
      >
        {{ progressPct }}%
      </div>
    </div>
  </div>
</template>
```

- `progressPct` peut produire un problème si `total === 0`. Pourrais ajouter une protection pour éviter une division par zéro.
- Tu pourrais aussi limiter la valeur entre `0` et `100` pour éviter un affichage bizarre si `current > total`.
