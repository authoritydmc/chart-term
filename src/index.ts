export * from "./types.js";
export * from "./utils/color.js";
export * from "./charts/sparkline.js";
export * from "./charts/line.js";
export * from "./charts/bar.js";
export * from "./charts/histogram.js";
export * from "./charts/progress.js";
export * from "./parser.js";

import { sparkline } from "./charts/sparkline.js";
import { lineChart } from "./charts/line.js";
import { barChart } from "./charts/bar.js";
import { histogram } from "./charts/histogram.js";
import { progressBar } from "./charts/progress.js";
import { parseInputData } from "./parser.js";
import { ChartType, LineChartOptions, BarChartOptions, SparklineOptions, HistogramOptions, ProgressOptions } from "./types.js";

export type RenderOptions = LineChartOptions & BarChartOptions & SparklineOptions & HistogramOptions & ProgressOptions & {
  type?: ChartType;
};

/**
 * Universal chart rendering function that dynamically handles text/array inputs.
 */
export function renderChart(
  input: string | number[] | Record<string, number>,
  options: RenderOptions = {}
): string {
  if (typeof input === "string") {
    const parsed = parseInputData(input);
    const chartType = options.type || (parsed.isLabeled ? "bar" : "line");

    if (chartType === "bar" || chartType === "hbar") {
      return barChart(parsed.items || parsed.numbers, options);
    }
    if (chartType === "sparkline") {
      return sparkline(parsed.numbers, options);
    }
    if (chartType === "hist") {
      return histogram(parsed.numbers, options);
    }
    return lineChart(parsed.numbers, options);
  }

  if (Array.isArray(input)) {
    const chartType = options.type || "line";
    if (chartType === "sparkline") return sparkline(input as number[], options);
    if (chartType === "bar" || chartType === "hbar") return barChart(input as any, options);
    if (chartType === "hist") return histogram(input as number[], options);
    return lineChart(input as number[], options);
  }

  return barChart(input, options);
}
