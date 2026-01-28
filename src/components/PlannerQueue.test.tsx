import { render, screen, fireEvent } from '@testing-library/react';
import PlannerQueue from './PlannerQueue';
import { PlannedRecipe } from '@/lib/repositories/PlannerRepository';

const mockRecipes: PlannedRecipe[] = [
  { id: 1, title: 'Pasta', source_url: '', planned_at: '', order: 0 },
  { id: 2, title: 'Salad', source_url: '', planned_at: '', order: 1 },
];

describe('PlannerQueue', () => {
  it('renders recipes in the queue', () => {
    render(<PlannerQueue recipes={mockRecipes} onRemove={jest.fn()} />);
    expect(screen.getByText('Pasta')).toBeInTheDocument();
    expect(screen.getByText('Salad')).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = jest.fn();
    render(<PlannerQueue recipes={mockRecipes} onRemove={onRemove} />);
    
    // In our jest mock, useTranslations returns the key name
    const removeButtons = screen.getAllByRole('button', { name: 'remove' });
    fireEvent.click(removeButtons[0]);
    
    expect(onRemove).toHaveBeenCalledWith(1);
  });

  it('shows empty state message', () => {
    render(<PlannerQueue recipes={[]} onRemove={jest.fn()} />);
    // In our jest mock, useTranslations returns the key name
    expect(screen.getByText('empty')).toBeInTheDocument();
  });
});
