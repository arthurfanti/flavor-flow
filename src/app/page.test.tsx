import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renders the heading", () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { name: /Flavor Flow/i, level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<Home />);
    const description = screen.getByText(/Turn your favorite cooking videos/i);
    expect(description).toBeInTheDocument();
  });

  it("renders the UrlInput component", () => {
    render(<Home />);
    expect(screen.getByPlaceholderText(/Paste video URL/i)).toBeInTheDocument();
  });

  it("does not render RecipePreview initially", () => {
    render(<Home />);
    expect(screen.queryByText(/Ingredients/i)).not.toBeInTheDocument();
  });
});
