import { useQuery } from "@tanstack/react-query";
import { useContactUsStore } from "@/stores/contactUsStore";
import { useEffect } from "react";

async function fetchContactUs() {
  const res = await fetch("/api/storefront/v1/page/contact-us");
  if (!res.ok) throw new Error("Failed to fetch contact us page");
  return res.json();
}

export function useContactUs() {
  const { setContactUs } = useContactUsStore();

  const query = useQuery({
    queryKey: ["contactUs"],
    queryFn: fetchContactUs,
    staleTime: Infinity,
  });

  // Sync to Zustand when data changes
  useEffect(() => {
    if (query.data) {
      console.log("Contact Us API Response:", query.data);
      setContactUs(query.data);
    }
  }, [query.data, setContactUs]);

  return query;
}