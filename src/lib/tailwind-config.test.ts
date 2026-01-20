import config from '../../tailwind.config';

describe('Tailwind Configuration', () => {
  it('should include the new design tokens', () => {
    const theme = config.theme?.extend;

    // Verify Colors
    expect(theme?.colors).toHaveProperty('brand-primary');
    expect(theme?.colors).toHaveProperty('brand-secondary');
    expect(theme?.colors).toHaveProperty('glass-surface');

    // Verify Typography
    expect(theme?.fontFamily).toHaveProperty('display');
    expect(theme?.fontFamily).toHaveProperty('sans');

    // Verify Animations (Magic UI)
    expect(theme?.animation).toHaveProperty('shimmer');
    expect(theme?.keyframes).toHaveProperty('shimmer');
  });
});
