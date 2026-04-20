# Revue de code pour HomePageView

```ts
const isNameValid = ref<boolean>(false);
const showStartButton = ref<boolean>(false);

function handleSubmit(name: string): void {
  isNameValid.value = true;
  showStartButton.value = true;
}
function handleReset(): void {
  isNameValid.value = false;
  showStartButton.value = false;
}

<StartButton
      v-if="showStartButton && isNameValid && selectedTeam.length === 5"
    >
```

Code peu utile, les deux valeurs pourraient probablement être fusionnées en une puisqu'elle ne semble qu'être utilisées ensemble. Un computed pourrait aussi marcher dépendament la logique attendu.

##

```ts
interface Pokemon {
  id: number;
  name: string;
}
```

A déplacer dans le fichier des types ajouté avec feat/tableau_pointage
