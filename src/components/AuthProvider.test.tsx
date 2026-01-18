import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthProvider';
import { createSupabaseClient } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';
import React from 'react';

// Mock the client creation
jest.mock('@/lib/supabase/client', () => ({
  createSupabaseClient: jest.fn(),
}));

const mockSupabase = {
  auth: {
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
};

(createSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);

const TestComponent = () => {
  const { session, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return <div>{session ? 'Logged In' : 'Logged Out'}</div>;
};

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading initially', () => {
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
    mockSupabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show logged in state when session exists', async () => {
    const mockSession = { user: { id: '123' } } as unknown as Session;
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });
    mockSupabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Logged In')).toBeInTheDocument();
    });
  });
});
