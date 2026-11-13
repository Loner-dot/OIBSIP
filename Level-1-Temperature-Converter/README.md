# DEGREE. | Temperature Converter

A responsive temperature conversion instrument built with HTML5, CSS3 and vanilla JavaScript.

## Features

- Convert between Celsius, Fahrenheit and Kelvin.
- Live conversion as the value is entered.
- Switch the reference unit without reloading the page.
- Validates numeric input and rejects values below absolute zero.
- Copy individual converted values.
- Reset control and clear input feedback.
- Responsive layout, keyboard focus states and reduced-motion support.

## Run locally

Open `index.html` in a modern browser. No build tools, package installation or framework are required.

## Project structure

- `index.html` - semantic page structure and converter interface.
- `styles.css` - responsive visual system and component styling.
- `script.js` - conversion logic, validation and interactions.

## Conversion logic

All input values are normalized to Celsius before the three output values are calculated.

- Fahrenheit to Celsius: `(°F - 32) × 5 / 9`
- Kelvin to Celsius: `K - 273.15`
- Celsius to Fahrenheit: `(°C × 9 / 5) + 32`
- Celsius to Kelvin: `°C + 273.15`

Absolute zero is -273.15 °C, -459.67 °F or 0 K.

## Technology

HTML5 · CSS3 · Vanilla JavaScript

Created by REM for the Oasis Infobyte Web Development & Design internship, Level 1.