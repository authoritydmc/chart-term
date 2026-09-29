import { LineChartOptions } from "../types.js";
import { colorize, ANSI_DIM, ANSI_RESET, ANSI_BOLD } from "../utils/color.js";

const BRAILLE_OFFSET = 0x2800;
const BRAILLE_DOTS = [
  [0x01, 0x08],
  [0x02, 0x10],
  [0x04, 0x20],
  [0x40, 0x80],
];

/**
 * Format a number into clean compact label (e.g. 1.2K, 3.4M, or fixed precision).
 */
function formatValue(val: number, precision: number = 2): string {
  if (Math.abs(val) >= 1_000_000) {
    return (val / 1_000_000).toFixed(1) + "M";
  }
  if (Math.abs(val) >= 1_000) {
    return (val / 1_000).toFixed(1) + "K";
  }
  if (Number.isInteger(val)) {
    return val.toString();
  }
  return val.toFixed(precision);
}

/**
 * Render a 2D line plot in terminal using high-resolution Braille canvas (2x4 subpixels per cell).
 */
export function lineChart(data: number[], options: LineChartOptions = {}): string {
  if (!data || data.length === 0) return "";

  const charWidth = Math.max(10, options.width || 60);
  const charHeight = Math.max(4, options.height || 10);

  const pixelWidth = charWidth * 2;
  const pixelHeight = charHeight * 4;

  const minVal = options.min !== undefined ? options.min : Math.min(...data);
  const maxVal = options.max !== undefined ? options.max : Math.max(...data);
  const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  // Initialize Braille pixel grid (pixelHeight x pixelWidth)
  const grid: boolean[][] = Array.from({ length: pixelHeight }, () =>
    new Array(pixelWidth).fill(false)
  );

  // Set subpixel helper
  const setPixel = (px: number, py: number) => {
    if (px >= 0 && px < pixelWidth && py >= 0 && py < pixelHeight) {
      grid[py][px] = true;
    }
  };

  // Map data series to subpixel coordinates
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < data.length; i++) {
    const xFraction = data.length === 1 ? 0.5 : i / (data.length - 1);
    const px = Math.round(xFraction * (pixelWidth - 1));

    const yFraction = Math.max(0, Math.min(1, (data[i] - minVal) / range));
    // Terminal y is 0 at top, so invert:
    const py = Math.round((1 - yFraction) * (pixelHeight - 1));

    points.push({ x: px, y: py });
  }

  // Draw lines connecting adjacent points using Bresenham algorithm
  for (let i = 0; i < points.length - 1; i++) {
    let x0 = points[i].x;
    let y0 = points[i].y;
    const x1 = points[i + 1].x;
    const y1 = points[i + 1].y;

    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      setPixel(x0, y0);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  if (points.length === 1) {
    setPixel(points[0].x, points[0].y);
  }

  // Convert subpixel grid into Braille characters
  const chartLines: string[] = [];
  for (let cy = 0; cy < charHeight; cy++) {
    let lineStr = "";
    for (let cx = 0; cx < charWidth; cx++) {
      let byte = 0;
      for (let dy = 0; dy < 4; dy++) {
        for (let dx = 0; dx < 2; dx++) {
          const py = cy * 4 + dy;
          const px = cx * 2 + dx;
          if (grid[py][px]) {
            byte |= BRAILLE_DOTS[dy][dx];
          }
        }
      }
      const char = byte === 0 ? " " : String.fromCharCode(BRAILLE_OFFSET + byte);
      const progress = cx / charWidth;
      lineStr += colorize(char, options.color || "cyan", progress);
    }
    chartLines.push(lineStr);
  }

  // Format Y-axis labels
  const maxLabel = formatValue(maxVal, options.precision);
  const minLabel = formatValue(minVal, options.precision);
  const midLabel = formatValue((maxVal + minVal) / 2, options.precision);
  const labelWidth = Math.max(maxLabel.length, minLabel.length, midLabel.length);

  const output: string[] = [];

  if (options.title) {
    output.push(`${ANSI_BOLD}${options.title}${ANSI_RESET}`);
  }

  // Assemble chart with Y-axis
  for (let cy = 0; cy < charHeight; cy++) {
    let yLabel = "".padStart(labelWidth);
    if (cy === 0) {
      yLabel = maxLabel.padStart(labelWidth);
    } else if (cy === Math.floor(charHeight / 2)) {
      yLabel = midLabel.padStart(labelWidth);
    } else if (cy === charHeight - 1) {
      yLabel = minLabel.padStart(labelWidth);
    }

    const axisChar = cy === charHeight - 1 ? "└" : "│";
    output.push(`${ANSI_DIM}${yLabel} ${axisChar}${ANSI_RESET}${chartLines[cy]}`);
  }

  // X-axis baseline
  const xAxisPadding = "".padStart(labelWidth + 1);
  const xAxisLine = "─".repeat(charWidth);
  output.push(`${ANSI_DIM}${xAxisPadding}└${xAxisLine}${ANSI_RESET}`);

  if (options.xlabel) {
    output.push(`${ANSI_DIM}${xAxisPadding} ${options.xlabel}${ANSI_RESET}`);
  }

  return output.join("\n");
}
