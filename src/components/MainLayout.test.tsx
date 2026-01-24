import { render, screen } from '@testing-library/react';
import MainLayout from './MainLayout';
import { useScrollVelocity } from '@/lib/hooks/useScrollVelocity';

// Mock the hook
jest.mock('@/lib/hooks/useScrollVelocity', () => ({
  useScrollVelocity: jest.fn(),
}));

describe('MainLayout Header Logic', () => {
  beforeEach(() => {
    (useScrollVelocity as jest.Mock).mockReturnValue({
      isFixed: false,
      isVisible: true,
    });
  });

  it('renders header naturally by default', () => {
    const { container } = render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );
    const header = container.querySelector('header');
    expect(header).toHaveClass('sticky'); // Existing default
    expect(header).not.toHaveClass('fixed');
  });

  it('applies fixed classes when isFixed is true', () => {
    (useScrollVelocity as jest.Mock).mockReturnValue({
      isFixed: true,
      isVisible: true,
    });
    const { container } = render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );
    const header = container.querySelector('header');
    expect(header).toHaveClass('fixed');
  });
});