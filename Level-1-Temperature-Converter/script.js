const input = document.querySelector("#temperatureInput");
const unitButtons = [...document.querySelectorAll(".unit-button")];
const unitSymbol = document.querySelector("#inputUnitSymbol");
const errorMessage = document.querySelector("#errorMessage");
const inputHint = document.querySelector("#inputHint");
const statusText = document.querySelector("#statusText");
const resetButton = document.querySelector("#resetButton");
const outputs = {
  C: document.querySelector("#resultC"),
  F: document.querySelector("#resultF"),
  K: document.querySelector("#resultK")
};
const symbols = { C: "°C", F: "°F", K: "K" };
const names = { C: "Celsius", F: "Fahrenheit", K: "Kelvin" };
let activeUnit = "C";
let latestValues = null;

function formatNumber(value) {
  const normalized = Math.abs(value) < 1e-10 ? 0 : value;
  return new Intl.NumberFormat("en", { maximumFractionDigits: 4 }).format(normalized);
}
function toCelsius(value, unit) {
  if (unit === "F") return (value - 32) * 5 / 9;
  if (unit === "K") return value - 273.15;
  return value;
}
function convert(value, unit) {
  const celsius = toCelsius(value, unit);
  return { C: celsius, F: celsius * 9 / 5 + 32, K: celsius + 273.15 };
}
function clearResults() {
  outputs.C.innerHTML = "--<small>°C</small>";
  outputs.F.innerHTML = "--<small>°F</small>";
  outputs.K.innerHTML = "--<small>K</small>";
  latestValues = null;
  statusText.textContent = "STANDBY";
}
function showError(message) {
  errorMessage.textContent = message;
  clearResults();
  statusText.textContent = "CHECK INPUT";
}
function render() {
  errorMessage.textContent = "";
  const raw = input.value.trim();
  if (!raw) {
    clearResults();
    inputHint.textContent = "Waiting for your reading";
    return;
  }
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    showError("Please enter a valid number.");
    return;
  }
  const celsius = toCelsius(value, activeUnit);
  if (celsius < -273.15 - 1e-10) {
    const minimum = activeUnit === "C" ? "−273.15 °C" : activeUnit === "F" ? "−459.67 °F" : "0 K";
    showError("That is below absolute zero. Minimum: " + minimum + ".");
    return;
  }
  latestValues = convert(value, activeUnit);
  for (const unit of ["C", "F", "K"]) {
    outputs[unit].innerHTML = formatNumber(latestValues[unit]) + "<small>" + symbols[unit] + "</small>";
    document.querySelector('[data-result="' + unit + '"]').classList.toggle("is-active", unit === activeUnit);
  }
  inputHint.textContent = "Reading interpreted in " + names[activeUnit];
  statusText.textContent = "CONVERSION READY";
}
function selectUnit(unit) {
  activeUnit = unit;
  unitSymbol.textContent = symbols[unit];
  unitButtons.forEach(button => {
    const selected = button.dataset.unit === unit;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  render();
}
unitButtons.forEach(button => button.addEventListener("click", () => selectUnit(button.dataset.unit)));
input.addEventListener("input", render);
resetButton.addEventListener("click", () => {
  input.value = "";
  selectUnit("C");
  input.focus();
});
document.querySelectorAll(".copy-button").forEach(button => {
  button.addEventListener("click", async () => {
    if (!latestValues) {
      errorMessage.textContent = "Enter a temperature before copying a result.";
      return;
    }
    const unit = button.dataset.copy;
    const value = formatNumber(latestValues[unit]) + " " + symbols[unit];
    try {
      await navigator.clipboard.writeText(value);
      const original = button.textContent;
      button.textContent = "COPIED ✓";
      window.setTimeout(() => button.textContent = original, 1300);
    } catch {
      errorMessage.textContent = "Clipboard access is unavailable. You can select the displayed value instead.";
    }
  });
});
clearResults();