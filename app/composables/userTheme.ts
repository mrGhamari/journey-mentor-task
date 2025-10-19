export function useUserTheme() {
  const getUserTheme = () => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    )
      return "dark";
    else return "light";
  };
  return { getUserTheme };
}
