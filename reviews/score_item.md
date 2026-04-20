# Revue de code pour ScoreItem

```vue
<script setup lang="ts">
import { type Ranking } from "../scripts/types";

const props = defineProps<{
  rank: Ranking;
}>();
</script>

<!-- IA : Style Bootstrap -->

<template>
  <li class="list-group-item d-flex justify-content-between align-items-center">
    <div class="d-flex align-items-center gap-3">
      <span class="fw-semibold">
        {{ rank.name }}
      </span>
    </div>

    <span class="badge bg-success fs-6"> {{ rank.score }} P$ </span>
  </li>
</template>

<style scope></style>
```

La balise style n'est pas nécessaire.

##

```
//IA : Usage de l'API

const loading = ref(true);

const error = ref<string | null>(null);

onMounted(async () => {

try {

const response = await fetch("http://127.0.0.1:3000/ranking");

if (!response.ok) {

throw new Error("Failed to fetch ranking");

}

rankings.value = await response.json();

} catch (err: any) {

error.value = err.message;

} finally {

loading.value = false;

}

});

</script>
```

Très bonne utilisation de l'IA pour l'API.
