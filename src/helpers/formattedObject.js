export const createSelection = (userSelection) => {
  return {
    cpu: userSelection?.cpu || { title: "CPU", score: 50 },
    gpu: userSelection?.gpu || { title: "GPU", score: 50 },
    ram: userSelection?.ram || { title: "RAM", score: 50 },
    "Disk-Space": userSelection?.["Disk-Space"] || {
      title: "Storage",
      score: 50,
    },
    motherboard: userSelection?.motherboard || {
      title: "Motherboard",
      score: 50,
    },
    monitor: userSelection?.monitor || {
      title: "Monitor (1920x1080 - 16:9)",
      score: 50,
    },
  };
};
