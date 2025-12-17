import { useQuery } from "@tanstack/react-query";
import { useHomepageStore } from "@/stores/homepageStore";
import { useEffect } from "react";

async function fetchHomepage() {
  const res = await fetch("/api/storefront/v1/page/home");
  if (!res.ok) throw new Error("Failed to fetch homepage");
  return res.json();
}

export function useHomepage() {
  const { setHomepage } = useHomepageStore();

  const query = useQuery({
    queryKey: ["homepage"],
    queryFn: fetchHomepage,
    staleTime: Infinity, // Never refetch, static data --> Data only refetches on page reload (browser refresh)
  });

  // Sync to Zustand when data changes
  useEffect(() => {
    if (query.data) {
      console.log("Homepage API Response:", query.data);
      setHomepage(query.data);
    }
  }, [query.data, setHomepage]);

  return query;
}
