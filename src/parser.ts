import { BarItem } from "./types.js";

export interface ParsedData {
  numbers: number[];
  items?: BarItem[];
  isLabeled: boolean;
}

/**
 * Parses input text (numbers, CSV, JSON, NDJSON) into structured numbers or labeled items.
 */
export function parseInputData(raw: string): ParsedData {
  const text = raw.trim();
  if (!text) {
    return { numbers: [], isLabeled: false };
  }

  // 1. Try parsing JSON
  if (text.startsWith("[") || text.startsWith("{")) {
    try {
      const parsed = JSON.parse(text);

      if (Array.isArray(parsed)) {
        if (parsed.length > 0 && typeof parsed[0] === "number") {
          return { numbers: parsed as number[], isLabeled: false };
        }
        if (parsed.length > 0 && typeof parsed[0] === "object") {
          const items: BarItem[] = [];
          const numbers: number[] = [];
          for (const obj of parsed) {
            const keys = Object.keys(obj);
            const labelKey = keys.find((k) => typeof obj[k] === "string") || keys[0];
            const valKey = keys.find((k) => typeof obj[k] === "number") || keys[1];
            if (valKey && typeof obj[valKey] === "number") {
              const val = obj[valKey];
              items.push({ label: String(obj[labelKey] || `#${items.length + 1}`), value: val });
              numbers.push(val);
            }
          }
          if (items.length > 0) {
            return { numbers, items, isLabeled: true };
          }
        }
      } else if (typeof parsed === "object" && parsed !== null) {
        const items: BarItem[] = [];
        const numbers: number[] = [];
        for (const [key, val] of Object.entries(parsed)) {
          if (typeof val === "number") {
            items.push({ label: key, value: val });
            numbers.push(val);
          }
        }
        return { numbers, items, isLabeled: true };
      }
    } catch {
      // Fallback to text parser
    }
  }

  // 2. Check for CSV / TSV format
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length > 1 && (lines[0].includes(",") || lines[0].includes("\t"))) {
    const delimiter = lines[0].includes("\t") ? "\t" : ",";
    const header = lines[0].split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, ""));
    const firstRowCols = lines[1].split(delimiter);

    // If second row has non-numeric label column + numeric column
    const hasLabeledRows = firstRowCols.some((col) => isNaN(Number(col)));
    if (hasLabeledRows) {
      const labelColIdx = firstRowCols.findIndex((col) => isNaN(Number(col)));
      const numColIdx = firstRowCols.findIndex((col) => !isNaN(Number(col)) && col.trim() !== "");

      if (numColIdx !== -1) {
        const items: BarItem[] = [];
        const numbers: number[] = [];
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(delimiter);
          const label = parts[labelColIdx]?.trim().replace(/^["']|["']$/g, "") || `#${i}`;
          const val = parseFloat(parts[numColIdx]);
          if (!isNaN(val)) {
            items.push({ label, value: val });
            numbers.push(val);
          }
        }
        return { numbers, items, isLabeled: true };
      }
    }
  }

  // 3. Fallback: Parse all extracted floating-point numbers
  const tokens = text.split(/[\s,;|]+/);
  const numbers: number[] = [];
  for (const token of tokens) {
    const val = parseFloat(token);
    if (!isNaN(val)) {
      numbers.push(val);
    }
  }

  return { numbers, isLabeled: false };
}
