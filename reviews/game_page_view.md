# Revue de code pour GamePageView

```vue
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { type Pokemon, Grade } from "../scripts/types";
import FightProgressBar from "../components/FightProgressBar.vue";
import PlayerInfo from "../components/PlayerInfo.vue";
import { useGameState } from "../scripts/gameState";
import { PLAYER_POKEMON_HP, AMOUNT_COMBAT_FOR_WIN } from "../scripts/constants";
import EnemyInfo from "@/components/EnemyInfo.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const hasSwitchedThisTurn = ref<boolean>(false);
const isSwitchMenuOpen = ref<boolean>(false);
const isEnemyMenuOpen = ref<boolean>(false);
const combatMessage = ref<string>("");
const isPlayerAttacking = ref<boolean>(false);
const isEnemyAttacking = ref<boolean>(false);
const name = history.state.name as string;
const hasHealedThisTurn = ref<boolean>(false);
const parsedTeam: Pokemon[] = JSON.parse(history.state.team).map(
  (p: Pokemon) => ({
    ...p,
    hp: PLAYER_POKEMON_HP,
  }),
);

const healCost = computed(() => {
  const missingHP = PLAYER_POKEMON_HP - activePokemon.value.hp;
  return missingHP > 0 ? missingHP * 5 : 0;
});
const deadPokemonCounter = ref<number>(0);

// Fonction AI pour le temps
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const startingGrade = ref<number>(4);
const isPlayerInfoShown = ref<boolean>(false);

function switchPlayerInfoState(): void {
  isPlayerInfoShown.value = !isPlayerInfoShown.value;
}

function switchEnemyMenuInfoState(): void {
  isEnemyMenuOpen.value = !isEnemyMenuOpen.value;
}

function toggleSwitchMenu(): void {
  isSwitchMenuOpen.value = !isSwitchMenuOpen.value;
}

const {
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
} = useGameState(parsedTeam, startingGrade.value);

onMounted(async () => {
  deadPokemonCounter.value = 0;
  await loadEnemy();
});

// AI ici SEULEMENT pour la gestion du temps
async function handleAttack(): Promise<void> {
  if (!enemy.value || isPlayerAttacking.value) return;

  isEnemyAttacking.value = false;
  isPlayerAttacking.value = true;

  const enemyPokemonName = enemy.value.pokemon.name;
  const currentPokemonName = activePokemon.value.name;
  const result = attack();

  if (!result) {
    isPlayerAttacking.value = false;
    return;
  }

  if (result.playerHit) {
    combatMessage.value = `⚔️ Votre Pokémon ${currentPokemonName} attaque avec une puissance de ${result.playerDamage}.`;
  } else {
    combatMessage.value = `❌ Votre Pokémon ${currentPokemonName} rate son attaque.`;
  }

  await wait(2000);

  // Appliquer les dégâts à l'ennemi seulement maintenant
  applyPlayerAttack(result);

  if (result.enemyKO) {
    combatMessage.value = `💀 Le Pokémon ennemi est KO. Vous gagnez ${enemy.value.reward} P$.`;
    await wait(2000);

    if (battlesWon.value === AMOUNT_COMBAT_FOR_WIN) {
      combatMessage.value = `🎉 Vous avez gagné!!! 🎉`;
      await wait(5000);
      await toRankPage();
    }

    combatMessage.value = "";
    await loadEnemy();
    isPlayerAttacking.value = false;
    isEnemyAttacking.value = false;
    hasHealedThisTurn.value = false;
    hasSwitchedThisTurn.value = false;
    return;
  }

  isEnemyAttacking.value = true;

  if (result.enemyHit) {
    combatMessage.value = `⚔️ ${enemyPokemonName} attaque avec une puissance de ${result.enemyDamage}.`;
  } else {
    combatMessage.value = `❌ ${enemyPokemonName} rate son attaque.`;
  }

  await wait(2000);

  // Appliquer les dégâts au joueur seulement maintenant
  applyEnemyAttack(result);

  if (result.playerKO) {
    combatMessage.value = `💀 Votre Pokémon ${currentPokemonName} est KO.`;
    deadPokemonCounter.value++;

    await wait(2000);

    if (deadPokemonCounter.value === parsedTeam.length) {
      combatMessage.value = `Partie terminée.`;
      await wait(2000);
      backToHomePage();
    }

    switchToNextPokemon();

    combatMessage.value = `🔁 Nouveau Pokémon : ${activePokemon.value.name}`;
    await wait(2000);
    combatMessage.value = "";
  } else {
    combatMessage.value = "";
  }

  isEnemyAttacking.value = false;
  isPlayerAttacking.value = false;
  hasSwitchedThisTurn.value = false;
}

async function handleEndCombat(): Promise<void> {
  if (isPlayerAttacking.value) return;

  isPlayerAttacking.value = true;

  combatMessage.value = "⏭️ Combat terminé. Nouvel ennemi...";
  await wait(1500);

  battlesWon.value++;

  if (battlesWon.value === AMOUNT_COMBAT_FOR_WIN) {
    combatMessage.value = `🎉 Vous avez gagné!!! 🎉`;
    await wait(5000);
    await toRankPage();
    return;
  }

  await loadEnemy();

  combatMessage.value = "";
  hasHealedThisTurn.value = false;
  hasSwitchedThisTurn.value = false;
  isPlayerAttacking.value = false;
  isEnemyAttacking.value = false;
}

async function handleHealPokemon(): Promise<void> {
  if (isPlayerAttacking.value || hasHealedThisTurn.value) return;

  isPlayerAttacking.value = true;

  const currentHP = activePokemon.value.hp;
  const maxHP = PLAYER_POKEMON_HP;
  const missingHP = maxHP - currentHP;

  if (missingHP <= 0) {
    combatMessage.value = "❤️ Votre Pokémon est déjà à son maximum.";
    await wait(3000);
    combatMessage.value = "";
    isPlayerAttacking.value = false;
    return;
  }

  const cost = missingHP * 5;

  if (pDollar.value < cost) {
    combatMessage.value = `❌ Vous n'avez pas assez de P$. Il faut ${cost} P$.`;
    await wait(3000);
    combatMessage.value = "";
    isPlayerAttacking.value = false;
    return;
  }

  pDollar.value -= cost;
  activePokemon.value.hp = maxHP;
  hasHealedThisTurn.value = true;
  isSwitchMenuOpen.value = false;

  combatMessage.value = `❤️ ${activePokemon.value.name} est soigné pour ${missingHP}% (coût : ${cost} P$).`;
  await wait(4000);
  combatMessage.value = "";

  isPlayerAttacking.value = false;
}

async function handleManualSwitch(index: number): Promise<void> {
  if (hasSwitchedThisTurn.value || isPlayerAttacking.value) return;

  isPlayerAttacking.value = true;

  const hasSwitched = switchPokemonManually(index);

  if (hasSwitched) {
    hasSwitchedThisTurn.value = true;
    combatMessage.value = `🔁 Vous envoyez ${activePokemon.value.name} au combat.`;
    isEnemyAttacking.value = false;

    isSwitchMenuOpen.value = false;
    await wait(2000);
    combatMessage.value = "";
  }

  isPlayerAttacking.value = false;
}

function backToHomePage(): void {
  router.push("/");
}

async function toRankPage(): Promise<void> {
  // AI pour enregistrer le score dans la BD et le sauvegarder
  const response = await fetch("http://127.0.0.1:3000/ranking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      score: pDollar.value,
    }),
  });

  router.push("/score");
}
</script>

<template>
  <div class="container mt-4" style="padding-bottom: 200px">
    <FightProgressBar :current="battlesWon" :total="parsedTeam.length" />

    <div class="d-flex justify-content-center mt-3 mb-4">
      <button class="btn btn-primary px-4 py-2" @click="switchPlayerInfoState">
        Tes statistiques 📝
      </button>
    </div>

    <div v-if="isPlayerInfoShown" class="mb-4">
      <PlayerInfo
        :name="name"
        :grade="Grade[startingGrade]"
        :pDollar="pDollar"
        :currentPokemon="activePokemon"
        :pokemons="parsedTeam"
      />
    </div>

    <div class="d-flex justify-content-center mt-3 mb-4">
      <button
        class="btn btn-primary px-4 py-2"
        @click="switchEnemyMenuInfoState"
      >
        Statistiques du dresseur ennemi 📝☠️
      </button>
    </div>

    <div v-if="isEnemyMenuOpen && enemy" class="mb-4">
      <EnemyInfo :trainer="enemy" />
    </div>

    <div v-if="enemy" class="row g-4">
      <div class="col-md-6">
        <div class="card shadow h-100 border-success">
          <div class="card-body">
            <h3 class="card-title text-success">Toi 👤</h3>
            <p><strong>Dresseur :</strong> {{ name }}</p>
            <p><strong>Pokémon :</strong> {{ activePokemon.name }}</p>
            <p><strong>❤️ HP :</strong> {{ activePokemon.hp }}</p>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card shadow h-100 border-danger">
          <div class="card-body">
            <h3 class="card-title text-danger">Ennemi ☠️</h3>
            <p><strong>Dresseur :</strong> {{ enemy.name }}</p>
            <p><strong>Pokémon :</strong> {{ enemy.pokemon.name }}</p>
            <p><strong>❤️ HP :</strong> {{ enemy.pokemon.hp }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center mt-4">
      <div class="spinner-border" role="status"></div>
      <p class="mt-2">Chargement de l'ennemi...</p>
    </div>

    <div class="mt-3 card shadow h-100 border-warning">
      <div class="card-body">
        <h3 class="card-title text-warning">Actions 💪</h3>
        <div class="d-flex justify-content-center gap-3 mt-4">
          <button
            class="btn btn-danger px-4"
            @click="handleAttack"
            :disabled="!enemy || activePokemon.hp <= 0 || isPlayerAttacking"
          >
            Attaquer 🗡️
          </button>
          <button
            class="btn btn-warning px-4 text-white"
            @click="toggleSwitchMenu"
            :disabled="isPlayerAttacking || hasSwitchedThisTurn"
          >
            Changer de Pokémon <br />(Une fois par tour) 🔄
          </button>

          <button
            class="btn btn-success px-4"
            @click="handleHealPokemon"
            :disabled="
              !enemy ||
              isPlayerAttacking ||
              hasHealedThisTurn ||
              activePokemon.hp >= PLAYER_POKEMON_HP
            "
          >
            Soigner le Pokémon actif (Une fois par combat) <br />Coût :
            {{ healCost }} P$ 💔
          </button>
        </div>

        <button
          class="btn btn-secondary px-4 justify-content-center mt-3"
          @click="handleEndCombat"
          :disabled="!enemy || isPlayerAttacking"
        >
          Terminer le combat en cours ➡️
        </button>
      </div>
    </div>

    <div v-if="isSwitchMenuOpen" class="mt-4">
      <div class="card shadow h-100 border-warning">
        <div class="card-body">
          <h5>Choisissez un Pokémon 🍃</h5>

          <div class="d-flex flex-wrap gap-2 justify-content-center">
            <button
              v-for="(pokemon, index) in parsedTeam"
              :key="pokemon.id"
              class="btn btn-outline-primary"
              @click="handleManualSwitch(index)"
              :disabled="
                hasSwitchedThisTurn ||
                isPlayerAttacking ||
                pokemon.hp <= 0 ||
                pokemon.id === activePokemon.id
              "
            >
              {{ pokemon.name }} ({{ pokemon.hp }} HP)
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="combatMessage && !isEnemyAttacking"
      class="alert bg-success mt-4 text-center text-white"
    >
      {{ combatMessage }}
    </div>
    <div
      v-else-if="combatMessage && isEnemyAttacking"
      class="alert bg-danger mt-4 text-center text-white"
    >
      {{ combatMessage }}
    </div>
  </div>
</template>
```

- Il y a beaucoup de logique dans la vue : attaque, soin, fin de combat, navigation, timers, changement de Pokémon. Une partie pourrait être déplacée dans un composable ou dans `gameState` pour alléger le composant.
- `deadPokemonCounter` semble fragile, parce qu’il dépend d’un compteur manuel. Ce serait plus fiable de calculer combien de Pokémon ont `hp <= 0` directement à partir de l’équipe au lieu d’incrémenter une variable séparée.
- `handleAttack()` et `handleHealPokemon()` contiennent beaucoup de répétition autour de :
  - modifier `combatMessage`
  - attendre
  - remettre à vide
  - remettre les flags à `false`  
    Pourrais extraire de petits helpers pour rendre le code plus compact.
- `switchToNextPokemon` est appelé après KO sans vérifier visiblement dans ce composant s’il reste un Pokémon vivant.
