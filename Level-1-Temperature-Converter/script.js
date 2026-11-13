const input = document.querySelector("#temperatureInput");
const unitButtons = [...document.querySelectorAll(".unit-option")];
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
const labels = { C: "CELSIUS", F: "FAHRENHEIT", K: "KELVIN" };
let activeUnit = "C";
let latestValues = null;

function formatNumber(value) {
  const safeValue = Math.abs(value) < 0.0000001 ? 0 : value;
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 4,
    minimumFractionDigits: 0
  }).format(safeValue);
}

function toCelsius(value, unit) {
  if (unit === "F") return (value - 32) * 5 / 9;
  if (unit === "K") return value - 273.15;
  return value;
}

function convert(value, unit) {
  const celsius = toCelsius(value, unit);
  return {
    C: celsius,
    F: (celsius * 9 / 5) + 32,
    K: celsius + 273.15
  };
}

function showEmpty() {
  Object.values(outputs).forEach(output => output.innerHTML = "--<span>°</span>");
  outputs.K.innerHTML = "--<span>K</span>";
  latestValues = null;
  statusText.textContent = "AWAITING INPUT";
  inputHint.textContent = "Enter a value to begin";
}

function showError(message) {
  errorMessage.textContent = message;
  showEmpty();
  statusText.textContent = "CHECK INPUT";
}

function render() {
  errorMessage.textContent = "";
  const raw = input.value.trim();
  if (raw === "") {
    showEmpty();
    return;
  }
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    showError("Enter a valid number to convert.");
    return;
  }
  const celsius = toCelsius(value, activeUnit);
  if (celsius < -273.15 - 1e-10) {
    const minimum = activeUnit === "C" ? "−273.15 °C" : activeUnit === "F" ? "−459.67 °F" : "0 K";
    showError("Below absolute zero. The minimum is " + minimum + ".");
    return;
  }
  const converted = convert(value, activeUnit);
  latestValues = converted;
  for (const unit of ["C", "F", "K"]) {
    outputs[unit].innerHTML = formatNumber(converted[unit]) + "<span>" + (unit === "K" ? "K" : "°") + "</span>";
    document.querySelector('[data-result="' + unit + '"]').classList.toggle("result-primary", unit === activeUnit);
  }
  inputHint.textContent = "Showing " + labels[activeUnit].toLowerCase() + " as your reference";
  statusText.textContent = "CONVERSION COMPLETE";
}

function selectUnit(unit) {
  activeUnit = unit;
  unitSymbol.textContent = symbols[unit];
  unitButtons.forEach(button => {
    const selected = button.dataset.unit === unit;
    button.classList.toggle("active", selected);
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
    const text = formatNumber(latestValues[unit]) + " " + symbols[unit];
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "COPIED ✓";
      window.setTimeout(() => button.textContent = "COPY ↗", 1400);
    } catch {
      errorMessage.textContent = "Copy is unavailable in this browser. You can select the result manually.";
    }
  });
});

showEmpty();