import fs from 'fs';
import path from 'path';

describe('Global CSS', () => {
  it('contains tailwind directives', () => {
    const css = fs.readFileSync(path.join(__dirname, 'globals.css'), 'utf8');
    expect(css).toContain('@import "tailwindcss"');
  });

  it('defines fade-in animation', () => {
    const css = fs.readFileSync(path.join(__dirname, 'globals.css'), 'utf8');
    expect(css).toContain('@keyframes fadeIn');
    expect(css).toContain('.animate-fade-in');
  });
});
