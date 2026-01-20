import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MagicButton } from './MagicButton';

describe('MagicButton', () => {
  it('renders correctly with default props', () => {
    render(<MagicButton>Click Me</MagicButton>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('relative'); // Basic container class
  });

  it('renders shiny variant correctly', () => {
    render(<MagicButton variant="shiny">Shiny Button</MagicButton>);
    const button = screen.getByRole('button', { name: /shiny button/i });
    expect(button).toBeInTheDocument();
    // Check for specific classes that implementing the shiny effect would likely use
    // Note: The actual implementation details might vary, but we expect some form of animation or overlay container
    const container = button.closest('div') || button;
    expect(container.innerHTML).toContain('animate-shimmer'); 
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<MagicButton onClick={handleClick}>Click Me</MagicButton>);
    
    await user.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
