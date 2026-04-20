# Revue de code pour TrainerForm

```ts
const trainerName = ref("");
const isSubmitted = ref(false);
```

Pourraient êtres typés pour plus de clarté et sécuriter comme ref\<string>("")

##

```ts
const isValid = ref<boolean>(false);

function submitForm(): void {
  isSubmitted.value = true;
  if (trainerName.value.trim() === "") {
    return;
  }
  emit("submit", trainerName.value);
  isValid.value = true;
}
```

Code potentiellement compliqué pour rien, remplacer le isValid par un compute qui vérifie directement si le trainerName n'est pas vide pourrait être plus simple dépendament la logique attendu. A vérifier.
