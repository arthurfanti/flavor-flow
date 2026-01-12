import { render, screen, fireEvent } from '@testing-library/react';
import RecipePreview from './RecipePreview';

const mockRecipe = {
  title: 'Test Recipe',
  ingredients: ['1 cup flour', '2 eggs'],
  instructions: ['Mix ingredients', 'Bake at 350F'],
  sourceUrl: 'https://example.com'
};

describe('RecipePreview', () => {
  it('renders recipe title with serif font', () => {
    render(<RecipePreview recipe={mockRecipe} onAddToList={jest.fn()} onAddToPlanner={jest.fn()} />);
    const title = screen.getByRole('heading', { name: /Test Recipe/i, level: 2 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('font-serif');
  });

  it('renders ingredients list', () => {
    render(<RecipePreview recipe={mockRecipe} onAddToList={jest.fn()} onAddToPlanner={jest.fn()} />);
    expect(screen.getByText('1 cup flour')).toBeInTheDocument();
    expect(screen.getByText('2 eggs')).toBeInTheDocument();
  });

  it('renders instructions list', () => {
    render(<RecipePreview recipe={mockRecipe} onAddToList={jest.fn()} onAddToPlanner={jest.fn()} />);
    expect(screen.getByText('Mix ingredients')).toBeInTheDocument();
    expect(screen.getByText('Bake at 350F')).toBeInTheDocument();
  });

  it('calls onAddToList when button is clicked', () => {
    const onAddToList = jest.fn();
    render(<RecipePreview recipe={mockRecipe} onAddToList={onAddToList} onAddToPlanner={jest.fn()} />);
    
    const button = screen.getByRole('button', { name: /Add to List/i });
    fireEvent.click(button);
    
    expect(onAddToList).toHaveBeenCalledWith(mockRecipe.ingredients);
  });

  it('calls onAddToPlanner when button is clicked', () => {
    const onAddToPlanner = jest.fn();
    render(<RecipePreview recipe={mockRecipe} onAddToList={jest.fn()} onAddToPlanner={onAddToPlanner} />);
    
    const button = screen.getByRole('button', { name: /Add to Planner/i });
    fireEvent.click(button);
    
    expect(onAddToPlanner).toHaveBeenCalledWith(mockRecipe);
  });

  it('renders nothing if no recipe is provided', () => {
    const { container } = render(<RecipePreview recipe={null} onAddToList={jest.fn()} onAddToPlanner={jest.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });
});
