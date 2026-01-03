import { render, screen } from '@testing-library/react';
import MainLayout from './MainLayout';

describe('MainLayout', () => {
  it('renders the header with the app title', () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );
    expect(screen.getByText(/Flavor Flow/i)).toBeInTheDocument();
  });

  it('renders its children', () => {
    render(
      <MainLayout>
        <div data-testid="child-content">Test Content</div>
      </MainLayout>
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('has a responsive main container', () => {
    const { container } = render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );
    // Checking for a max-width class or similar standard Tailwind responsive pattern
    const main = container.querySelector('main');
    expect(main).toHaveClass('max-w-2xl'); // Matches spec for mobile-first/centered UI
  });
});
