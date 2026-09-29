import { HistogramOptions } from "../types.js";
import { barChart } from "./bar.js";

/**
 * Automatically bucket numerical values into a histogram frequency distribution.
 */
export function histogram(data: number[], options: HistogramOptions = {}): string {
  if (!data || data.length === 0) return "";

  const min = options.min !== undefined ? options.min : Math.min(...data);
  const max = options.max !== undefined ? options.max : Math.max(...data);
  const binCount = Math.max(2, options.bins || 8);
  const range = max - min;
  const binSize = range === 0 ? 1 : range / binCount;

  const bins: number[] = new Array(binCount).fill(0);

  for (const val of data) {
    if (val < min || val > max) continue;
    let index = Math.floor((val - min) / binSize);
    if (index >= binCount) index = binCount - 1;
    bins[index]++;
  }

  const items = bins.map((count, i) => {
    const start = min + i * binSize;
    const end = start + binSize;
    const label = `[${start.toFixed(1)} - ${end.toFixed(1)})`;
    return {
      label,
      value: count,
    };
  });

  return barChart(items, {
    title: options.title || "Frequency Distribution",
    color: options.color || "gradient",
    width: options.width || 35,
    showPercent: options.showPercent ?? true,
  });
}
