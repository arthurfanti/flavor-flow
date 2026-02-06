import { render, screen } from '@testing-library/react';
import MainLayout from './MainLayout';

// Mock @/navigation
jest.mock('@/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  Link: ({ children, href, className, 'aria-label': ariaLabel }: any) => (
    <a href={href} className={className} aria-label={ariaLabel}>{children}</a>
  ),
}));

// Mock TabBar
jest.mock('./TabBar', () => {
  return function MockTabBar() {
    return <div data-testid="tab-bar" />;
  };
});

describe('MainLayout', () => {
  it('renders children and TabBar', () => {
    render(
      <MainLayout>
        <div data-testid="test-content">Content</div>
      </MainLayout>
    );
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByTestId('tab-bar')).toBeInTheDocument();
  });

  it('does not render a header element', () => {
    const { container } = render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );
    
    const header = container.querySelector('header');
    expect(header).toBeNull();
  });
});