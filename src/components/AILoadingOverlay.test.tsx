import { render, screen } from "@testing-library/react";
import AILoadingOverlay from "./AILoadingOverlay";

describe("AILoadingOverlay", () => {
  it('renders correctly for "transcribing" stage', () => {
    render(<AILoadingOverlay stage="transcribing" isLoading={true} />);
    expect(screen.getByText("transcribing.title")).toBeInTheDocument();
  });

  it('renders correctly for "analyzing" stage', () => {
    render(<AILoadingOverlay stage="analyzing" isLoading={true} />);
    expect(screen.getByText("analyzing.title")).toBeInTheDocument();
  });

  it('renders correctly for "finalizing" stage', () => {
    render(<AILoadingOverlay stage="finalizing" isLoading={true} />);
    expect(screen.getByText("finalizing.title")).toBeInTheDocument();
  });

  it('renders nothing when stage is "idle"', () => {
    const { container } = render(<AILoadingOverlay stage="idle" />);
    expect(container).toBeEmptyDOMElement();
  });
});
