import { Command } from "commander";
import { renderChart, parseInputData } from "./index.js";
import { ChartType } from "./types.js";
import fs from "fs";

async function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    if (process.stdin.isTTY) {
      resolve("");
      return;
    }

    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => {
      resolve(data.trim());
    });
    setTimeout(() => {
      if (!data) resolve("");
    }, 100);
  });
}

async function main() {
  const program = new Command();

  program
    .name("term-chart")
    .description(
      "High-fidelity inline terminal charts, sparklines, line plots, and bar graphs with Unicode Braille and Truecolor gradients."
    )
    .version("1.0.0", "-v, --version", "Output current version")
    .argument("[data...]", "Numeric data points, file path, or JSON input")
    .option("-t, --type <type>", "Chart type (line, sparkline, bar, hbar, hist, progress)", "auto")
    .option("-c, --color <color>", "Color or gradient (cyan, green, yellow, magenta, red, blue, rainbow, gradient, or hex #rrggbb)", "cyan")
    .option("-H, --height <number>", "Chart height in lines", (val) => parseInt(val, 10))
    .option("-W, --width <number>", "Chart width in characters", (val) => parseInt(val, 10))
    .option("--title <string>", "Chart title header")
    .option("--xlabel <string>", "X-axis label")
    .option("--ylabel <string>", "Y-axis label")
    .option("--min <number>", "Minimum value for scaling", (val) => parseFloat(val))
    .option("--max <number>", "Maximum value for scaling", (val) => parseFloat(val))
    .option("--sort <order>", "Sort order for bar charts (asc, desc, none)", "none")
    .option("--percent", "Show percentage indicators", false)
    .option("--bins <number>", "Number of bins for histogram", (val) => parseInt(val, 10), 8)
    .action(async (dataArgs, options) => {
      try {
        let rawInput = "";

        if (dataArgs && dataArgs.length > 0) {
          // Check if first arg is an existing file
          if (dataArgs.length === 1 && fs.existsSync(dataArgs[0])) {
            rawInput = fs.readFileSync(dataArgs[0], "utf-8");
          } else {
            rawInput = dataArgs.join(" ");
          }
        } else {
          rawInput = await readStdin();
        }

        if (!rawInput) {
          program.help();
          process.exit(1);
        }

        const chartType = options.type === "auto" ? undefined : (options.type as ChartType);

        const result = renderChart(rawInput, {
          type: chartType,
          color: options.color,
          height: options.height,
          width: options.width,
          title: options.title,
          xlabel: options.xlabel,
          ylabel: options.ylabel,
          min: options.min,
          max: options.max,
          sort: options.sort,
          showPercent: options.percent,
          bins: options.bins,
        });

        console.log(result);
      } catch (err: any) {
        console.error(`\x1b[31mError: ${err.message || err}\x1b[0m`);
        process.exit(1);
      }
    });

  await program.parseAsync(process.argv);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
