import { useQuery } from "@tanstack/react-query";
import { useAboutUsStore } from "@/stores/aboutUsStore";
import { useEffect } from "react";

async function fetchAboutUs() {
  const res = await fetch("/api/storefront/v1/page/about-us");
  if (!res.ok) throw new Error("Failed to fetch about us page");
  return res.json();
}

export function useAboutUs() {
  const { setAboutUs } = useAboutUsStore();

  const query = useQuery({
    queryKey: ["aboutUs"],
    queryFn: fetchAboutUs,
    staleTime: Infinity,
  });

  // Sync to Zustand when data changes
  useEffect(() => {
    if (query.data) {
      console.log("About Us API Response:", query.data);
      setAboutUs(query.data);
    }
  }, [query.data, setAboutUs]);

  return query;
}