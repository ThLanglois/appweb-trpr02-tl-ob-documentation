# Revue de code pour script Combat

```ts
import { Grade, type Pokemon, type Trainer } from "./types";

const hitChance: Record<number, number> = {
  [Grade.Débutant]: 0.2,
  [Grade.Confirmé]: 0.35,
  [Grade.Expert]: 0.5,
  [Grade.Maitre]: 0.7,
};

function doesHit(grade: number): boolean {
  return Math.random() < (hitChance[grade] ?? 0.2);
}

function randomDamage(): number {
  return Math.floor(Math.random() * (6 - 3 + 1)) + 3; // % entre 3 et 6
}

export interface TurnResult {
  playerHit: boolean;
  enemyHit: boolean;
  playerDamage: number;
  enemyDamage: number;
  playerHP: number;
  enemyHP: number;
  playerKO: boolean;
  enemyKO: boolean;
}

export function playTurn(
  playerGrade: number,
  playerHP: number,
  playerMaxHP: number,
  enemyGrade: number,
  enemyHP: number,
  enemyMaxHP: number,
): TurnResult {
  const playerHit = doesHit(playerGrade);
  const enemyHit = doesHit(enemyGrade);

  const playerPercent = playerHit ? randomDamage() : 0;
  const enemyPercent = enemyHit ? randomDamage() : 0;

  const playerDamage = Math.floor((playerPercent / 100) * enemyMaxHP);
  const enemyDamage = Math.floor((enemyPercent / 100) * playerMaxHP);

  const newPlayerHP = Math.max(0, playerHP - enemyDamage);
  const newEnemyHP = Math.max(0, enemyHP - playerDamage);

  return {
    playerHit,
    enemyHit,
    playerDamage,
    enemyDamage,
    playerHP: newPlayerHP,
    enemyHP: newEnemyHP,
    playerKO: newPlayerHP <= 0,
    enemyKO: newEnemyHP <= 0,
  };
}

export function switchPokemon(
  team: Pokemon[],
  currentIndex: number,
  newIndex: number,
): Pokemon {
  if (newIndex < 0 || newIndex >= team.length || newIndex === currentIndex) {
    return team[currentIndex];
  }
  return team[newIndex];
}

// AI
export async function fetchRandomEnemy(): Promise<Trainer> {
  const response = await fetch("http://127.0.0.1:3000/trainers");
  if (!response.ok) throw new Error("Impossible de charger les ennemis");
  const trainers: Trainer[] = await response.json();
  const random = Math.floor(Math.random() * trainers.length);
  return trainers[random];
}
```

- `doesHit(grade: number)` pourrait recevoir directement `Grade` au lieu de `number`, pour rendre le typage plus précis.
- Même chose pour `playTurn`, si les grades viennent toujours de l’enum `Grade`, ce serait mieux de typer ça plus strictement
- `fetchRandomEnemy()` pourrait être entouré d’un `try/catch` pour éviter les erreurs.
