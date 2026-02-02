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

describe('TabBar', () => {
  it('renders all four navigation links with aria-labels', () => {
    mockUsePathname.mockReturnValue('/');
    render(<TabBar />);
    
    expect(screen.getByLabelText('home')).toBeInTheDocument();
    expect(screen.getByLabelText('planner')).toBeInTheDocument();
    expect(screen.getByLabelText('pantry')).toBeInTheDocument();
    expect(screen.getByLabelText('shoppingList')).toBeInTheDocument();
  });

  it('highlights the active link based on pathname', () => {
    mockUsePathname.mockReturnValue('/app/planner');
    render(<TabBar />);
    
    const plannerLink = screen.getByLabelText('planner');
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
