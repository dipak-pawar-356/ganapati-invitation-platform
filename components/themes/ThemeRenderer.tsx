"use client";

import { FullMandalData } from "@/lib/mandal-actions";
import Theme1RoyalGold from "./Theme1RoyalGold";
import Theme2Peshwai from "./Theme2Peshwai";
import Theme3DivineSaffron from "./Theme3DivineSaffron";
import Theme4NightDarshan from "./Theme4NightDarshan";

export default function ThemeRenderer({ mandal }: { mandal: FullMandalData }) {
  switch (mandal.themeId) {
    case "peshwai":
      return <Theme2Peshwai mandal={mandal} />;
    case "divine_saffron":
      return <Theme3DivineSaffron mandal={mandal} />;
    case "night_darshan":
      return <Theme4NightDarshan mandal={mandal} />;
    case "royal_gold":
    default:
      return <Theme1RoyalGold mandal={mandal} />;
  }
}
