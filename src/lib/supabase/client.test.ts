import { createSupabaseClient } from './client';
import { createClient } from '@supabase/supabase-js';

// Mock createClient
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('createSupabaseClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    (createClient as jest.Mock).mockClear();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should create client with valid environment variables', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'valid-key-value';

    createSupabaseClient();

    expect(createClient).toHaveBeenCalledWith(
      'https://test-project.supabase.co',
      'valid-key-value'
    );
  });

  it('should throw error if URL is missing or placeholder', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'your-project-url';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'valid-key';

    expect(() => createSupabaseClient()).toThrow('Supabase configuration is missing or using placeholders.');
  });

  it('should throw error if Key is missing or placeholder', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://valid.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'your-anon-key';

    expect(() => createSupabaseClient()).toThrow('Supabase configuration is missing or using placeholders.');
  });

  it('should throw error if URL format is invalid', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://insecure-url.com';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'valid-key';

    expect(() => createSupabaseClient()).toThrow('Invalid Supabase URL format.');
  });
});
