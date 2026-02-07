import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MagicInput } from './MagicInput';

describe('MagicInput', () => {
  it('renders correctly', () => {
    render(<MagicInput placeholder="Search recipes..." />);
    const input = screen.getByPlaceholderText(/search recipes/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('magic-input');
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<MagicInput placeholder="Type here" />);
    const input = screen.getByPlaceholderText(/type here/i);
    
    await user.type(input, 'Pasta');
    expect(input).toHaveValue('Pasta');
  });

  it('renders with an icon if provided', () => {
    render(
      <MagicInput 
        placeholder="Search" 
        icon={<span data-testid="search-icon">🔍</span>} 
      />
    );
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });
});
