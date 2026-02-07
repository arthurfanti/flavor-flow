import { createSupabaseClient } from './client';
import { createBrowserClient } from '@supabase/ssr';

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(),
}));

describe('createSupabaseClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    (createBrowserClient as jest.Mock).mockClear();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should create client with valid environment variables', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY = 'valid-key-value';

    createSupabaseClient();

    expect(createBrowserClient).toHaveBeenCalledWith(
      'https://test-project.supabase.co',
      'valid-key-value'
    );
  });

  it('should throw error if URL is missing or placeholder', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'your-project-url';
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY = 'valid-key';

    expect(() => createSupabaseClient()).toThrow('Supabase configuration is missing or using placeholders.');
  });

  it('should throw error if Key is missing or placeholder', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://valid.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY = 'your-anon-key';

    expect(() => createSupabaseClient()).toThrow('Supabase configuration is missing or using placeholders.');
  });

  it('should return client when config looks valid', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://valid.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY = 'valid-key';

    createSupabaseClient();
    expect(createBrowserClient).toHaveBeenCalled();
  });
});
