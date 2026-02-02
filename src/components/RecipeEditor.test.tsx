import { render, screen, fireEvent } from '@testing-library/react';
import RecipeEditor from './RecipeEditor';

const mockRecipe = {
  title: 'Test Recipe',
  ingredients: ['1 cup flour', '2 eggs'],
  instructions: ['Mix ingredients', 'Bake at 350F'],
  sourceUrl: 'https://example.com'
};

describe('RecipeEditor', () => {
  it('renders initial recipe data', () => {
    render(<RecipeEditor recipe={mockRecipe} onSave={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByDisplayValue('Test Recipe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1 cup flour')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Mix ingredients')).toBeInTheDocument();
  });

  it('allows editing title', () => {
    render(<RecipeEditor recipe={mockRecipe} onSave={jest.fn()} onCancel={jest.fn()} />);
    const titleInput = screen.getByDisplayValue('Test Recipe');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    expect(titleInput).toHaveValue('New Title');
  });

  it('allows editing an ingredient', () => {
    render(<RecipeEditor recipe={mockRecipe} onSave={jest.fn()} onCancel={jest.fn()} />);
    const ingredientInput = screen.getByDisplayValue('1 cup flour');
    fireEvent.change(ingredientInput, { target: { value: '2 cups flour' } });
    expect(ingredientInput).toHaveValue('2 cups flour');
  });

  it('calls onSave with updated recipe', () => {
    const onSave = jest.fn();
    render(<RecipeEditor recipe={mockRecipe} onSave={onSave} onCancel={jest.fn()} />);
    
    fireEvent.change(screen.getByDisplayValue('Test Recipe'), { target: { value: 'Updated Title' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Updated Title',
    }));
  });

  it('calls onCancel', () => {
    const onCancel = jest.fn();
    render(<RecipeEditor recipe={mockRecipe} onSave={jest.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });
});
