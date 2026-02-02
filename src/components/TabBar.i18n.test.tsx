import { render, screen } from '@testing-library/react';
import TabBar from './TabBar';

// Mock @/navigation
jest.mock('@/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  Link: ({ children, href, className, 'aria-label': ariaLabel }: any) => (
    <a href={href} className={className} aria-label={ariaLabel}>{children}</a>
  ),
}));

// Mock next-intl
const mockT = jest.fn((key: string) => `translated_${key}`);
jest.mock('next-intl', () => ({
  useTranslations: () => mockT,
}));

describe('TabBar Localization', () => {
  it('renders localized navigation labels', () => {
    render(<TabBar />);
    
    // Expect the mock translation to be used
    expect(screen.getByLabelText('translated_home')).toBeInTheDocument();
    expect(screen.getByLabelText('translated_planner')).toBeInTheDocument();
    expect(screen.getByLabelText('translated_pantry')).toBeInTheDocument();
    expect(screen.getByLabelText('translated_shoppingList')).toBeInTheDocument();
  });
});
