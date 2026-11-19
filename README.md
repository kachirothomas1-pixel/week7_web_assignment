# SpendWise – Interactive Budget Tracker

SpendWise is a simple personal budgeting dashboard built with HTML, CSS, and JavaScript. It lets a user set a monthly budget, record expenses, review spending progress, filter records, and remove expenses. Budget and expense data are saved in the browser with localStorage.

## Improvements made this week

- Added a monthly budget form and a live summary of budget, expenses, and remaining money.
- Added an expense form with name, amount, category, and date fields.
- Added a recent-expenses list with category icons, filtering, and a remove action.
- Added a progress bar and messages that change when spending approaches or exceeds the budget.
- Added localStorage so records remain available after refreshing the page.
- Improved the layout for desktop and mobile screens.

## JavaScript concepts implemented

### Conditionals
The `if / else if / else` statements in `updateDashboard()` check whether a budget has been entered, whether expenses exceed the budget, whether 80% or more has been used, or whether spending is still within a comfortable range. They display suitable feedback and change the progress bar style.

### Arrays
The `expenses` array stores multiple expense objects. Each object contains an ID, name, amount, category, and date. New records are added with `push()`, and records are removed with `filter()`.

### Loops
The `for...of` loop in `totalExpenses()` adds up all expense amounts. Another `for...of` loop in `renderExpenses()` creates a visible row for each expense record.

### DOM manipulation
The project uses `document.querySelector()` to select page elements and updates their `textContent`, classes, styles, and attributes. The expense list is built dynamically with `document.createElement()` and `append()`, so changes appear on the webpage without reloading.

### Events and user interaction
The budget and expense forms listen for the `submit` event. The category selector listens for `change`. The expense list uses a `click` event listener to handle remove buttons. `preventDefault()` stops forms from refreshing the page, and the application then validates input, updates the array, saves data, and refreshes the dashboard.

## Challenges and solutions

- **Keeping totals accurate:** totals are recalculated from the expenses array each time a record changes instead of maintaining separate expense variables.
- **Displaying changing records:** the expense list is rebuilt from the current array whenever the data or category filter changes.
- **Keeping data after refresh:** localStorage stores the budget and expense array; a safe JSON parsing function handles saved data.
- **Preventing invalid entries:** form validation checks for a name, a positive amount, a category, and a date before saving.

## Project files

- `index.html` – page structure and forms.
- `style.css` – dashboard layout, colours, and responsive styling.
- `script.js` – budget calculations, conditionals, arrays, loops, DOM updates, events, and localStorage.
- `README.md` – project overview and explanation of the JavaScript concepts.

## How to run

1. Download or clone this repository.
2. Open `index.html` in a web browser.
3. Enter a monthly budget.
4. Add expenses and try the category filter and Remove action.

No build tools or external JavaScript libraries are required.
