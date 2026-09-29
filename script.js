const input = document.getElementById("password");
const bar = document.getElementById("bar");
const label = document.getElementById("label");
const toggle = document.getElementById("toggle");
const generateBtn = document.getElementById("generate");
const rules = document.querySelectorAll("#rules li");

const levels = [
  { text: "Very weak", color: "#d64545", width: 20 },
  { text: "Weak", color: "#e8823a", width: 40 },
  { text: "Fair", color: "#e0b400", width: 60 },
  { text: "Strong", color: "#6cb33f", width: 80 },
  { text: "Very strong", color: "#1f9d55", width: 100 },
];

const checks = {
  length: (p) => p.length >= 8,
  lower: (p) => /[a-z]/.test(p),
  upper: (p) => /[A-Z]/.test(p),
  number: (p) => /\d/.test(p),
  symbol: (p) => /[^A-Za-z0-9]/.test(p),
};

function evaluate(password) {
  const results = {};
  let score = 0;
  for (const [name, test] of Object.entries(checks)) {
    results[name] = test(password);
    if (results[name]) score++;
  }
  // Bonus for long passwords, penalty for repeated characters
  if (password.length >= 12) score++;
  if (/(.)\1{2,}/.test(password)) score--;
  score = Math.max(0, Math.min(score, 5));
  return { results, level: Math.max(0, score - 1) };
}

function update() {
  const password = input.value;
  const { results, level } = evaluate(password);

  rules.forEach((li) => li.classList.toggle("ok", results[li.dataset.rule]));

  if (!password) {
    bar.style.width = "0";
    label.textContent = "Start typing…";
    label.style.color = "";
    return;
  }
  const info = levels[level];
  bar.style.width = info.width + "%";
  bar.style.backgroundColor = info.color;
  label.textContent = info.text;
  label.style.color = info.color;
}

toggle.addEventListener("click", () => {
  const show = input.type === "password";
  input.type = show ? "text" : "password";
  toggle.textContent = show ? "Hide" : "Show";
  toggle.setAttribute("aria-label", show ? "Hide password" : "Show password");
});

generateBtn.addEventListener("click", () => {
  const chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*?";
  const values = crypto.getRandomValues(new Uint32Array(16));
  input.value = Array.from(values, (v) => chars[v % chars.length]).join("");
  input.type = "text";
  toggle.textContent = "Hide";
  update();
});

input.addEventListener("input", update);