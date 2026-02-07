import { render, screen, fireEvent } from '@testing-library/react';
import RecipePreview from './RecipePreview';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style }: any) => <div className={className} style={style}>{children}</div>,
    button: ({ children, className, onClick }: any) => <button className={className} onClick={onClick}>{children}</button>,
  },
  useScroll: () => ({ scrollY: { get: () => 0, onChange: jest.fn() } }),
  useTransform: () => 1,
}));

const mockRecipe = {
  title: 'Test Recipe',
  ingredients: ['1 cup flour', '2 eggs'],
  instructions: ['Mix ingredients', 'Bake at 350F'],
  sourceUrl: 'https://example.com',
  image_url: '/test.png'
};

describe('RecipePreview', () => {
  it('renders recipe title with display font', () => {
    render(<RecipePreview recipe={mockRecipe} onAddToList={jest.fn()} onAddToPlanner={jest.fn()} />);
    const title = screen.getByRole('heading', { name: /Test Recipe/i, level: 2 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('font-display');
  });

  it('renders ingredients list', () => {
    render(<RecipePreview recipe={mockRecipe} onAddToList={jest.fn()} onAddToPlanner={jest.fn()} />);
    expect(screen.getByText('ingredients')).toBeInTheDocument();
    expect(screen.getByText('1 cup flour')).toBeInTheDocument();
  });

  it('renders instructions list', () => {
    render(<RecipePreview recipe={mockRecipe} onAddToList={jest.fn()} onAddToPlanner={jest.fn()} />);
    expect(screen.getByText('preparation')).toBeInTheDocument();
    expect(screen.getByText('Mix ingredients')).toBeInTheDocument();
  });

  it('calls onAddToList when button is clicked', () => {
    const onAddToList = jest.fn();
    render(<RecipePreview recipe={mockRecipe} onAddToList={onAddToList} onAddToPlanner={jest.fn()} />);
    
    const button = screen.getByRole('button', { name: /addToList/i });
    fireEvent.click(button);
    
    expect(onAddToList).toHaveBeenCalledWith(mockRecipe.ingredients);
  });

  it('calls onAddToPlanner when button is clicked', () => {
    const onAddToPlanner = jest.fn();
    render(<RecipePreview recipe={mockRecipe} onAddToList={jest.fn()} onAddToPlanner={onAddToPlanner} />);
    
    const button = screen.getByRole('button', { name: /addToPlanner/i });
    fireEvent.click(button);
    
    expect(onAddToPlanner).toHaveBeenCalledWith(mockRecipe);
  });

  it('renders nothing if no recipe is provided', () => {
    const { container } = render(<RecipePreview recipe={null} onAddToList={jest.fn()} onAddToPlanner={jest.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });
});