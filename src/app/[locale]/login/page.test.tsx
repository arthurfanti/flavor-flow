import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../app/login/page';
import { createSupabaseClient } from '@/lib/supabase/client';
import { useRouter } from '@/navigation';
import { toast } from 'sonner';

jest.mock('@/lib/supabase/client');
jest.mock('@/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
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
    expect(screen.getByLabelText('email')).toBeInTheDocument();
    expect(screen.getByLabelText('password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'signIn' })).toBeInTheDocument();
  });

  it('calls signInWithPassword on form submit', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: { session: {} }, error: null });
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'signIn' }));

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(toast.success).toHaveBeenCalledWith("welcomeBack");
      expect(mockPush).toHaveBeenCalledWith('/app');
    });
  });

  it('displays error message on failed sign in', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ 
      data: { session: null }, 
      error: { message: 'Invalid credentials' } 
    });
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: 'signIn' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('calls signUp on form submit in signUp mode', async () => {
    mockSupabase.auth.signUp.mockResolvedValue({ data: { user: {} }, error: null });
    render(<LoginPage />);

    // Toggle to Sign Up mode
    fireEvent.click(screen.getByText('dontHaveAccount'));

    fireEvent.change(screen.getByLabelText('email'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText('password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'signUp' }));

    await waitFor(() => {
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
      });
      expect(toast.success).toHaveBeenCalledWith("checkEmail");
    });
  });
});
