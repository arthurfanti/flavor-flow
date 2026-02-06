import { render, screen } from '@testing-library/react';
import TabBar from './TabBar';

// Mock @/navigation
const mockUsePathname = jest.fn();
jest.mock('@/navigation', () => ({
  usePathname: () => mockUsePathname(),
  Link: ({ children, href, className, 'aria-label': ariaLabel }: any) => (
    <a href={href} className={className} aria-label={ariaLabel}>{children}</a>
  ),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock useTabBarScroll
jest.mock('@/lib/hooks/useTabBarScroll', () => ({
  useTabBarScroll: () => ({ isVisible: true }),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, className, initial, animate, exit, transition }: any) => (
      <nav className={className}>{children}</nav>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('TabBar', () => {
  it('renders all five navigation links with aria-labels', () => {
    mockUsePathname.mockReturnValue('/');
    render(<TabBar />);
    
    expect(screen.getByLabelText('home')).toBeInTheDocument();
    expect(screen.getByLabelText('planner')).toBeInTheDocument();
    expect(screen.getByLabelText('pantry')).toBeInTheDocument();
    expect(screen.getByLabelText('shoppingList')).toBeInTheDocument();
    expect(screen.getByLabelText('profile')).toBeInTheDocument();
  });

  it('highlights the active link based on pathname', () => {
    mockUsePathname.mockReturnValue('/app/planner');
    render(<TabBar />);
    
    const plannerLink = screen.getByLabelText('planner');
    expect(plannerLink).toHaveClass('text-brand-primary'); 
  });

  it('is a full-width fixed navigation bar at the bottom', () => {
    const { container } = render(<TabBar />);
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('fixed');
    expect(nav).toHaveClass('bottom-0');
    expect(nav).toHaveClass('left-0');
    expect(nav).toHaveClass('right-0');
  });

  it('renders Lucide icons for each item', () => {
    const { container } = render(<TabBar />);
    
    // Check for SVGs (Lucide icons render as SVGs)
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(5);
  });
});