"use client";

import { useTheme, useHomepage } from "@/hooks";
import { useThemeStore } from "@/stores/themeStore";
import { useHomepageStore } from "@/stores/homepageStore";

export default function HomePage() {
  const { theme } = useThemeStore();
  const { homepage } = useHomepageStore();
  const { isLoading: themeLoading, error: themeError } = useTheme();
  const { isLoading: homeLoading, error: homeError } = useHomepage();

  if (themeLoading || homeLoading) {
    return <main><p>Loading...</p></main>;
  }

  if (themeError || homeError) {
    return <main><p>Error loading data</p></main>;
  }

  return (
    <main>
      <h1>Hello World</h1>
      <p>Theme loaded: {theme ? "Yes" : "No"}</p>
      <p>Homepage data loaded: {homepage ? "Yes" : "No"}</p>
    </main>
  );
}
