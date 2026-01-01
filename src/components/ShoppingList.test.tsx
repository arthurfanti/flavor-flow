import { render, screen, fireEvent } from '@testing-library/react';
import ShoppingList from './ShoppingList';

const mockItems = [
  { id: 1, name: 'Apples', bought: false },
  { id: 2, name: 'Bananas', bought: true },
];

describe('ShoppingList', () => {
  it('renders items', () => {
    render(<ShoppingList items={mockItems} onToggle={jest.fn()} onRemove={jest.fn()} />);
    expect(screen.getByText('Apples')).toBeInTheDocument();
    expect(screen.getByText('Bananas')).toBeInTheDocument();
  });

  it('calls onToggle when checkbox is clicked', () => {
    const onToggle = jest.fn();
    render(<ShoppingList items={mockItems} onToggle={onToggle} onRemove={jest.fn()} />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    
    expect(onToggle).toHaveBeenCalledWith(1, true);
  });

  it('calls onRemove when delete button is clicked', () => {
    const onRemove = jest.fn();
    render(<ShoppingList items={mockItems} onToggle={jest.fn()} onRemove={onRemove} />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /Remove/i });
    fireEvent.click(deleteButtons[0]);
    
    expect(onRemove).toHaveBeenCalledWith(1);
  });

  it('shows empty state message', () => {
    render(<ShoppingList items={[]} onToggle={jest.fn()} onRemove={jest.fn()} />);
    expect(screen.getByText(/Your shopping list is empty/i)).toBeInTheDocument();
  });
});
