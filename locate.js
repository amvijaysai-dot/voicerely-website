const fs = require("fs");
const path = require("path");

// 1) Find hidden-cost CSS across css/ and any <style> in html
const cssDir = "css";
if (fs.existsSync(cssDir)) {
  for (const f of fs.readdirSync(cssDir)) {
    if (!f.endsWith(".css")) continue;
    const txt = fs.readFileSync(path.join(cssDir, f), "utf8");
    if (txt.includes("hidden-cost")) {
      const idx = txt.indexOf("hidden-cost");
      console.log("CSS FILE:", f, "first occurrence at", idx);
      console.log(txt.slice(Math.max(0, idx - 40), idx + 200).replace(/\n/g, " ⏎ "));
      console.log("---");
    }
  }
}

// 2) Find the hidden-cost section in index.html with line numbers
const html = fs.readFileSync("index.html", "utf8");
const lines = html.split("\n");
lines.forEach((ln, i) => {
  if (ln.includes("hidden-cost")) {
    console.log("HTML line", i + 1, ":", ln.trim().slice(0, 80));
  }
});