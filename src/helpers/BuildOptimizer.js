// buildOptimizer.js
// Knapsack algorithm to find the best combination of parts (max total score)
// within a given budget (budget is treated as an integer dollar amount).

/**
 * For a given budget, picks the best part from each category so that
 * the total price never exceeds the budget and the total score is maximized.
 *
 * @param {number} budget - Total budget (USD, integer)
 * @param {object} db - The database object (i.e. data[0] from DB.json)
 * @param {string[]} categories - Categories to select parts from
 * @returns {{ parts: object, totalScore: number, totalPrice: number }}
 */
export function buildBestForBudget(
  budget,
  db,
  categories = ["cpu", "gpu", "ram", "motherboard", "Disk-Space", "monitor"]
) {
  const B = Math.floor(budget);
  // dp[b] = best possible score when spending at most b dollars
  let dp = new Array(B + 1).fill(0);
  const pickHistory = []; // for each category, records the pick made at every budget level

  for (const cat of categories) {
    const items = db[cat] || [];
    const newDp = [...dp];
    const pick = new Array(B + 1).fill(null);

    for (let b = 0; b <= B; b++) {
      for (const item of items) {
        const p = item.price;
        if (p <= b) {
          const val = dp[b - p] + item.score;
          if (val > newDp[b]) {
            newDp[b] = val;
            pick[b] = item;
          }
        }
      }
    }
    dp = newDp;
    pickHistory.push(pick);
  }

  // Backtrack from the end to reconstruct the chosen parts
  let remaining = B;
  const parts = {};
  for (let i = categories.length - 1; i >= 0; i--) {
    const cat = categories[i];
    const chosen = pickHistory[i][remaining];
    parts[cat] = chosen;
    if (chosen) remaining -= chosen.price;
  }

  const totalPrice = B - remaining;
  return { parts, totalScore: dp[B], totalPrice };
}

// Default budget presets with smart (non-uniform) spacing
export const BUDGET_PRESETS = [
  100, 200, 300, 500, 750, 1000, 1500, 2000, 3000, 4000, 5000, 7500, 10000,
];

/**
 * Builds output for all presets at once — useful for pre-computing
 * (e.g. inside a single heavy useMemo at the top of the page).
 */
export function buildAllPresets(db, presets = BUDGET_PRESETS) {
  return presets.map((budget) => ({
    budget,
    ...buildBestForBudget(budget, db),
  }));
}