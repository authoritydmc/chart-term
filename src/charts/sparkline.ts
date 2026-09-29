import { SparklineOptions } from "../types.js";
import { colorize, ANSI_DIM, ANSI_RESET, ANSI_BOLD } from "../utils/color.js";

const SPARK_BLOCKS = [" ", "▂", "▃", "▄", "▅", "▆", "▇", "█"];

/**
 * Generate an inline terminal sparkline from a series of numbers.
 */
export function sparkline(data: number[], options: SparklineOptions = {}): string {
  if (!data || data.length === 0) return "";

  const min = options.min !== undefined ? options.min : Math.min(...data);
  const max = options.max !== undefined ? options.max : Math.max(...data);
  const range = max - min;

  const chars: string[] = [];

  for (let i = 0; i < data.length; i++) {
    const val = data[i];
    const normalized = range === 0 ? 0.5 : Math.max(0, Math.min(1, (val - min) / range));
    const index = Math.min(SPARK_BLOCKS.length - 1, Math.floor(normalized * SPARK_BLOCKS.length));
    const char = SPARK_BLOCKS[index];

    // Progress along time (or along value)
    const coloredChar = colorize(char, options.color || "cyan", normalized);
    chars.push(coloredChar);
  }

  let result = chars.join("");

  if (options.title) {
    result = `${ANSI_BOLD}${options.title}${ANSI_RESET} ${result}`;
  }

  if (options.showMinMax) {
    result = `${ANSI_DIM}min:${min.toFixed(1)}${ANSI_RESET} ${result} ${ANSI_DIM}max:${max.toFixed(1)}${ANSI_RESET}`;
  }

  return result;
}
