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
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Planner')).toBeInTheDocument();
    expect(screen.getByText('Pantry')).toBeInTheDocument();
    expect(screen.getByText('Shopping')).toBeInTheDocument();
  });

  it('highlights the active link based on pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/planner');
    render(<TabBar />);
    
    const plannerLink = screen.getByText('Planner').closest('a');
    expect(plannerLink).toHaveClass('text-brand-yellow-dark'); 
  });

  it('is fixed to the bottom of the screen', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    const { container } = render(<TabBar />);
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('fixed');
    expect(nav).toHaveClass('bottom-0');
  });

  it('renders Material Symbols icons for each item', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    render(<TabBar />);
    
    expect(screen.getByText('home')).toHaveClass('material-symbols-rounded');
    expect(screen.getByText('calendar_month')).toHaveClass('material-symbols-rounded');
    expect(screen.getByText('kitchen')).toHaveClass('material-symbols-rounded');
    expect(screen.getByText('shopping_bag')).toHaveClass('material-symbols-rounded');
  });
});
