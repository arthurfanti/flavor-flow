import { render, screen } from '@testing-library/react';
import MainLayout from './MainLayout';
import { useScrollVelocity } from '@/lib/hooks/useScrollVelocity';

// Mock dependencies
jest.mock('@/lib/hooks/useScrollVelocity', () => ({
  useScrollVelocity: jest.fn(),
}));

jest.mock('@/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  Link: ({ children, href, className, 'aria-label': ariaLabel }: any) => (
    <a href={href} className={className} aria-label={ariaLabel}>{children}</a>
  ),
}));

// Mock next-intl
const mockTCommon = jest.fn((key: string) => `common_${key}`);
const mockTNavigation = jest.fn((key: string) => `nav_${key}`);

jest.mock('next-intl', () => ({
  useTranslations: (namespace: string) => {
    if (namespace === 'Common') return mockTCommon;
    if (namespace === 'Navigation') return mockTNavigation;
    return (key: string) => key;
  },
}));

describe('MainLayout Localization', () => {
  beforeEach(() => {
    (useScrollVelocity as jest.Mock).mockReturnValue({
      isFixed: false,
      isVisible: true,
    });
  });

  it('renders localized title and profile label', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );
    
    // Check for translated title (from Common.title)
    expect(screen.getAllByText('common_title').length).toBeGreaterThan(0);
    
    // Check for translated profile link aria-label (from Navigation.profile)
    // The profile icon is repeated in the fixed header so we use getAllByLabelText
    const profileLinks = screen.getAllByLabelText('nav_profile');
    expect(profileLinks.length).toBeGreaterThan(0);
  });
});
