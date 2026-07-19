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
// this is used to punish low-end systems more harshly than a linear scale would, since
// in the real world, a 50/50/50 system doesn't play like "half as good" as a 100/100/100 system.(again it's math and AI helped me )
const SOFTENING_EXPONENT = 1.5;

// ---------------------------------------------------------------------
// 1b. Resolution multiplier -- parsed automatically from the monitor's
// title, no per-game data entry needed. Resolution taxes the GPU roughly
// the same way regardless of which game it is, so unlike cpuWeight/
// gpuWeight (which genuinely differ per game) this is one universal curve.
// ---------------------------------------------------------------------
// games.json baselineFps values are calibrated at 1080p, so that's the
// reference point: multiplier = 1 at 1080p, <1 above it, >1 below it.
const REFERENCE_PIXELS = 1920 * 1080;

//making the results more realistic by making it linear insted of exponential(I didn't know about the math so AI helped me )
const RESOLUTION_EXPONENT = 0.5;

function getMonitorPixelCount(monitorTitle = "") {
  // matches "(1920x1080 - 16:9)" style titles already in db.json
  const match = monitorTitle.match(/\((\d+)x(\d+)\s*-/);
  if (!match) return REFERENCE_PIXELS; // unknown format -> no penalty/bonus
  return parseInt(match[1], 10) * parseInt(match[2], 10);
}

export function getResolutionMultiplier(monitorTitle, gpuWeight = 1) {
  const pixels = getMonitorPixelCount(monitorTitle);
  const rawMultiplier = Math.pow(
    REFERENCE_PIXELS / pixels,
    RESOLUTION_EXPONENT,
  );
  // Blend between "no resolution effect" (1.0) and the full raw multiplier,
  // weighted by how GPU-bound this specific game is. A CPU-bound sim
  // (low gpuWeight) barely moves with resolution in the real world --
  // uniform scaling was overcorrecting for exactly that case.
  return 1 + (rawMultiplier - 1) * gpuWeight;
}

export function estimateFps(
  componentScores,
  game,
  tier = "high",
  monitorTitle = "",
) {
  const { cpu, gpu, ram } = componentScores;

  // 1. Calculate the weighted score based on game requirements
  const weightedScore =
    cpu * game.cpuWeight + gpu * game.gpuWeight + ram * game.ramWeight;

  // 2. Apply a strict exponential penalty for low-end configurations
  let scaleFactor = Math.pow(weightedScore / 100, SOFTENING_EXPONENT);

  // 3. HARD CRASH FOR WEAK COMPONENTS (Real-world bottleneck simulation)
  // If GPU or CPU score is critically low (e.g., below 40), drop the performance heavily
  const lowestComponent = Math.min(cpu, gpu);
  if (lowestComponent < 40) {
    // Scales down the performance by up to 60% extra if the component is close to 0
    const penaltyFactor = lowestComponent / 40;
    scaleFactor *= Math.max(0.2, penaltyFactor);
  }

  // 4. Calculate resolution impact
  const resolutionMultiplier = getResolutionMultiplier(
    monitorTitle,
    game.gpuWeight,
  );

  // 5. Final FPS calculation
  const rawFps = game.baselineFps[tier] * scaleFactor * resolutionMultiplier;

  // Floor at 1 fps so it doesn't return 0 or negative values
  return Math.max(1, Math.round(rawFps));
}

// ---------------------------------------------------------------------
//    Full per-game breakdown (all 4 tiers) -- returns { low, medium, high, ultra }
// ---------------------------------------------------------------------
export function getGameFpsBreakdown(componentScores, game, monitorTitle = "") {
  return SETTINGS_TIERS.reduce((acc, tier) => {
    acc[tier] = estimateFps(componentScores, game, tier, monitorTitle);
    return acc;
  }, {});
}

// ---------------------------------------------------------------------
// 3. Rank every game in the catalogue by FPS at a given tier, return top N
// ---------------------------------------------------------------------
export function rankGamesByFps(
  componentScores,
  games,
  { tier = "high", monitorTitle = "" } = {},
) {
  return games
    .map((game) => ({
      id: game.id,
      title: game.title,
      genre: game.genre,
      estimatedFps: getGameFpsBreakdown(componentScores, game, monitorTitle),
      rankFps: estimateFps(componentScores, game, tier, monitorTitle), // the value actually sorted on
    }))
    .sort((a, b) => b.rankFps - a.rankFps);
}

// ---------------------------------------------------------------------
// The main Function for benchamrk, which combines system scoring and game FPS ranking into one report
// ---------------------------------------------------------------------
// selection = { cpu, gpu, ram, monitor, motherboard, 'Disk-Space' } (full
//              {id, title, score} objects, same shape runBenchmark expects)
// games     = array from games.json
// options   = { tier: 'low'|'medium'|'high'|'ultra'  (defaults to 'high'), monitorTitle: string (optional override) }
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

  const monitorTitle = selection.monitor?.title || "";
  const gameRankings = rankGamesByFps(componentScores, games, {
    ...options,
    monitorTitle,
  });

  return {
    systemReport, // stuff like overall score, tier, compatibility issues, bottleneck warning
    gameRankings, // top N games sorted by fps, each with full tier breakdown
    rankedAtTier: options.tier || "high",
  };
}
