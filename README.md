# chart-term 📊

[![CI](https://github.com/authoritydmc/chart-term/actions/workflows/ci.yml/badge.svg)](https://github.com/authoritydmc/chart-term/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/chart-term.svg?style=flat&color=brightgreen)](https://www.npmjs.com/package/chart-term)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

> **High-fidelity inline terminal charts, sparklines, line plots, and bar graphs** with Unicode Braille (2x4 subpixels), box-drawing axes, and 24-bit Truecolor gradients across macOS, Linux, and Windows.

Designed both as an **interactive CLI tool** (`chart-term` / `chartx`) and an **embeddable library** for monitoring scripts, DevOps pipelines, metrics loggers, and CLI dashboards.

---

## ✨ Features

- 📈 **High-Resolution 2D Line Plots**: 2x4 subpixel precision per character cell using Unicode Braille (`⠡⠤⠒⠊`) with auto-scaled axes, Y-axis metric units (K, M), and box-drawing frames (`│`, `─`, `└`).
- ⚡ **Inline Sparklines**: Compact 8-level vertical blocks (` ▂▃▄▅▆▇█`) for inline log streams and status lines.
- 📊 **Horizontal Bar Charts**: ANSI truecolor bars with sub-character fractional blocks (`▏▎▍▌▋▊▉█`), percentage indicators, and sorting.
- 📉 **Histograms**: Automatic statistical frequency distribution bucketing.
- ⏱️ **Gauge & Progress Bars**: Compact progress bars for CLI tools and batch operations.
- 🌈 **Truecolor Gradients**: Smooth color interpolation (cyan, green, yellow, magenta, rainbow, or custom hex `#rrggbb`).
- 🚰 **Pipe-Friendly CLI**: Ingest raw numbers, CSV, TSV, JSON arrays, and NDJSON streams directly from stdin.
- 📦 **Zero Native Dependencies**: 100% pure TypeScript/JavaScript.

---

## 🚀 Installation

### Global CLI Tool
```bash
npm install -g chart-term
# or run directly with npx
npx chart-term 10 25 18 42 30 55
# or using short alias
npx chartx 10 25 18 42 30 55
```

### In Your Project (Library)
```bash
npm install chart-term
```

---

## 🛠️ CLI Usage & Examples

### 1. 2D Line Chart from Numbers or Stdin
```bash
chartx 12 18 25 42 38 55 68 74 62 85 99 --title "Traffic Spike" --color rainbow
```

### 2. Piped CSV / TSV Metrics
```bash
cat metrics.csv | chartx --type bar --color gradient --sort desc --percent
```

### 3. Inline Sparklines
```bash
echo "1 5 2 8 3 7 4 9 6" | chartx --type sparkline --color gradient
```

### 4. JSON / API Streams
```bash
curl -s https://api.sampleapis.com/bitcoin/historical | jq '.[].price' | chartx --height 10 --color cyan
```

### 5. Histogram Frequency Distribution
```bash
seq 1 100 | awk '{print rand()*100}' | chartx --type hist --bins 6 --color magenta
```

---

## 📖 Programmatic Library API (TypeScript & JavaScript)

```typescript
import { lineChart, sparkline, barChart, histogram, progressBar } from "chart-term";

// 1. High-Density Braille Line Plot
console.log(
  lineChart([10, 25, 18, 42, 30, 65, 80], {
    title: "Server CPU Load",
    width: 50,
    height: 10,
    color: "gradient",
    xlabel: "Time (minutes)",
  })
);

// 2. Inline Sparkline
console.log(
  sparkline([5, 12, 8, 19, 24, 32, 18, 40], {
    title: "Request Latency:",
    color: "cyan",
    showMinMax: true,
  })
);

// 3. Bar Chart
console.log(
  barChart(
    {
      "US-East": 4500,
      "EU-Central": 3200,
      "AP-South": 1800,
    },
    {
      sort: "desc",
      showPercent: true,
      color: "rainbow",
    }
  )
);

// 4. Progress / Metric Bar
console.log(progressBar(85, 100, { label: "Disk Usage:", color: "green" }));
```

---

## ⚙️ Options Reference

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `type` | `"line" \| "sparkline" \| "bar" \| "hbar" \| "hist" \| "progress"` | `"auto"` | Chart format |
| `color` | `string \| [string, string]` | `"cyan"` | Preset (`rainbow`, `gradient`, `cyan`, etc.) or Hex |
| `width` | `number` | `60` (line) / `40` (bar) | Chart width in characters |
| `height` | `number` | `10` | Line chart height in lines |
| `title` | `string` | `undefined` | Header title |
| `xlabel` | `string` | `undefined` | X-axis footer label |
| `ylabel` | `string` | `undefined` | Y-axis header label |
| `min` / `max` | `number` | `auto` | Scaling bounds |
| `sort` | `"asc" \| "desc" \| "none"` | `"none"` | Bar chart sorting |
| `bins` | `number` | `8` | Histogram bucket count |

---

## 🧪 Development & Testing

```bash
git clone https://github.com/authoritydmc/chart-term.git
cd chart-term
npm install
npm test
npm run build
```

---

## 🚀 Automated Release & Versioning

### 1-Click from GitHub Actions
Go to **Actions** -> **Automated Version & Release** -> Select `patch`, `minor`, or `major` -> Click **Run workflow**.

### From Terminal
```bash
npm run release:patch
npm run release:minor
npm run release:major
```

---

## 📄 License

[MIT](LICENSE) © 2026 authoritydmc
