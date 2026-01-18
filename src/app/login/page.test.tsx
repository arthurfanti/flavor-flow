import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';
import { createSupabaseClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

jest.mock('@/lib/supabase/client');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LoginPage', () => {
  const mockSupabase = {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
    },
  };
  const mockPush = jest.fn();

  beforeEach(() => {
    (createSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('calls signInWithPassword on form submit', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: { session: {} }, error: null });
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
