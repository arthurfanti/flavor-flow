import { render, screen } from '@testing-library/react';
import RecipePreview from './RecipePreview';

const mockRecipe = {
  title: 'Test Recipe',
  ingredients: ['1 cup flour', '2 eggs'],
  instructions: ['Mix ingredients', 'Bake at 350F'],
  sourceUrl: 'https://example.com'
};

describe('RecipePreview', () => {
  it('renders recipe title with serif font', () => {
    render(<RecipePreview recipe={mockRecipe} />);
    const title = screen.getByRole('heading', { name: /Test Recipe/i, level: 2 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('font-serif');
  });

  it('renders ingredients list', () => {
    render(<RecipePreview recipe={mockRecipe} />);
    expect(screen.getByText('1 cup flour')).toBeInTheDocument();
    expect(screen.getByText('2 eggs')).toBeInTheDocument();
  });

  it('renders instructions list', () => {
    render(<RecipePreview recipe={mockRecipe} />);
    expect(screen.getByText('Mix ingredients')).toBeInTheDocument();
    expect(screen.getByText('Bake at 350F')).toBeInTheDocument();
  });

  it('renders nothing if no recipe is provided', () => {
    const { container } = render(<RecipePreview recipe={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
