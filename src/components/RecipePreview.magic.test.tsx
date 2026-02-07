import React from 'react';
import { render, screen } from '@testing-library/react';
import RecipePreview from './RecipePreview';

// Mock the components to verify they are being used
jest.mock('./MagicCard', () => ({
  MagicCard: ({ children, className }: any) => <div data-testid="magic-card" className={className}>{children}</div>
}));

jest.mock('./MagicButton', () => ({
  MagicButton: ({ children, variant }: any) => <button data-testid="magic-button" data-variant={variant}>{children}</button>
}));

const mockRecipe = {
  title: 'Test Recipe',
  ingredients: ['Ingredient 1'],
  instructions: ['Step 1'],
  sourceUrl: 'https://example.com',
  image_url: '/test.png'
};

describe('RecipePreview - Magic UI Overhaul', () => {
  it('renders the recipe title', () => {
    render(<RecipePreview recipe={mockRecipe} onAddToList={() => {}} onAddToPlanner={() => {}} />);
    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
  });

  it('uses MagicButton for actions', () => {
    render(<RecipePreview recipe={mockRecipe} onAddToList={() => {}} onAddToPlanner={() => {}} />);
    const buttons = screen.getAllByTestId('magic-button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });
});
