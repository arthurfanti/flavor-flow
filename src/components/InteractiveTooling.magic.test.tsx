import React from 'react';
import { render, screen } from '@testing-library/react';
import PantryList from './PantryList';
import PlannerQueue from './PlannerQueue';
import ShoppingList from './ShoppingList';

// Mock the components to verify they are being used
jest.mock('./MagicCard', () => ({
  MagicCard: ({ children, className }: any) => <div data-testid="magic-card" className={className}>{children}</div>
}));

jest.mock('./MagicButton', () => ({
  MagicButton: ({ children, variant }: any) => <button data-testid="magic-button" data-variant={variant}>{children}</button>
}));

describe('Interactive Tooling - Magic UI Overhaul', () => {
  describe('PantryList', () => {
    it('uses MagicCard for pantry items', () => {
      const items = [{ id: 1, name: 'Apple', category: 'Produce', is_low_stock: false }];
      render(<PantryList items={items} onDelete={() => {}} onToggleLowStock={() => {}} />);
      // Each pantry item row should be a MagicCard or similar surface
      expect(screen.getByTestId('magic-card')).toBeInTheDocument();
    });
  });

  describe('PlannerQueue', () => {
    it('uses MagicCard for planned recipes', () => {
      const recipes = [{ id: 1, title: 'Planned Pasta', recipe_id: 1 }];
      render(<PlannerQueue recipes={recipes} onRemove={() => {}} />);
      expect(screen.getByTestId('magic-card')).toBeInTheDocument();
    });
  });

  describe('ShoppingList', () => {
    it('uses MagicCard as main container', () => {
      const items = [{ id: 1, name: 'Milk', bought: false }];
      render(<ShoppingList items={items} onToggle={() => {}} onRemove={() => {}} />);
      expect(screen.getByTestId('magic-card')).toBeInTheDocument();
    });
  });
});
