import { render, screen } from "@testing-library/react";
import { RecipeMediaCard } from "./RecipeMediaCard";

describe("RecipeMediaCard", () => {
  it("renders the title", () => {
    render(<RecipeMediaCard title="Pasta Primavera" />);
    expect(screen.getByText("Pasta Primavera")).toBeInTheDocument();
  });

  it('renders the default metaText "planned meal"', () => {
    render(<RecipeMediaCard title="Risotto" />);
    expect(screen.getByText("planned meal")).toBeInTheDocument();
  });

  it("renders a custom metaText", () => {
    render(<RecipeMediaCard title="Tacos" metaText="3 ingredients" />);
    expect(screen.getByText("3 ingredients")).toBeInTheDocument();
  });

  it("renders a background image when imageSrc is provided", () => {
    const { container } = render(
      <RecipeMediaCard title="Test" imageSrc="https://example.com/image.jpg" />,
    );
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/image.jpg");
  });

  it("renders a placeholder icon when no imageSrc is provided", () => {
    const { container } = render(<RecipeMediaCard title="Test" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders as an anchor element when href is provided", () => {
    render(<RecipeMediaCard title="Clickable" href="/app/recipes/1" />);
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/app/recipes/1");
  });

  it("renders as a button when onClick is provided and no href", () => {
    render(<RecipeMediaCard title="Clickable" onClick={() => {}} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
