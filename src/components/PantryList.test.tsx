import { render, screen, fireEvent } from '@testing-library/react';
import PantryList from './PantryList';
import { PantryItem } from '@/lib/repositories/PantryRepository';

const mockItems: PantryItem[] = [
  { id: 1, name: 'Apples', category: 'Produce', is_low_stock: false },
  { id: 2, name: 'Garlic', category: 'Produce', is_low_stock: true },
  { id: 3, name: 'Salt', category: 'Pantry Staples', is_low_stock: false },
];

describe('PantryList', () => {
  it('renders category headings', () => {
    render(<PantryList items={mockItems} onDelete={jest.fn()} onToggleLowStock={jest.fn()} />);
    expect(screen.getByText('categories.Produce')).toBeInTheDocument();
    expect(screen.getByText('categories.Pantry Staples')).toBeInTheDocument();
  });

  it('renders items in correct categories', () => {
    render(<PantryList items={mockItems} onDelete={jest.fn()} onToggleLowStock={jest.fn()} />);
    expect(screen.getByText('Apples')).toBeInTheDocument();
    expect(screen.getByText('Garlic')).toBeInTheDocument();
    expect(screen.getByText('Salt')).toBeInTheDocument();
  });

  it('highlights low stock items', () => {
    render(<PantryList items={mockItems} onDelete={jest.fn()} onToggleLowStock={jest.fn()} />);
    const lowStockIndicator = screen.getByText(/lowStock/i);
    expect(lowStockIndicator).toBeInTheDocument();
  });

  it('shows empty state message', () => {
    render(<PantryList items={[]} onDelete={jest.fn()} onToggleLowStock={jest.fn()} />);
    expect(screen.getByText(/empty/i)).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = jest.fn();
    render(<PantryList items={mockItems} onDelete={onDelete} onToggleLowStock={jest.fn()} />);
    
    const deleteButtons = screen.getAllByTitle(/removeItem/i);
    fireEvent.click(deleteButtons[0]);
    
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('calls onToggleLowStock when toggle button is clicked', () => {
    const onToggleLowStock = jest.fn();
    render(<PantryList items={mockItems} onDelete={jest.fn()} onToggleLowStock={onToggleLowStock} />);
    
    const toggleButtons = screen.getAllByTitle(/markLowStock/i);
    fireEvent.click(toggleButtons[0]);
    
    expect(onToggleLowStock).toHaveBeenCalledWith(1, false);
  });
});
