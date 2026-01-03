import { render, screen, fireEvent } from '@testing-library/react';
import PantryItemForm from './PantryItemForm';

describe('PantryItemForm', () => {
  it('renders correctly with default values', () => {
    render(<PantryItemForm onSave={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByPlaceholderText(/e.g. Olive Oil/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
  });

  it('calls onSave with form data', () => {
    const onSave = jest.fn();
    render(<PantryItemForm onSave={onSave} onCancel={jest.fn()} />);
    
    fireEvent.change(screen.getByPlaceholderText(/e.g. Olive Oil/i), { target: { value: 'Butter' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Dairy' } });
    fireEvent.click(screen.getByText(/Save Item/i));

    expect(onSave).toHaveBeenCalledWith({
      name: 'Butter',
      category: 'Dairy',
      is_low_stock: false
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = jest.fn();
    render(<PantryItemForm onSave={jest.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(onCancel).toHaveBeenCalled();
  });
});
