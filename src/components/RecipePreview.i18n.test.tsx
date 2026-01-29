import { render, screen } from '@testing-library/react';
import RecipePreview from './RecipePreview';

// Mock next-intl
const mockT = jest.fn((key: string) => `detail_${key}`);
jest.mock('next-intl', () => ({
  useTranslations: () => mockT,
}));

describe('RecipePreview Localization', () => {
  const mockRecipe = {
    title: 'Test Recipe',
    ingredients: ['Item 1'],
    instructions: ['Step 1'],
    sourceUrl: 'http://test.com',
    image_url: 'http://test.com/image.jpg'
  };

  it('renders localized AI Kitchen label', () => {
    render(<RecipePreview recipe={mockRecipe} onAddToList={() => {}} onAddToPlanner={() => {}} />);
    expect(screen.getByText('detail_aiKitchen')).toBeInTheDocument();
  });
});
