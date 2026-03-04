import { render, screen } from "@testing-library/react";
import RecipeListItem from "./RecipeListItem";

const mockRecipe = {
  title: "Test Recipe",
  image_url: "https://example.com/image.jpg",
  ingredients: ["Item 1", "Item 2"],
};

describe("RecipeListItem", () => {
  it("renders the recipe title", () => {
    render(<RecipeListItem recipe={mockRecipe} />);
    expect(screen.getByText("Test Recipe")).toBeInTheDocument();
  });

  it("renders the ingredient count meta text", () => {
    render(<RecipeListItem recipe={mockRecipe} />);
    // next-intl mock returns the translation key
    expect(screen.getByText("ingredientsCount")).toBeInTheDocument();
  });

  it("renders a placeholder svg if no image is provided", () => {
    const recipeWithoutImage = { ...mockRecipe, image_url: "" };
    const { container } = render(
      <RecipeListItem recipe={recipeWithoutImage} />,
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
