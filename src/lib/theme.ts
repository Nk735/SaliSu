export function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem("salisu-theme") === "dark" ? "dark" : "light";
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("salisu-theme") === "light" ? "light" : "dark";
}
export function setTheme(theme:"light"|"dark") {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("salisu-theme", theme);
}
