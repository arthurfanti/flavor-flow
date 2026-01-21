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
    expect(plannerLink).toHaveClass('text-brand-primary'); 
  });

  it('is a floating navigation bar', () => {
    const { container } = render(<TabBar />);
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('fixed');
    expect(nav).toHaveClass('bottom-6');
  });

  it('renders Lucide icons for each item', () => {
    const { container } = render(<TabBar />);
    
    // Check for SVGs (Lucide icons render as SVGs)
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(4);
  });
});