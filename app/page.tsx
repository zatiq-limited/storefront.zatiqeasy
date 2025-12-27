"use client";

import { useHomepage, useThemeBuilder } from "@/hooks";
import { useHomepageStore } from "@/stores/homepageStore";
import BlockRenderer from "@/components/renderers/block-renderer";
import { useEffect } from "react";

export default function HomePage() {
  const { homepage } = useHomepageStore();
  const { isLoading, error } = useHomepage();
  
  // Fetch theme builder data from JSON Server
  const { 
    themeData, 
    editorState, 
    isLoading: isThemeLoading,
    error: themeError,
  } = useThemeBuilder();

  // Log theme builder data for debugging
  useEffect(() => {
    console.log("═══════════════════════════════════════════════════════");
    console.log("🎨 THEME BUILDER DATA FROM JSON SERVER");
    console.log("API Endpoint: http://localhost:4321/api/themes/85290");
    console.log("═══════════════════════════════════════════════════════");
    
    if (isThemeLoading) {
      console.log("⏳ Loading theme data...");
    } else if (themeError) {
      console.log("❌ Theme fetch error:", themeError);
    } else if (themeData) {
      // Log the RAW API response (before decompression)
      console.log("\n📥 RAW API RESPONSE (compressed editor_state):");
      console.log(themeData.raw);
      
      // Log the FULL decompressed editor state
      console.log("\n📦 DECOMPRESSED EDITOR STATE (Full JSON Object):");
      console.log(JSON.stringify(editorState, null, 2));
      
      // Also log as object for expandable view in console
      console.log("\n🔍 EDITOR STATE (Expandable Object):");
      console.log(editorState);
    } else {
      console.log("ℹ️ No theme data found for this shop");
      console.log("   Make sure JSON Server is running at http://localhost:4321");
      console.log("   And you have published a theme from merchant dashboard");
    }
    
    console.log("═══════════════════════════════════════════════════════");
  }, [themeData, editorState, isThemeLoading, themeError]);

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <p>Error loading homepage data</p>
      </main>
    );
  }

  // Extract sections from homepage data
  const pageData =
    (homepage as Record<string, unknown>)?.data || homepage || {};
  const sections = (pageData as Record<string, unknown>)?.sections || [];

  return (
    <main className="zatiq-homepage">
      {(sections as Array<Record<string, unknown>>).map((section, index) => {
        // Get the first block from each section
        const block = (section.blocks as Array<Record<string, unknown>>)?.[0];
        if (!block || !section.enabled) return null;

        return (
          <BlockRenderer
            key={(section.id as string) || `section-${index}`}
            block={
              block as import("@/components/renderers/block-renderer").Block
            }
            data={(block.data as Record<string, unknown>) || {}}
          />
        );
      })}
    </main>
  );
}
