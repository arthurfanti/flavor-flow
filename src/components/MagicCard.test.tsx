import React from 'react';
import { render, screen } from '@testing-library/react';
import { MagicCard } from './MagicCard';

describe('MagicCard', () => {
  it('renders content correctly', () => {
    render(<MagicCard>Card Content</MagicCard>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

    it('applies gradient border style', () => {

      render(<MagicCard gradientColor="#ff0000">Gradient Card</MagicCard>);

      

      const root = screen.getByTestId('magic-card-root');

      // The background div is a direct child of the root, alongside the content wrapper

      const background = root.querySelector('.pointer-events-none.absolute');

      

      expect(background).toBeInTheDocument();

    });
  
  it('renders correctly with Neon variant', () => {
      render(<MagicCard variant="neon">Neon Card</MagicCard>);
      expect(screen.getByText('Neon Card')).toBeInTheDocument();
  });
});
