import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renders the heading", () => {
    render(<Home />);
    const heading = screen.getByText(/Flavor Flow/i);
    expect(heading).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<Home />);
    const description = screen.getByText(/Transform video recipes into a shopping list/i);
    expect(description).toBeInTheDocument();
  });
});
