import type { Category } from "@/stores/productsStore";

/**
 * Generate all possible combinations of categories
 * Used for finding related products by category matching
 */
export function getAllCombinations(
  categories: Array<{ id: number | string; name: string }>
): Array<Array<{ id: number | string; name: string }>> {
  const combinations: Array<Array<{ id: number | string; name: string }>> = [];

  const generateCombination = (
    start: number,
    currentCombination: Array<{ id: number | string; name: string }>
  ) => {
    combinations.push([...currentCombination]);
    for (let i = start; i < categories.length; i++) {
      currentCombination.push(categories[i]);
      generateCombination(i + 1, currentCombination);
      currentCombination.pop();
    }
  };

  generateCombination(0, []);
  return combinations.filter((combination) => combination.length > 0); // Exclude empty combination
}
