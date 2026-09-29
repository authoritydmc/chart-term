import { lineChart, sparkline, barChart, histogram, progressBar } from "../src/index.js";

console.log("=== 1. High-Resolution Braille 2D Line Plot ===");
const sinWave = Array.from({ length: 40 }, (_, i) => Math.sin(i / 5) * 50 + 50);
console.log(
  lineChart(sinWave, {
    title: "Sine Wave Metric (Braille 2x4 Canvas)",
    color: "rainbow",
    width: 45,
    height: 8,
    xlabel: "Timestamp (seconds)",
  })
);

console.log("\n=== 2. Inline Sparkline ===");
console.log(
  sparkline([12, 18, 25, 42, 38, 55, 68, 74, 62, 85, 99], {
    title: "Active Users:",
    color: "gradient",
    showMinMax: true,
  })
);

console.log("\n=== 3. Horizontal Bar Chart ===");
console.log(
  barChart(
    {
      "Node.js": 4200,
      "Python": 3800,
      "Rust": 2900,
      "Go": 2400,
      "TypeScript": 5100,
    },
    {
      title: "Language Usage Benchmark",
      color: "cyan",
      sort: "desc",
      showPercent: true,
    }
  )
);

console.log("\n=== 4. Histogram Distribution ===");
const normalDist = [12, 15, 14, 16, 22, 25, 26, 24, 28, 29, 35, 38, 36, 42, 55];
console.log(histogram(normalDist, { bins: 5, color: "magenta" }));

console.log("\n=== 5. Metric Progress Bar ===");
console.log(progressBar(82, 100, { label: "Memory Usage:", color: "yellow" }));
