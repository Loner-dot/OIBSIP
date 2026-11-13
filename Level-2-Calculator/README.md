# TALLY° | Browser Calculator

A responsive browser-based calculator built for Oasis Infobyte Web Development & Designing, Level 2, Task 1.

## Features
- Addition, subtraction, multiplication and division
- Decimal input and parentheses
- Operator chaining with normal mathematical precedence
- Live result preview while entering an expression
- Clear and backspace controls
- Division-by-zero and invalid-expression handling
- Keyboard support: numbers and operators, Enter to solve, Backspace to delete, Escape to clear
- Responsive layout for mobile and desktop

## Tech stack
- HTML5
- CSS3 with CSS Grid
- Vanilla JavaScript

## Run locally
Open index.html in a modern browser. No build tools or dependencies are required.

## Implementation notes
The calculator uses event delegation and addEventListener, with no inline event handlers. Expressions are evaluated by a small recursive-descent parser that handles operator precedence and parentheses. It does not use JavaScript eval().

## Author
EDEMACKSON EMMANUEL
