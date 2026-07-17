// helpers/BENCHMARK.js
// Core scoring + compatibility logic for the PC benchmark tool.
// Works directly off the `score` field already stored on each item in db.json
// (cpu, gpu, ram, monitor, motherboard, Disk-Space all use a 0-100 scale).

// ---- 1. Category weights for the overall score ----
// GPU and CPU dominate real-world "system power", storage/RAM matter less,
// monitor/motherboard barely move the needle on raw performance.
const WEIGHTS = {
  cpu: 0.3,
  gpu: 0.35,
  ram: 0.1,
  "Disk-Space": 0.12,
  motherboard: 0.05,
  monitor: 0.08,
};

// ---- 2. Socket / chipset generation extraction (parsed from title text) ----
// CPU titles look like "... - 12th Gen Desktop" or "... - Zen 4th Gen Desktop"
// Motherboard titles look like "... (LGA1700 - DDR5)"
const INTEL_GEN_TO_SOCKET = {
  "1st": "LGA1156",
  "2nd": "LGA1155",
  "3rd": "LGA1150",
  "4th": "LGA1150",
  "6th": "LGA1151",
  "7th": "LGA1151",
  "8th": "LGA1151v2",
  "9th": "LGA1151v2",
  "10th": "LGA1200",
  "11th": "LGA1200",
  "12th": "LGA1700",
  "13th": "LGA1700",
  "14th": "LGA1700",
};
const AMD_GEN_TO_SOCKET = {
  Bulldozer: "AM3+",
  "Zen 1st": "AM4",
  "Zen+": "AM4",
  "Zen 2nd": "AM4",
  "Zen 3rd": "AM4",
  "Zen 4th": "AM5",
  "Zen 5th": "AM5",
};

function getCpuSocket(title = "") {
  if (/AMD/i.test(title)) {
    for (const [key, socket] of Object.entries(AMD_GEN_TO_SOCKET)) {
      if (title.includes(key)) return socket;
    }
    return "Unknown";
  }
  const match = title.match(/(\d+)(st|nd|rd|th) Gen/);
  if (match) return INTEL_GEN_TO_SOCKET[`${match[1]}${match[2]}`] || "Unknown";
  return "Unknown";
}

function getMotherboardSocket(title = "") {
  const match = title.match(/\((LGA\d+v?\d?|AM\d\+?)\s*-/);
  return match ? match[1] : "Unknown";
}

function getMotherboardRamType(title = "") {
  const match = title.match(/DDR\d/);
  return match ? match[0] : "Unknown";
}

function getRamType(title = "") {
  const match = title.match(/DDR\d/);
  return match ? match[0] : "Unknown";
}

// ---- 3. Compatibility check ----
// Returns { compatible: boolean, issues: string[] }
export function checkCompatibility(selection) {
  const issues = [];

  if (selection.cpu && selection.motherboard) {
    const cpuSocket = getCpuSocket(selection.cpu.title);
    const mbSocket = getMotherboardSocket(selection.motherboard.title);
    if (
      cpuSocket !== "Unknown" &&
      mbSocket !== "Unknown" &&
      cpuSocket !== mbSocket
    ) {
      issues.push(
        `Socket mismatch: your CPU needs ${cpuSocket}, but the motherboard is ${mbSocket}.`,
      );
    }
  }

  if (selection.ram && selection.motherboard) {
    const ramType = getRamType(selection.ram.title);
    const mbRamType = getMotherboardRamType(selection.motherboard.title);
    if (
      ramType !== "Unknown" &&
      mbRamType !== "Unknown" &&
      ramType !== mbRamType
    ) {
      issues.push(
        `Memory mismatch: your RAM is ${ramType}, but the motherboard only supports ${mbRamType}.`,
      );
    }
  }

  return { compatible: issues.length === 0, issues };
}

// ---- 4. Bottleneck detection (CPU vs GPU imbalance) ----
// Returns { hasBottleneck, bottleneckedBy, message }
export function detectBottleneck(selection) {
  if (!selection.cpu || !selection.gpu) return { hasBottleneck: false };

  const { score: cpuScore } = selection.cpu;
  const { score: gpuScore } = selection.gpu;
  const ratio = Math.min(cpuScore, gpuScore) / Math.max(cpuScore, gpuScore);

  // Anything below ~0.55 relative parity is a noticeable real-world bottleneck
  if (ratio < 0.55) {
    const bottleneckedBy = cpuScore < gpuScore ? "cpu" : "gpu";
    return {
      hasBottleneck: true,
      bottleneckedBy,
      message:
        bottleneckedBy === "cpu"
          ? "Your CPU is significantly weaker than your GPU — it'll hold back your graphics card's performance."
          : "Your GPU is significantly weaker than your CPU — it's the limiting factor here.",
    };
  }
  return { hasBottleneck: false };
}

// ---- 5. Tier labels for the final score ----
function getTier(score) {
  if (score >= 85) return { label: "Enthusiast", color: "#4CAF50" };
  if (score >= 65) return { label: "High-End", color: "#00BCD4" };
  if (score >= 40) return { label: "Mid-Range", color: "#D4AF37" };
  if (score >= 20) return { label: "Entry-Level", color: "#FF9800" };
  return { label: "Budget / Legacy", color: "#F44336" };
}

// ---- 6. Main entry point ----
// `selection` = { cpu: {id,title,score}, gpu: {...}, ram: {...}, monitor: {...}, motherboard: {...}, 'Disk-Space': {...} }
export function runBenchmark(selection) {
  const categories = Object.keys(WEIGHTS);
  const missing = categories.filter((c) => !selection[c]);
  if (missing.length) {
    return { error: `Missing selection for: ${missing.join(", ")}` };
  }

  const breakdown = categories.map((cat) => ({
    category: cat,
    title: selection[cat].title,
    score: selection[cat].score,
    weight: WEIGHTS[cat],
    contribution: Math.round(selection[cat].score * WEIGHTS[cat] * 100) / 100,
  }));

  const overallScore = Math.round(
    breakdown.reduce((sum, b) => sum + b.contribution, 0),
  );

  const compatibility = checkCompatibility(selection);
  const bottleneck = detectBottleneck(selection);
  const tier = getTier(overallScore);

  return {
    overallScore,
    tier,
    breakdown,
    compatibility,
    bottleneck,
  };
}
