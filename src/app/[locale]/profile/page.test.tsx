import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from './page';
import { toast } from 'sonner';

// Mock Auth
jest.mock('@/components/AuthProvider', () => ({
  useAuth: jest.fn(() => ({
    session: { user: { id: 'user-123' } },
    loading: false,
  })),
}));

// Mock Navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock Sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock Supabase Client & Repository
const mockGetProfile = jest.fn();
const mockUpsertProfile = jest.fn();

jest.mock('@/lib/supabase/client', () => ({
  createSupabaseClient: jest.fn(),
}));

jest.mock('@/lib/repositories/SupabaseProfileRepository', () => ({
  SupabaseProfileRepository: jest.fn().mockImplementation(() => ({
    getProfile: mockGetProfile,
    upsertProfile: mockUpsertProfile,
  })),
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    mockGetProfile.mockReturnValue(new Promise(() => {})); // Never resolves
    render(<ProfilePage />);
    expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner
  });

  it('renders profile form with fetched data', async () => {
    mockGetProfile.mockResolvedValue({
      id: 'user-123',
      display_name: 'Test User',
      preferred_locale: 'fr',
    });

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
      expect(screen.getByDisplayValue('French')).toBeInTheDocument(); // Assuming select uses labels
    });
  });

  it('updates profile on save', async () => {
    mockGetProfile.mockResolvedValue({
      id: 'user-123',
      display_name: 'Old Name',
      preferred_locale: 'en',
    });
    mockUpsertProfile.mockResolvedValue(undefined);

    render(<ProfilePage />);

    await waitFor(() => screen.getByDisplayValue('Old Name'));

    const nameInput = screen.getByLabelText(/Display Name/i);
    fireEvent.change(nameInput, { target: { value: 'New Name' } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpsertProfile).toHaveBeenCalledWith(expect.objectContaining({
        id: 'user-123',
        display_name: 'New Name',
        preferred_locale: 'en',
      }));
      expect(toast.success).toHaveBeenCalled();
    });
  });
});
