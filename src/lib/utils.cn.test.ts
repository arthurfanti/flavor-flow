import { cn } from './utils';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('should handle conditional classes', () => {
    expect(cn('bg-red-500', false && 'text-white', 'p-4')).toBe('bg-red-500 p-4');
  });

  it('should merge tailwind classes properly (tailwind-merge)', () => {
    expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
  });
});
