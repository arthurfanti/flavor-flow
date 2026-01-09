export class IngredientMatcher {
  /**
   * Compares two ingredient names and returns true if they are considered a match.
   * Performs case-insensitive matching and simple plural/singular handling.
   */
  isMatch(a: string, b: string): boolean {
    if (!a || !b) return false;

    const normA = a.toLowerCase().trim();
    const normB = b.toLowerCase().trim();

    if (normA === normB) return true;

    // Simple pluralization check
    if (this.checkPlural(normA, normB)) return true;
    if (this.checkPlural(normB, normA)) return true;

    return false;
  }

  private checkPlural(singular: string, potentialPlural: string): boolean {
    // Check 's' pluralization
    if (singular + 's' === potentialPlural) return true;
    
    // Check 'es' pluralization (potatoes, tomatoes)
    if (singular + 'es' === potentialPlural) return true;

    return false;
  }
}