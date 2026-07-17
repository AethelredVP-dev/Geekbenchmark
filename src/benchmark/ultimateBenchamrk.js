// helpers/ULTIMATE_BENCHMARK.js
//
// The full benchmarking algorithm. This is the "engine" -- it takes a
// component selection + a games list and returns EVERYTHING: system score,
// tier, compatibility issues, bottleneck warning, and FPS estimates for
// every game at every settings tier, ranked.
//
// It builds on runBenchmark() from BENCHMARK.js -- nothing here duplicates
// that logic, it just adds the game-FPS layer on top.

import { runBenchmark } from "./benchamrk";

const SETTINGS_TIERS = ["low", "medium", "high", "ultra"];

// ---------------------------------------------------------------------
// 1. Core FPS formula
// ---------------------------------------------------------------------
// Every game defines cpuWeight/gpuWeight/ramWeight (summing to 1) and a
// baselineFps per tier -- the FPS a PERFECT system (100/100/100) would hit.
// A real system's weighted score (0-100) scales that baseline down.
//
// scaleFactor is raised to a soft exponent (0.9) rather than applied
// linearly: this avoids unrealistically punishing mid-range systems while
// still keeping low-end systems clearly low and high-end systems clearly
// high. Tune SOFTENING_EXPONENT if your own testing shows it should curve
// more or less aggressively.
const SOFTENING_EXPONENT = 0.9;

export function estimateFps(componentScores, game, tier = "high") {
  const { cpu, gpu, ram } = componentScores;

  const weightedScore =
    cpu * game.cpuWeight + gpu * game.gpuWeight + ram * game.ramWeight;

  const scaleFactor = Math.pow(weightedScore / 100, SOFTENING_EXPONENT);
  const rawFps = game.baselineFps[tier] * scaleFactor;

  // Floor at 1 fps -- a "0 fps" result reads as broken, not "very slow"
  return Math.max(1, Math.round(rawFps));
}

// ---------------------------------------------------------------------
// 2. Full per-game breakdown (all 4 tiers) -- used for the click-to-expand
//    modal you're building, so a game card can show low/med/high/ultra at
//    once without recalculating anything.
// ---------------------------------------------------------------------
export function getGameFpsBreakdown(componentScores, game) {
  return SETTINGS_TIERS.reduce((acc, tier) => {
    acc[tier] = estimateFps(componentScores, game, tier);
    return acc;
  }, {});
}

// ---------------------------------------------------------------------
// 3. Rank every game in the catalogue by FPS at a given tier, return top N
// ---------------------------------------------------------------------
export function rankGamesByFps(
  componentScores,
  games,
  { tier = "high", limit = 30 } = {},
) {
  return games
    .map((game) => ({
      id: game.id,
      title: game.title,
      genre: game.genre,
      estimatedFps: getGameFpsBreakdown(componentScores, game),
      rankFps: estimateFps(componentScores, game, tier), // the value actually sorted on
    }))
    .sort((a, b) => b.rankFps - a.rankFps)
    .slice(0, limit);
}

// ---------------------------------------------------------------------
// 4. THE ULTIMATE FUNCTION -- one call, everything back.
// ---------------------------------------------------------------------
// selection = { cpu, gpu, ram, monitor, motherboard, 'Disk-Space' } (full
//              {id, title, score} objects, same shape runBenchmark expects)
// games     = array from games.json
// options   = { tier: 'low'|'medium'|'high'|'ultra', limit: number }
export function runUltimateBenchmark(selection, games, options = {}) {
  const systemReport = runBenchmark(selection);
  if (systemReport.error) {
    return { error: systemReport.error };
  }

  const componentScores = {
    cpu: selection.cpu.score,
    gpu: selection.gpu.score,
    ram: selection.ram.score,
  };

  const gameRankings = rankGamesByFps(componentScores, games, options);

  return {
    systemReport, // overallScore, tier, breakdown, compatibility, bottleneck
    gameRankings, // top N games sorted by fps, each with full tier breakdown
    rankedAtTier: options.tier || "high",
  };
}
