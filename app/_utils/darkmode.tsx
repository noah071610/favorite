export const ScriptTag = () => {
  const codeToRunOnClient = `
  let preference = "light";
  const persistedColorPreference = window.localStorage.getItem("color-mode");
  const hasPersistedPreference = typeof persistedColorPreference === "string";

  if (hasPersistedPreference) {
    preference = persistedColorPreference;
  } else {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const hasMediaQueryPreference = typeof mql.matches === "boolean";
    if (hasMediaQueryPreference) {
      preference = mql.matches ? "dark" : "light";
    };
  }

  const body = document.querySelector('body');
  body.classList.add(preference);
  `

  return <script dangerouslySetInnerHTML={{ __html: codeToRunOnClient }} />
}
