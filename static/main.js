"use strict";

// Add the model URLs when the checkpoints are published.
const checkpointUrls = { sam3: "", sam21: "" };
for (const link of document.querySelectorAll("[data-checkpoint]")) {
  const url = checkpointUrls[link.dataset.checkpoint];
  if (url) {
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.removeAttribute("aria-disabled");
    link.removeAttribute("title");
    link.querySelector("span").textContent = "Download ↗";
  }
}

const promptResults = {
  mask: [[92.2, 8.4], [89.7, 14.0], [60.3, 24.6], [78.4, 21.1]],
  point: [[72.1, 7.1], [80.0, 10.3], [55.8, 19.9], [70.1, 18.3]],
  box: [[89.1, 7.6], [86.8, 12.7], [58.9, 23.5], [77.0, 20.2]],
  language: [[29.3, 0.1], [60.7, 8.5], [50.2, 0.3], [70.5, 9.1], [33.5, 1.9], [60.2, 18.4]],
};
const vosLabels = Array.from(document.querySelectorAll(".bar-group h4"), heading => heading.innerHTML);
const languageLabels = ["SA-V · cgF1", "SA-V · pHOTA", "YT-Temporal-1B · cgF1", "YT-Temporal-1B · pHOTA", "SmartGlasses · cgF1", "SmartGlasses · pHOTA"];
const promptButtons = document.querySelectorAll("[data-prompt]");
for (const button of promptButtons) {
  button.addEventListener("click", () => {
    for (const item of promptButtons) item.setAttribute("aria-pressed", String(item === button));
    const prompt = button.dataset.prompt;
    const labels = prompt === "language" ? languageLabels : vosLabels;
    document.getElementById("prompt-description").textContent = prompt === "language"
      ? "SAM3 · Language prompt · SA-Co/VEval benchmarks"
      : `SAM3 · ${button.textContent} prompt · VOS benchmarks`;
    document.getElementById("prompt-results").innerHTML = promptResults[prompt].map((scores, index) => `
      <div class="bar-group"><h4>${labels[index]}</h4>${scores.map((score, i) => `
        <div class="bar-row"><span>${i === 0 ? "Clean" : "AUV"}</span><div class="track"><div class="bar ${i === 0 ? "clean" : "attack"}" style="width:${score}%"></div></div><output>${score.toFixed(1)}</output></div>
      `).join("")}</div>
    `).join("");
  });
}

const dialog = document.getElementById("figure-dialog");
const enlargedFigure = document.getElementById("enlarged-figure");
for (const button of document.querySelectorAll("[data-zoom]")) {
  button.addEventListener("click", () => {
    const figure = button.querySelector("img");
    enlargedFigure.src = figure.src;
    enlargedFigure.alt = figure.alt;
    dialog.showModal();
  });
}
document.getElementById("close-figure").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  }
});

document.getElementById("copy-citation").addEventListener("click", async () => {
  const citation = document.getElementById("bibtex");
  const status = document.getElementById("copy-status");
  try {
    await navigator.clipboard.writeText(citation.textContent);
    status.textContent = "BibTeX copied.";
  } catch {
    const range = document.createRange();
    range.selectNodeContents(citation);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = "Citation selected. Press Ctrl+C or ⌘C to copy.";
  }
});
