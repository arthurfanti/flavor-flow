import { render, screen } from '@testing-library/react';
import AILoadingOverlay, { AIStage } from './AILoadingOverlay';

// Mock next-intl
const mockT = jest.fn((key: string) => `translated_${key}`);
jest.mock('next-intl', () => ({
  useTranslations: () => mockT,
}));

describe('AILoadingOverlay Localization', () => {
  it('renders localized strings for transcribing stage', () => {
    render(<AILoadingOverlay stage="transcribing" />);
    expect(screen.getByText('translated_transcribing.title')).toBeInTheDocument();
    expect(screen.getByText('translated_transcribing.subtitle')).toBeInTheDocument();
  });

  it('renders localized strings for analyzing stage', () => {
    render(<AILoadingOverlay stage="analyzing" />);
    expect(screen.getByText('translated_analyzing.title')).toBeInTheDocument();
    expect(screen.getByText('translated_analyzing.subtitle')).toBeInTheDocument();
  });

  it('renders localized strings for finalizing stage', () => {
    render(<AILoadingOverlay stage="finalizing" />);
    expect(screen.getByText('translated_finalizing.title')).toBeInTheDocument();
    expect(screen.getByText('translated_finalizing.subtitle')).toBeInTheDocument();
  });
});
