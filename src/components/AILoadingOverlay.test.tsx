import { render, screen } from '@testing-library/react';
import AILoadingOverlay from './AILoadingOverlay';

describe('AILoadingOverlay', () => {
  it('renders correctly for "transcribing" stage', () => {
    render(<AILoadingOverlay stage="transcribing" />);
    expect(screen.getByText(/Transcribing/i)).toBeInTheDocument();
  });

  it('renders correctly for "analyzing" stage', () => {
    render(<AILoadingOverlay stage="analyzing" />);
    expect(screen.getByText(/Analyzing/i)).toBeInTheDocument();
  });

  it('renders correctly for "finalizing" stage', () => {
    render(<AILoadingOverlay stage="finalizing" />);
    expect(screen.getByText(/Finalizing/i)).toBeInTheDocument();
  });

  it('renders nothing when stage is "idle"', () => {
    const { container } = render(<AILoadingOverlay stage="idle" />);
    expect(container).toBeEmptyDOMElement();
  });
});