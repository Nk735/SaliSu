export function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem("salisu-theme") === "dark" ? "dark" : "light";
}
export function setTheme(theme:"light"|"dark") {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("salisu-theme", theme);
}
