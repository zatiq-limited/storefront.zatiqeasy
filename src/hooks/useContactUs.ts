import { useEffect, useState } from "react";
import { useContactUsStore } from "@/stores/contactUsStore";

export function useContactUs() {
  const { contactUs, setContactUs } = useContactUsStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchContactUs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/storefront/v1/page/contact-us");

        if (!response.ok) {
          throw new Error("Failed to fetch contact us page");
        }

        const data = await response.json();
        setContactUs(data);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching contact us page:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!contactUs) {
      fetchContactUs();
    } else {
      setIsLoading(false);
    }
  }, [contactUs, setContactUs]);

  return { contactUs, isLoading, error };
}
