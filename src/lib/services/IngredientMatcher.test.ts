import { IngredientMatcher } from './IngredientMatcher';

describe('IngredientMatcher', () => {
  const matcher = new IngredientMatcher();

  describe('isMatch', () => {
    it('should match identical strings', () => {
      expect(matcher.isMatch('Butter', 'Butter')).toBe(true);
    });

    it('should be case-insensitive', () => {
      expect(matcher.isMatch('Butter', 'butter')).toBe(true);
      expect(matcher.isMatch('BUTTER', 'butter')).toBe(true);
    });

    it('should ignore leading/trailing whitespace', () => {
      expect(matcher.isMatch('  Butter  ', 'butter')).toBe(true);
    });

    it('should handle simple pluralization (s)', () => {
      expect(matcher.isMatch('Egg', 'Eggs')).toBe(true);
      expect(matcher.isMatch('Eggs', 'Egg')).toBe(true);
      expect(matcher.isMatch('Tomato', 'Tomatoes')).toBe(true); // maybe?
      expect(matcher.isMatch('Tomatoes', 'Tomato')).toBe(true);
    });

    it('should handle simple pluralization (es)', () => {
        expect(matcher.isMatch('Potato', 'Potatoes')).toBe(true);
    });

    it('should not match completely different strings', () => {
      expect(matcher.isMatch('Butter', 'Salt')).toBe(false);
      expect(matcher.isMatch('Egg', 'Eggplant')).toBe(false);
    });
  });
});
