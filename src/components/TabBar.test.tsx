import { render, screen } from '@testing-library/react';
import TabBar from './TabBar';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('TabBar', () => {
  it('renders all four navigation links', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    render(<TabBar />);
    
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Planner/i)).toBeInTheDocument();
    expect(screen.getByText(/Pantry/i)).toBeInTheDocument();
    expect(screen.getByText(/Shopping/i)).toBeInTheDocument();
  });

  it('highlights the active link based on pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/planner');
    render(<TabBar />);
    
    const plannerLink = screen.getByText(/Planner/i).closest('a');
    expect(plannerLink).toHaveClass('text-yellow-500'); // Assuming active color is yellow-500
  });

  it('is fixed to the bottom of the screen', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    const { container } = render(<TabBar />);
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('fixed');
    expect(nav).toHaveClass('bottom-0');
  });
});
