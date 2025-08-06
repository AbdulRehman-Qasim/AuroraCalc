function appendToDisplay(value) {
  document.getElementById("display").value += value;
}

function clearDisplay() {
  document.getElementById("display").value = "";
}

function deleteLast() {
  let display = document.getElementById("display").value;
  document.getElementById("display").value = display.slice(0, -1);
}

// 🔹 Load history from localStorage (or empty array)
let historyList = JSON.parse(localStorage.getItem("calcHistory")) || [];

// 🔹 Render history
function renderHistory() {
  document.getElementById("history").innerHTML = historyList
    .map((item, index) => {
      let expr = item.split(" = ")[0];
      return `<p class="history-item"
                 style="animation-delay:${index * 0.05}s"
                 onclick="reuseHistory('${expr}')">
                 ${item}
              </p>`;
    })
    .join("");
}

// 🔹 Update + save history
function updateHistory(expression, result) {
  historyList.unshift(`${expression} = ${result}`);
  if (historyList.length > 5) historyList.pop(); // Keep last 5

  localStorage.setItem("calcHistory", JSON.stringify(historyList)); // Save
  renderHistory();
}

// 🔹 Reuse past equation
function reuseHistory(expression) {
  document.getElementById("display").value = expression;
}

// 🔹 Clear history
function clearHistory() {
  historyList = [];
  localStorage.removeItem("calcHistory"); // Remove from storage
  renderHistory();
}

// ✅ Calculate + update history
function calculateResult() {
  try {
    let expression = document.getElementById("display").value;
    let result = eval(expression);
    document.getElementById("display").value = result;
    updateHistory(expression, result);
  } catch {
    document.getElementById("display").value = "Error";
  }
}

function toggleTheme() {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");

  const btn = document.querySelector(".theme-toggle");
  btn.textContent = document.body.classList.contains("light")
    ? "🌙 Dark Mode"
    : "☀️ Light Mode";
}

// 🌊 Ripple effect for buttons
document.querySelectorAll(".btn").forEach(button => {
  button.addEventListener("click", function (e) {
    let ripple = document.createElement("span");
    ripple.classList.add("ripple");

    let rect = this.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;

    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// 🎹 Keyboard support
document.addEventListener("keydown", function (e) {
  const key = e.key;
  if (/^[0-9+\-*/.]$/.test(key)) appendToDisplay(key);
  else if (key === "Enter" || key === "=") calculateResult();
  else if (key === "Backspace") deleteLast();
  else if (key === "Escape") clearDisplay();
});

// 📌 On page load, render saved history
document.addEventListener("DOMContentLoaded", renderHistory);

// Default theme
document.body.classList.add("dark");
