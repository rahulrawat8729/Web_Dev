// ===== Smooth Scrolling =====
// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// ===== Typing Animation for Hero Section =====
const text = "Rahul Rawat";
let i = 0;
const speed = 150;
const nameSpan = document.querySelector(".highlight");

function typeWriter() {
  if (i < text.length) {
    nameSpan.textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}
nameSpan.textContent = "";
typeWriter();

// ===== Dark/Light Mode Toggle =====
const toggleBtn = document.createElement("button");
toggleBtn.innerText = "🌙 Dark Mode";
toggleBtn.style.position = "fixed";
toggleBtn.style.bottom = "20px";
toggleBtn.style.right = "20px";
toggleBtn.style.padding = "10px 15px";
toggleBtn.style.border = "none";
toggleBtn.style.borderRadius = "5px";
toggleBtn.style.background = "#ffcc00";
toggleBtn.style.color = "#121212";
toggleBtn.style.cursor = "pointer";
document.body.appendChild(toggleBtn);

let darkMode = true;

toggleBtn.addEventListener("click", () => {
  darkMode = !darkMode;
  if (darkMode) {
    document.body.style.background = "#121212";
    document.body.style.color = "#f5f5f5";
    document.querySelectorAll(".project-card").forEach(card => {
      card.style.background = "#1e1e1e";
      card.style.color = "#f5f5f5";
    });
    toggleBtn.innerText = "🌙 Dark Mode";
  } else {
    document.body.style.background = "#ffffff";
    document.body.style.color = "#121212";
    document.querySelectorAll(".project-card").forEach(card => {
      card.style.background = "#f5f5f5";
      card.style.color = "#121212";
    });
    toggleBtn.innerText = "☀️ Light Mode";
  }
});

// ===== Color Picker for Custom Theme =====
const colorPicker = document.createElement("input");
colorPicker.type = "color";
colorPicker.value = "#ffcc00"; // default accent
colorPicker.style.position = "fixed";
colorPicker.style.bottom = "20px";
colorPicker.style.right = "150px";
colorPicker.style.border = "none";
colorPicker.style.width = "40px";
colorPicker.style.height = "40px";
colorPicker.style.cursor = "pointer";
document.body.appendChild(colorPicker);

colorPicker.addEventListener("input", (e) => {
  const chosenColor = e.target.value;

  // Apply chosen color to highlights
  document.querySelectorAll(".highlight, h2").forEach(el => {
    el.style.color = chosenColor;
  });

  // Buttons contrast
  document.querySelectorAll(".btn, .contact button").forEach(btn => {
    btn.style.background = chosenColor;
    btn.style.color = "#121212";
  });

  // Progress bars
  document.querySelectorAll(".progress-bar span").forEach(bar => {
    bar.style.background = chosenColor;
  });

  // Logo text only (not background)
  const logo = document.querySelector(".logo");
  logo.style.color = chosenColor;
});

