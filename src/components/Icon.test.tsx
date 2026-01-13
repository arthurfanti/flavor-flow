import { render, screen } from '@testing-library/react';
import Icon from './Icon';

describe('Icon', () => {
  it('renders the correct icon name', () => {
    render(<Icon name="home" />);
    const iconElement = screen.getByText('home');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveClass('material-symbols-rounded');
  });

  it('applies custom className', () => {
    render(<Icon name="settings" className="text-red-500" />);
    const iconElement = screen.getByText('settings');
    expect(iconElement).toHaveClass('text-red-500');
  });
});
