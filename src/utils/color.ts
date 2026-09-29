import { RGBColor, ColorInput } from "../types.js";

export const PRESET_COLORS: Record<string, RGBColor> = {
  cyan: { r: 56, g: 189, b: 248 },
  green: { r: 34, g: 197, b: 94 },
  yellow: { r: 234, g: 179, b: 8 },
  magenta: { r: 217, g: 70, b: 239 },
  red: { r: 239, g: 68, b: 68 },
  blue: { r: 59, g: 130, b: 246 },
  purple: { r: 168, g: 85, b: 247 },
  white: { r: 243, g: 244, b: 246 },
  gray: { r: 156, g: 163, b: 175 },
};

export function parseColor(color: string | RGBColor | undefined, fallback: RGBColor = PRESET_COLORS.cyan): RGBColor {
  if (!color) return fallback;
  if (typeof color === "object" && "r" in color && "g" in color && "b" in color) {
    return color;
  }

  if (typeof color === "string") {
    const lower = color.toLowerCase().trim();
    if (PRESET_COLORS[lower]) {
      return PRESET_COLORS[lower];
    }

    let hex = lower.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    if (hex.length === 6) {
      const num = parseInt(hex, 16);
      if (!isNaN(num)) {
        return {
          r: (num >> 16) & 255,
          g: (num >> 8) & 255,
          b: num & 255,
        };
      }
    }
  }

  return fallback;
}

export function fgRgb(rgb: RGBColor): string {
  return `\x1b[38;2;${rgb.r};${rgb.g};${rgb.b}m`;
}

export function bgRgb(rgb: RGBColor): string {
  return `\x1b[48;2;${rgb.r};${rgb.g};${rgb.b}m`;
}

export const ANSI_RESET = "\x1b[0m";
export const ANSI_BOLD = "\x1b[1m";
export const ANSI_DIM = "\x1b[2m";

/**
 * Linearly interpolate between two RGB colors.
 * t ranges from 0 to 1.
 */
export function interpolateRgb(c1: RGBColor, c2: RGBColor, t: number): RGBColor {
  const clampT = Math.max(0, Math.min(1, t));
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * clampT),
    g: Math.round(c1.g + (c2.g - c1.g) * clampT),
    b: Math.round(c1.b + (c2.b - c1.b) * clampT),
  };
}

/**
 * Generate a rainbow color at fraction t (0..1).
 */
export function rainbowColor(t: number): RGBColor {
  const hue = ((t % 1) + 1) % 1; // 0..1
  const h = hue * 6;
  const x = (1 - Math.abs((h % 2) - 1)) * 255;
  let r = 0, g = 0, b = 0;
  if (h < 1) { r = 255; g = x; b = 0; }
  else if (h < 2) { r = x; g = 255; b = 0; }
  else if (h < 3) { r = 0; g = 255; b = x; }
  else if (h < 4) { r = 0; g = x; b = 255; }
  else if (h < 5) { r = x; g = 0; b = 255; }
  else { r = 255; g = 0; b = x; }
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
}

/**
 * Color a character or string with smooth gradient or preset color.
 */
export function colorize(text: string, colorInput: ColorInput | undefined, progress: number = 0): string {
  if (!colorInput) {
    return `${fgRgb(PRESET_COLORS.cyan)}${text}${ANSI_RESET}`;
  }

  if (colorInput === "rainbow") {
    return `${fgRgb(rainbowColor(progress))}${text}${ANSI_RESET}`;
  }

  if (colorInput === "gradient" || Array.isArray(colorInput)) {
    const start = Array.isArray(colorInput) ? parseColor(colorInput[0], PRESET_COLORS.cyan) : PRESET_COLORS.cyan;
    const end = Array.isArray(colorInput) ? parseColor(colorInput[1], PRESET_COLORS.magenta) : PRESET_COLORS.magenta;
    const interpolated = interpolateRgb(start, end, progress);
    return `${fgRgb(interpolated)}${text}${ANSI_RESET}`;
  }

  const rgb = parseColor(colorInput as string | RGBColor);
  return `${fgRgb(rgb)}${text}${ANSI_RESET}`;
}
