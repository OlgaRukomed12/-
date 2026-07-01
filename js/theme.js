/* ============================================
   Переключение светлой / тёмной темы
   ============================================ */

// Ключ для сохранения выбора темы в браузере
const THEME_STORAGE_KEY = "budget-calculator-theme";

// Применяем тему к <html> и обновляем иконку кнопки
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  const toggleBtn = document.getElementById("themeToggle");
  if (!toggleBtn) return;

  // В светлой теме — луна (переключить на тёмную)
  // В тёмной теме — солнце (переключить на светлую)
  toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  toggleBtn.title = theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему";
}

// Переключение темы по клику на кнопку
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";

  applyTheme(next);
  localStorage.setItem(THEME_STORAGE_KEY, next);
}

// Загружаем сохранённую тему при открытии страницы
(function initTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);

  if (saved === "dark" || saved === "light") {
    applyTheme(saved);
    return;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
})();
