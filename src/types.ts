export type ChartType =
  | "sparkline"
  | "line"
  | "bar"
  | "hbar"
  | "hist"
  | "progress";

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export type ColorInput =
  | string
  | RGBColor
  | [string, string] // Gradient start and end
  | "rainbow"
  | "gradient"
  | "cyan"
  | "green"
  | "yellow"
  | "magenta"
  | "red"
  | "blue";

export interface BaseChartOptions {
  title?: string;
  color?: ColorInput;
  min?: number;
  max?: number;
}

export interface SparklineOptions extends BaseChartOptions {
  mode?: "block" | "braille";
  showMinMax?: boolean;
}

export interface LineChartOptions extends BaseChartOptions {
  width?: number; // character width (default 60)
  height?: number; // character height (default 12)
  xlabel?: string;
  ylabel?: string;
  legend?: string[];
  precision?: number;
}

export interface BarItem {
  label: string;
  value: number;
  color?: ColorInput;
}

export interface BarChartOptions extends BaseChartOptions {
  width?: number; // max bar length in characters (default 40)
  showValues?: boolean;
  showPercent?: boolean;
  barChar?: string;
  sort?: "asc" | "desc" | "none";
}

export interface HistogramOptions extends BaseChartOptions {
  bins?: number; // number of buckets (default 10)
  width?: number;
  showPercent?: boolean;
}

export interface ProgressOptions extends BaseChartOptions {
  width?: number;
  showPercent?: boolean;
  label?: string;
}
