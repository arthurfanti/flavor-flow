import { render, screen, fireEvent } from '@testing-library/react';
import UrlInput from './UrlInput';

describe('UrlInput', () => {
  it('renders correctly', () => {
    render(<UrlInput onExtract={jest.fn()} isLoading={false} />);
    expect(screen.getByPlaceholderText(/Paste video URL/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Extract/i })).toBeInTheDocument();
  });

  it('calls onExtract with URL when button is clicked', () => {
    const onExtract = jest.fn();
    render(<UrlInput onExtract={onExtract} isLoading={false} />);
    
    const input = screen.getByPlaceholderText(/Paste video URL/i);
    const button = screen.getByRole('button', { name: /Extract/i });
    
    fireEvent.change(input, { target: { value: 'https://youtube.com/watch?v=123' } });
    fireEvent.click(button);
    
    expect(onExtract).toHaveBeenCalledWith('https://youtube.com/watch?v=123');
  });

  it('shows loading state', () => {
    render(<UrlInput onExtract={jest.fn()} isLoading={true} />);
    expect(screen.getByText(/Processing/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
