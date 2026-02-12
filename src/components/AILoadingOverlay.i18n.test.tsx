import { render, screen } from "@testing-library/react";
import AILoadingOverlay, { AIStage } from "./AILoadingOverlay";

// Mock next-intl
const mockT = jest.fn((key: string) => `translated_${key}`);
jest.mock("next-intl", () => ({
  useTranslations: () => mockT,
}));

describe("AILoadingOverlay Localization", () => {
  it("renders localized strings for transcribing stage", () => {
    render(<AILoadingOverlay stage="transcribing" isLoading={true} />);
    expect(
      screen.getByText("translated_transcribing.title"),
    ).toBeInTheDocument();
  });

  it("renders localized strings for analyzing stage", () => {
    render(<AILoadingOverlay stage="analyzing" isLoading={true} />);
    expect(screen.getByText("translated_analyzing.title")).toBeInTheDocument();
  });

  it("renders localized strings for finalizing stage", () => {
    render(<AILoadingOverlay stage="finalizing" isLoading={true} />);
    expect(screen.getByText("translated_finalizing.title")).toBeInTheDocument();
  });
});
