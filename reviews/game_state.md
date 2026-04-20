# Revue de code pour script GameState

```ts
import { ref } from "vue";
import { type Pokemon, type Trainer } from "./types";
import { playTurn, fetchRandomEnemy, type TurnResult } from "./combat";
import { PLAYER_POKEMON_HP } from "../scripts/constants";

export function useGameState(parsedTeam: Pokemon[], initialGrade: number) {
  const enemy = ref<Trainer | null>(null);
  const activePokemon = ref<Pokemon>(parsedTeam[0]);
  const pDollar = ref<number>(0);
  const battlesWon = ref<number>(0);
  const enemyMaxHP = ref<number>(0);

  async function loadEnemy() {
    enemy.value = await fetchRandomEnemy();

    if (enemy.value) {
      enemyMaxHP.value = enemy.value.pokemon.hp;
    }
  }

  function attack(): TurnResult | null {
    if (!enemy.value) return null;

    return playTurn(
      initialGrade,
      activePokemon.value.hp,
      PLAYER_POKEMON_HP,
      enemy.value.experience,
      enemy.value.pokemon.hp,
      enemyMaxHP.value,
    );
  }

  function applyPlayerAttack(result: TurnResult) {
    if (!enemy.value) return;

    enemy.value.pokemon.hp = result.enemyHP;

    if (result.enemyKO) {
      pDollar.value += enemy.value.reward;
      battlesWon.value++;
    }
  }

  function applyEnemyAttack(result: TurnResult) {
    activePokemon.value.hp = result.playerHP;
  }

  // AI Fonction
  function switchToNextPokemon() {
    const nextIndex = parsedTeam.findIndex(
      (p) => p.hp > 0 && p.id !== activePokemon.value.id,
    );

    if (nextIndex !== -1) {
      activePokemon.value = parsedTeam[nextIndex];
    }
  }

  function switchPokemonManually(newIndex: number): boolean {
    const selectedPokemon = parsedTeam[newIndex];

    if (!selectedPokemon) {
      return false;
    }

    if (selectedPokemon.id === activePokemon.value.id) {
      return false;
    }

    if (selectedPokemon.hp <= 0) {
      return false;
    }

    activePokemon.value = selectedPokemon;
    return true;
  }

  return {
    enemy,
    activePokemon,
    pDollar,
    battlesWon,
    loadEnemy,
    attack,
    applyPlayerAttack,
    applyEnemyAttack,
    switchToNextPokemon,
    switchPokemonManually,
  };
}
```

- `initialGrade` est passé au composable, mais si le grade du joueur change un jour pendant la partie, cette valeur hardcodée pourrait devenir limitante.
