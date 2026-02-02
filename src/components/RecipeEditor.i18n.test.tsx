import { render, screen } from '@testing-library/react';
import RecipeEditor from './RecipeEditor';

// Mock next-intl
const mockT = jest.fn((key: string) => `editor_${key}`);
const mockTC = jest.fn((key: string) => `common_${key}`);

jest.mock('next-intl', () => ({
  useTranslations: (ns: string) => ns === 'Common' ? mockTC : mockT,
}));

describe('RecipeEditor Localization', () => {
  const mockRecipe = {
    title: 'Test Recipe',
    ingredients: ['Item 1'],
    instructions: ['Step 1'],
    sourceUrl: 'http://test.com',
  };

  it('renders localized Editing Mode label', () => {
    render(<RecipeEditor recipe={mockRecipe} onSave={() => {}} onCancel={() => {}} />);
    expect(screen.getByText('editor_editingMode')).toBeInTheDocument();
  });
});
