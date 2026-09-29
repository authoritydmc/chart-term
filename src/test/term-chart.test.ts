import test from "node:test";
import assert from "node:assert";
import {
  sparkline,
  lineChart,
  barChart,
  histogram,
  progressBar,
  parseInputData,
  renderChart,
} from "../index.js";

test("sparkline renders block characters for number series", () => {
  const result = sparkline([1, 2, 5, 8, 3, 7]);
  assert.ok(result.length > 0);
  assert.ok(result.includes("█") || result.includes("▄") || result.includes("▂"));
});

test("lineChart renders Braille line with Y and X axes", () => {
  const result = lineChart([10, 25, 15, 40, 30, 60], {
    title: "CPU Load",
    width: 30,
    height: 6,
  });
  assert.ok(result.includes("CPU Load"));
  assert.ok(result.includes("│"));
  assert.ok(result.includes("└"));
});

test("barChart renders horizontal bars with labels and values", () => {
  const items = [
    { label: "Chrome", value: 65 },
    { label: "Safari", value: 19 },
    { label: "Firefox", value: 6 },
  ];
  const result = barChart(items, { showPercent: true, sort: "desc" });
  assert.ok(result.includes("Chrome"));
  assert.ok(result.includes("█"));
  assert.ok(result.includes("%"));
});

test("histogram buckets data accurately", () => {
  const data = [1, 2, 2, 3, 3, 3, 4, 4, 5, 8, 9, 10];
  const result = histogram(data, { bins: 4 });
  assert.ok(result.includes("Frequency Distribution"));
  assert.ok(result.includes("█"));
});

test("progressBar renders compact gauge", () => {
  const result = progressBar(75, 100, { label: "Battery" });
  assert.ok(result.includes("Battery"));
  assert.ok(result.includes("75.0%"));
});

test("parseInputData parses raw text, CSV, and JSON", () => {
  // Raw numbers
  const r1 = parseInputData("10 20 30.5 40");
  assert.deepStrictEqual(r1.numbers, [10, 20, 30.5, 40]);

  // JSON Array
  const r2 = parseInputData("[5, 15, 25]");
  assert.deepStrictEqual(r2.numbers, [5, 15, 25]);

  // JSON Object
  const r3 = parseInputData('{"US": 100, "EU": 80}');
  assert.strictEqual(r3.isLabeled, true);
  assert.strictEqual(r3.items?.length, 2);

  // CSV
  const r4 = parseInputData("Browser,Share\nChrome,65\nSafari,20");
  assert.strictEqual(r4.isLabeled, true);
  assert.strictEqual(r4.items?.[0].label, "Chrome");
  assert.strictEqual(r4.items?.[0].value, 65);
});

test("renderChart auto-detects and renders appropriately", () => {
  const res1 = renderChart([10, 20, 30], { type: "sparkline" });
  assert.ok(res1.length > 0);

  const res2 = renderChart("A,10\nB,20");
  assert.ok(res2.includes("█"));
});
