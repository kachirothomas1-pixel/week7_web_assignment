// SpendWise - interactive personal budget tracker
const STORAGE_KEYS = { budget: "spendwise-budget", expenses: "spendwise-expenses" };
const money = new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", minimumFractionDigits: 2 });
const $ = (selector) => document.querySelector(selector);

let budget = Number(localStorage.getItem(STORAGE_KEYS.budget)) || 0;
let expenses = loadExpenses();

function loadExpenses() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.expenses) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error("Could not read saved expenses:", error);
    return [];
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEYS.budget, String(budget));
  localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(expenses));
}

function totalExpenses() {
  let total = 0;
  // Loop through every expense record to calculate the total.
  for (const expense of expenses) total += Number(expense.amount);
  return total;
}

function updateDashboard() {
  const spent = totalExpenses();
  const remaining = budget - spent;
  const percentage = budget > 0 ? Math.round((spent / budget) * 100) : 0;

  $("#budget-total").textContent = money.format(budget);
  $("#spent-total").textContent = money.format(spent);
  $("#remaining-total").textContent = money.format(remaining);
  $("#remaining-total").classList.toggle("negative", remaining < 0);
  $("#progress-percent").textContent = budget > 0 ? percentage + "%" : "0%";
  $("#progress-fill").style.width = Math.min(percentage, 100) + "%";
  $("#progress-fill").className = "progress-fill" + (percentage >= 100 ? " over" : percentage >= 80 ? " warning" : "");
  $("#progress-bar").setAttribute("aria-valuenow", String(Math.min(percentage, 100)));

  const status = $("#budget-status");
  status.className = "status-message";
  // Conditional statements provide feedback based on the budget situation.
  if (budget <= 0) {
    status.textContent = "Set your monthly budget to start tracking your spending.";
  } else if (spent > budget) {
    status.textContent = "You are over budget by " + money.format(spent - budget) + ". Review your expenses.";
    status.classList.add("over");
  } else if (percentage >= 80) {
    status.textContent = "You have used " + percentage + "% of your budget. Spend carefully.";
    status.classList.add("warning");
  } else {
    status.textContent = "Good progress! You have " + money.format(remaining) + " available.";
  }
  renderExpenses();
}

function renderExpenses() {
  const list = $("#expense-list");
  const filter = $("#category-filter").value;
  const visibleExpenses = expenses.filter((expense) => filter === "All" || expense.category === filter);
  $("#expense-count").textContent = expenses.length + (expenses.length === 1 ? " record" : " records");
  list.replaceChildren();

  if (visibleExpenses.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    const title = document.createElement("strong");
    const message = document.createElement("p");
    title.textContent = expenses.length ? "No matching expenses" : "No expenses yet";
    message.textContent = expenses.length ? "Try selecting another category." : "Your added expenses will appear here.";
    empty.append(title, message);
    list.append(empty);
    return;
  }

  // Loop through the array and create a dashboard row for each record.
  for (const expense of [...visibleExpenses].reverse()) {
    const item = document.createElement("article");
    item.className = "expense-item";
    const icon = document.createElement("span");
    icon.className = "category-icon";
    icon.textContent = ({ Food: "🍎", Transport: "🚌", Bills: "💡", Shopping: "🛍️", Education: "📚", Health: "🩺", Other: "📌" })[expense.category] || "📌";
    const info = document.createElement("div");
    info.className = "expense-info";
    const name = document.createElement("strong");
    name.textContent = expense.name;
    const meta = document.createElement("span");
    meta.className = "expense-meta";
    meta.textContent = expense.category + " · " + expense.date;
    info.append(name, meta);
    const side = document.createElement("div");
    side.className = "expense-side";
    const amount = document.createElement("span");
    amount.className = "expense-amount";
    amount.textContent = money.format(expense.amount);
    const remove = document.createElement("button");
    remove.className = "delete-button";
    remove.type = "button";
    remove.dataset.id = expense.id;
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", "Remove " + expense.name);
    side.append(amount, remove);
    item.append(icon, info, side);
    list.append(item);
  }
}

function showFeedback(selector, message, type) {
  const element = $(selector);
  element.textContent = message;
  element.className = "feedback" + (type ? " " + type : "");
}

$("#budget-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const value = Number($("#budget-input").value);
  if (!Number.isFinite(value) || value <= 0) {
    showFeedback("#budget-feedback", "Please enter a budget greater than zero.", "error");
    return;
  }
  budget = value;
  saveData();
  updateDashboard();
  showFeedback("#budget-feedback", "Your monthly budget has been saved.", "success");
  $("#budget-input").value = "";
});

$("#expense-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("#expense-name").value.trim();
  const amount = Number($("#expense-amount").value);
  const category = $("#expense-category").value;
  const date = $("#expense-date").value;

  if (!name || !Number.isFinite(amount) || amount <= 0 || !category || !date) {
    showFeedback("#expense-feedback", "Please complete all fields with valid information.", "error");
    return;
  }

  expenses.push({ id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random())), name, amount, category, date });
  saveData();
  updateDashboard();
  $("#expense-form").reset();
  $("#expense-date").value = new Date().toISOString().slice(0, 10);
  showFeedback("#expense-feedback", "Expense added successfully.", "success");
});

$("#expense-list").addEventListener("click", (event) => {
  const button = event.target.closest(".delete-button");
  if (!button) return;
  expenses = expenses.filter((expense) => expense.id !== button.dataset.id);
  saveData();
  updateDashboard();
});

$("#category-filter").addEventListener("change", renderExpenses);
$("#clear-filter").addEventListener("click", () => {
  $("#category-filter").value = "All";
  renderExpenses();
});

$("#today-label").textContent = new Intl.DateTimeFormat("en-KE", { dateStyle: "full" }).format(new Date());
$("#expense-date").value = new Date().toISOString().slice(0, 10);
updateDashboard();
