import { render, screen } from '@testing-library/react';
import TabBar from './TabBar';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('TabBar', () => {
  it('renders all four navigation links with aria-labels', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    render(<TabBar />);
    
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('Planner')).toBeInTheDocument();
    expect(screen.getByLabelText('Pantry')).toBeInTheDocument();
    expect(screen.getByLabelText('Shopping')).toBeInTheDocument();
  });

  it('highlights the active link based on pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/planner');
    render(<TabBar />);
    
    const plannerLink = screen.getByLabelText('Planner');
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