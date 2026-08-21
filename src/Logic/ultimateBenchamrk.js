// helpers/ULTIMATE_BENCHMARK.js
// Full benchmarking algorithm with VRAM, RT, FrameGen, storage, and RAM speed support

import { runBenchmark } from "./benchamrk";

const SETTINGS_TIERS = ["low", "medium", "high", "ultra"];
const SOFTENING_EXPONENT = 1.5;
const REFERENCE_PIXELS = 1920 * 1080;
const RESOLUTION_EXPONENT = 0.5;

// Helper: Extract VRAM from GPU title (e.g., "RTX 4070 12GB" -> 12)
function extractVramFromTitle(title = "") {
  const match = title.match(/(\d+)\s*GB/i);
  return match ? parseInt(match[1], 10) : 8; // Default 8GB if not found
}

// Helper: Detect GPU features from title
function detectGpuFeatures(title = "") {
  const lower = title.toLowerCase();
  return {
    vram: extractVramFromTitle(title),
    rayTracing:
      lower.includes("rtx") ||
      lower.includes("rx 6") ||
      lower.includes("rx 7") ||
      lower.includes("arc"),
    frameGen: lower.includes("rtx 40") || lower.includes("rx 70"),
    dlss: lower.includes("rtx"),
    fsr: lower.includes("rx") || lower.includes("arc"),
  };
}

// Helper: Detect storage type
function detectStorageType(title = "") {
  const lower = title.toLowerCase();
  if (lower.includes("nvme") || lower.includes("m.2")) return "nvme";
  if (lower.includes("ssd") || lower.includes("sata")) return "sata";
  if (lower.includes("hdd") || lower.includes("hard drive")) return "hdd";
  return "nvme"; // Default assumption
}

// Helper: Extract RAM speed
function extractRamSpeed(title = "") {
  const match = title.match(/(\d{4})\s*MHz/i);
  return match ? parseInt(match[1], 10) : 3200;
}

function getMonitorPixelCount(monitorTitle = "") {
  const match = monitorTitle.match(/\((\d+)x(\d+)\s*-/);
  if (!match) return REFERENCE_PIXELS;
  return parseInt(match[1], 10) * parseInt(match[2], 10);
}

export function getResolutionMultiplier(monitorTitle, gpuWeight = 1) {
  const pixels = getMonitorPixelCount(monitorTitle);
  const rawMultiplier = Math.pow(
    REFERENCE_PIXELS / pixels,
    RESOLUTION_EXPONENT,
  );
  return 1 + (rawMultiplier - 1) * gpuWeight;
}

export function estimateFps(
  componentScores,
  game,
  tier = "high",
  monitorTitle = "",
  hardwareInfo = {},
) {
  const { cpu, gpu, ram } = componentScores;

  // Auto-detect hardware info if not provided
  const gpuFeatures =
    hardwareInfo.gpuFeatures || detectGpuFeatures(hardwareInfo.gpuTitle || "");
  const storageType =
    hardwareInfo.storageType ||
    detectStorageType(hardwareInfo.storageTitle || "");
  const ramSpeed =
    hardwareInfo.ramSpeed || extractRamSpeed(hardwareInfo.ramTitle || "");

  // 1. Base weighted score
  const weightedScore =
    cpu * game.cpuWeight + gpu * game.gpuWeight + ram * game.ramWeight;
  let scaleFactor = Math.pow(weightedScore / 100, SOFTENING_EXPONENT);

  // 2. VRAM penalty
  const vramNeeded = game.vramRequired?.[tier] || 8;
  const availableVram = gpuFeatures.vram;
  if (availableVram < vramNeeded) {
    const vramRatio = availableVram / vramNeeded;
    scaleFactor *= Math.max(0.25, vramRatio * 0.5);
  }

  // 3. Weak component crash
  const lowestComponent = Math.min(cpu, gpu);
  if (lowestComponent < 40) {
    scaleFactor *= Math.max(0.2, lowestComponent / 40);
  }

  // 4. Resolution multiplier
  const resolutionMultiplier = getResolutionMultiplier(
    monitorTitle,
    game.gpuWeight,
  );

  // 5. RT/FrameGen bonuses
  let techMultiplier = 1;
  if (hardwareInfo.rayTracing && game.rayTracingSupport) {
    techMultiplier *= 0.7; // RT costs ~30% performance
  }
  if (hardwareInfo.frameGen && game.frameGenSupport) {
    techMultiplier *= 1.6; // FrameGen boosts ~60%
  }
  if (hardwareInfo.dlss && game.dlssSupport && hardwareInfo.rayTracing) {
    techMultiplier *= 1.3; // DLSS helps offset RT cost
  }
  if (hardwareInfo.fsr && game.fsrSupport && hardwareInfo.rayTracing) {
    techMultiplier *= 1.25; // FSR similar to DLSS
  }

  // 6. RAM speed penalty for sensitive games
  if (game.ramSpeedSensitive && ramSpeed < 3600) {
    scaleFactor *= 0.9;
  }

  // 7. Single-threaded games penalty for weak single-core
  if (game.singleThreadDependent && cpu < 60) {
    scaleFactor *= 0.85; // Extra penalty for CPU-heavy games on weak CPUs
  }

  // 8. Storage speed (stutter/loading, not avg FPS but affects experience)
  const storageMultiplier =
    storageType === "hdd" ? 0.85 : storageType === "sata" ? 0.95 : 1;

  // Final calculation
  const rawFps =
    game.baselineFps[tier] *
    scaleFactor *
    resolutionMultiplier *
    techMultiplier *
    storageMultiplier;

  return Math.max(1, Math.round(rawFps));
}

export function getGameFpsBreakdown(
  componentScores,
  game,
  monitorTitle = "",
  hardwareInfo = {},
) {
  return SETTINGS_TIERS.reduce((acc, tier) => {
    acc[tier] = estimateFps(
      componentScores,
      game,
      tier,
      monitorTitle,
      hardwareInfo,
    );
    return acc;
  }, {});
}

export function rankGamesByFps(
  componentScores,
  games,
  { tier = "high", monitorTitle = "", hardwareInfo = {} } = {},
) {
  return games
    .map((game) => ({
      id: game.id,
      title: game.title,
      genre: game.genre,
      estimatedFps: getGameFpsBreakdown(
        componentScores,
        game,
        monitorTitle,
        hardwareInfo,
      ),
      rankFps: estimateFps(
        componentScores,
        game,
        tier,
        monitorTitle,
        hardwareInfo,
      ),
    }))
    .sort((a, b) => b.rankFps - a.rankFps);
}

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

  // Build hardwareInfo from selection
  const hardwareInfo = {
    gpuTitle: selection.gpu?.title || "",
    gpuFeatures: detectGpuFeatures(selection.gpu?.title || ""),
    storageTitle: selection["Disk-Space"]?.title || "",
    storageType: detectStorageType(selection["Disk-Space"]?.title || ""),
    ramTitle: selection.ram?.title || "",
    ramSpeed: extractRamSpeed(selection.ram?.title || ""),
    rayTracing: detectGpuFeatures(selection.gpu?.title || "").rayTracing,
    frameGen: detectGpuFeatures(selection.gpu?.title || "").frameGen,
    dlss: detectGpuFeatures(selection.gpu?.title || "").dlss,
    fsr: detectGpuFeatures(selection.gpu?.title || "").fsr,
  };

  const gameRankings = rankGamesByFps(componentScores, games, {
    ...options,
    monitorTitle,
    hardwareInfo,
  });

  return {
    systemReport,
    gameRankings,
    rankedAtTier: options.tier || "high",
    hardwareInfo, // Include detected hardware info in report
  };
}
