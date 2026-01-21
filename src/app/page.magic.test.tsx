import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './page';
import { AuthProvider } from '@/components/AuthProvider';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  createSupabaseClient: () => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
    },
  }),
}));

// Remove component mocks to test real implementation
// jest.mock('@/components/MagicCard', ...)
// jest.mock('@/components/MagicButton', ...)
// jest.mock('@/components/MagicInput', ...)

// Mock repositories and services
jest.mock('@/lib/repositories/SupabaseRecipeRepository');
jest.mock('@/lib/repositories/SupabaseShoppingListRepository');
jest.mock('@/lib/repositories/SupabasePlannerRepository');
jest.mock('@/lib/repositories/SupabasePantryRepository');

describe('Home Page - Magic UI Overhaul', () => {
  it('renders the discovery section with MagicCard styles', () => {
    render(
      <AuthProvider>
        <Home />
      </AuthProvider>
    );
    // MagicCard has a specific data-testid="magic-card-root"
    expect(screen.getByTestId('magic-card-root')).toBeInTheDocument();
  });

  it('renders the URL input with MagicInput icon', () => {
      render(
        <AuthProvider>
          <Home />
        </AuthProvider>
      );
      // MagicInput with Link2 icon
      const input = screen.getByPlaceholderText(/paste video url/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass('bg-glass-surface');
  });
});
