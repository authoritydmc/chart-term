import { ProgressOptions } from "../types.js";
import { colorize, ANSI_DIM, ANSI_RESET, ANSI_BOLD } from "../utils/color.js";

/**
 * Render a single compact progress / metric gauge bar.
 */
export function progressBar(value: number, total: number = 100, options: ProgressOptions = {}): string {
  const width = options.width || 30;
  const fraction = Math.max(0, Math.min(1, total > 0 ? value / total : 0));
  const filled = Math.round(fraction * width);
  const empty = width - filled;

  const barFilled = "█".repeat(filled);
  const barEmpty = "░".repeat(empty);

  const coloredFilled = colorize(barFilled, options.color || "green", fraction);
  const percentStr = `${(fraction * 100).toFixed(1)}%`;

  let line = "";
  if (options.label) {
    line += `${ANSI_BOLD}${options.label}${ANSI_RESET} `;
  }

  line += `${coloredFilled}${ANSI_DIM}${barEmpty}${ANSI_RESET}`;

  if (options.showPercent !== false) {
    line += ` ${ANSI_BOLD}${percentStr}${ANSI_RESET} ${ANSI_DIM}(${value}/${total})${ANSI_RESET}`;
  }

  return line;
}
