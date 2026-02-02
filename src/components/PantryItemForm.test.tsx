import { render, screen, fireEvent } from '@testing-library/react';
import PantryItemForm from './PantryItemForm';

describe('PantryItemForm', () => {
  it('renders correctly with default values', () => {
    render(<PantryItemForm onSave={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByPlaceholderText('itemNamePlaceholder')).toBeInTheDocument();
    expect(screen.getByLabelText('category')).toBeInTheDocument();
  });

  it('calls onSave with form data', () => {
    const onSave = jest.fn();
    render(<PantryItemForm onSave={onSave} onCancel={jest.fn()} />);
    
    fireEvent.change(screen.getByPlaceholderText('itemNamePlaceholder'), { target: { value: 'Butter' } });
    fireEvent.change(screen.getByLabelText('category'), { target: { value: 'Dairy' } });
    fireEvent.click(screen.getByText('saveItem'));

    expect(onSave).toHaveBeenCalledWith({
      name: 'Butter',
      category: 'Dairy',
      is_low_stock: false
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = jest.fn();
    render(<PantryItemForm onSave={jest.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
});