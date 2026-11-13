# DEGREE° | Temperature Converter

A mobile-first temperature conversion instrument with a custom glassmorphism visual system. Built with semantic HTML, CSS and vanilla JavaScript.

## Features

- Live conversion between Celsius, Fahrenheit and Kelvin.
- Switch the reference unit without reloading.
- Rejects values below absolute zero.
- Copy any converted reading.
- Reset control, clear status feedback and responsive layout.
- Keyboard focus states and reduced-motion support.
- No framework, build step or package installation required.

## Run

Open `index.html` in a modern browser.

## Files

- `index.html` - accessible interface structure.
- `styles.css` - atmospheric background, layered glass surfaces, responsive layout and interaction states.
- `script.js` - conversion formulas, validation and clipboard behavior.

## Conversion formulas

All values are normalized through Celsius.

- °F to °C: `(°F - 32) × 5 / 9`
- K to °C: `K - 273.15`
- °C to °F: `(°C × 9 / 5) + 32`
- °C to K: `°C + 273.15`

Absolute zero is -273.15 °C, -459.67 °F or 0 K.

## Technology

HTML5 · CSS3 · Vanilla JavaScript

Created by REM for the Oasis Infobyte Web Development & Design internship, Level 1.