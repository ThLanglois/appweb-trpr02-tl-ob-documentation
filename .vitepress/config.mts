import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/appweb-trpr02-tl-ob-documentation/",
  title: "Pokemon Stadium Doc",
  description: "Revues de code pour Pokemon Stadium",

  themeConfig: {
    nav: [
      { text: "Acceuil", link: "/" },
      { text: "Liste de revues", link: "/reviews/" },
    ],

    sidebar: [
      {
        text: "Liens rapides",
        items: [
          { text: "Liste de revues", link: "/reviews/" },
          { text: "TrainerForm", link: "/reviews/trainer_form.md" },
          { text: "HomePageView", link: "/reviews/home_page_view.md" },
          { text: "ScoreItem", link: "/reviews/score_item.md" },
          { text: "ScoreItem.test", link: "/reviews/score_item_test.md" },
          { text: "EnemyInfo", link: "/reviews/enemy_info.md" },
          { text: "PlayerInfo", link: "/reviews/player_info.md" },
          { text: "GamePageView", link: "/reviews/game_page_view.md" },
          { text: "FightProgressBar", link: "/reviews/fight_progress_bar.md" },
          { text: "Combat.ts", link: "/reviews/combat.md" },
          { text: "GameState.ts", link: "/reviews/game_state.md" },
        ],
      },
    ],

    search: {
      provider: "local",
    },
  },
});
