// Calculator with a hidden "secret stash" vault — pure vanilla JS.
const display = document.getElementById("display");
const buttons = document.querySelectorAll(".calc-body button");
const toggleBtn = document.getElementById("toggle-btn");

const stash = document.getElementById("stash");
const stashNotes = document.getElementById("stash-notes");
const stashSave = document.getElementById("stash-save");
const stashLock = document.getElementById("stash-lock");

const PIN_KEY = "stash_pin";
const NOTES_KEY = "stash_notes";

let expr = "";

// ---------- calculator ----------
function render() {
  display.value = expr;
}

function flash(msg) {
  const prev = expr;
  display.value = msg;
  setTimeout(() => {
    display.value = prev;
  }, 1100);
}

function evaluate() {
  if (!expr) return;
  // allow only safe characters before evaluating
  const safe = expr.replace(/[^0-9+\-*/%.() ]/g, "");
  try {
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + safe + ")")();
    if (result === undefined || Number.isNaN(result) || !Number.isFinite(result)) {
      flash("Error");
      expr = "";
    } else {
      expr = String(Math.round((result + Number.EPSILON) * 1e10) / 1e10);
    }
  } catch (e) {
    flash("Error");
    expr = "";
  }
  render();
}

function press(label) {
  switch (label) {
    case "AC":
      expr = "";
      break;
    case "<":
      expr = expr.slice(0, -1);
      break;
    case "=":
      evaluate();
      return;
    case "S":
      openStash();
      return;
    default:
      expr += label;
  }
  render();
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => press(btn.textContent.trim()));
});

// keyboard support
window.addEventListener("keydown", (e) => {
  const k = e.key;
  if (/[0-9+\-*/.%]/.test(k) && k.length === 1) {
    expr += k;
    render();
  } else if (k === "Enter" || k === "=") {
    e.preventDefault();
    evaluate();
  } else if (k === "Backspace") {
    expr = expr.slice(0, -1);
    render();
  } else if (k === "Escape") {
    expr = "";
    render();
  }
});

// ---------- theme toggle ----------
function applyTheme(dark) {
  document.body.classList.toggle("dark", dark);
  toggleBtn.textContent = dark ? "☀" : "☾";
  localStorage.setItem("calc_theme", dark ? "dark" : "light");
}
toggleBtn.addEventListener("click", () =>
  applyTheme(!document.body.classList.contains("dark"))
);
applyTheme(localStorage.getItem("calc_theme") === "dark");

// ---------- secret stash ----------
// Type a numeric PIN on the keypad, then press "S".
//  - first ever: that number becomes your PIN
//  - later: the correct PIN unlocks the stash; a wrong one is denied
function openStash() {
  const savedPin = localStorage.getItem(PIN_KEY);
  const entered = expr.replace(/[^0-9]/g, "");

  if (!savedPin) {
    if (entered.length < 4) {
      flash("Set 4+ digit PIN");
      return;
    }
    localStorage.setItem(PIN_KEY, entered);
    expr = "";
    render();
    flash("PIN set 🔒");
    return;
  }

  if (entered === savedPin) {
    expr = "";
    render();
    unlockStash();
  } else {
    expr = "";
    render();
    flash("Access denied");
  }
}

function unlockStash() {
  stashNotes.value = localStorage.getItem(NOTES_KEY) || "";
  stash.hidden = false;
}

stashSave.addEventListener("click", () => {
  localStorage.setItem(NOTES_KEY, stashNotes.value);
  stashSave.textContent = "Saved ✓";
  setTimeout(() => (stashSave.textContent = "Save"), 1000);
});

stashLock.addEventListener("click", () => {
  stash.hidden = true;
});

render();
