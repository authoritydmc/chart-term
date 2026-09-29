import { BarChartOptions, BarItem } from "../types.js";
import { colorize, ANSI_DIM, ANSI_RESET, ANSI_BOLD } from "../utils/color.js";

const FRACTION_BLOCKS = ["", "▏", "▎", "▍", "▌", "▋", "▊", "▉", "█"];

/**
 * Render a Horizontal Bar Chart.
 */
export function barChart(
  items: BarItem[] | Record<string, number> | number[],
  options: BarChartOptions = {}
): string {
  // Normalize items
  let normalized: BarItem[] = [];

  if (Array.isArray(items)) {
    if (items.length > 0 && typeof items[0] === "number") {
      normalized = (items as number[]).map((val, idx) => ({
        label: `#${idx + 1}`,
        value: val,
      }));
    } else {
      normalized = [...(items as BarItem[])];
    }
  } else if (typeof items === "object" && items !== null) {
    normalized = Object.entries(items).map(([label, value]) => ({
      label,
      value,
    }));
  }

  if (normalized.length === 0) return "";

  if (options.sort === "desc") {
    normalized.sort((a, b) => b.value - a.value);
  } else if (options.sort === "asc") {
    normalized.sort((a, b) => a.value - b.value);
  }

  const maxVal = Math.max(...normalized.map((i) => i.value), options.max || 1);
  const total = normalized.reduce((sum, i) => sum + Math.max(0, i.value), 0);
  const maxBarLength = options.width || 40;

  const maxLabelLength = Math.max(...normalized.map((i) => i.label.length), 1);
  const maxValueLength = Math.max(...normalized.map((i) => i.value.toLocaleString().length), 1);

  const lines: string[] = [];

  if (options.title) {
    lines.push(`${ANSI_BOLD}${options.title}${ANSI_RESET}`);
  }

  for (let i = 0; i < normalized.length; i++) {
    const item = normalized[i];
    const val = item.value;
    const fraction = maxVal > 0 ? Math.max(0, val) / maxVal : 0;
    const exactLength = fraction * maxBarLength;
    const fullBlocks = Math.floor(exactLength);
    const remainder = exactLength - fullBlocks;
    const subBlockIdx = Math.floor(remainder * 8);

    let bar = "█".repeat(fullBlocks);
    if (subBlockIdx > 0 && fullBlocks < maxBarLength) {
      bar += FRACTION_BLOCKS[subBlockIdx];
    }

    const coloredBar = colorize(bar, item.color || options.color || "cyan", i / Math.max(1, normalized.length - 1));

    const paddedLabel = item.label.padEnd(maxLabelLength);
    const paddedValue = val.toLocaleString().padStart(maxValueLength);
    const percent = total > 0 ? ((val / total) * 100).toFixed(1) + "%" : "";

    let line = `${ANSI_BOLD}${paddedLabel}${ANSI_RESET} ${ANSI_DIM}│${ANSI_RESET} ${coloredBar}`;

    if (options.showValues !== false) {
      line += ` ${ANSI_BOLD}${paddedValue}${ANSI_RESET}`;
    }

    if (options.showPercent) {
      line += ` ${ANSI_DIM}(${percent})${ANSI_RESET}`;
    }

    lines.push(line);
  }

  return lines.join("\n");
}
