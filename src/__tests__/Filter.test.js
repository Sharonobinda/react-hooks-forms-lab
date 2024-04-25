import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Filter from "../components/Filter";
import ShoppingList from "../components/ShoppingList";

const testData = [
  { id: 1, name: "Yogurt", category: "Dairy" },
  { id: 2, name: "Pomegranate", category: "Produce" },
  { id: 3, name: "Lettuce", category: "Produce" },
  { id: 4, name: "String Cheese", category: "Dairy" },
  { id: 5, name: "Swiss Cheese", category: "Dairy" },
  { id: 6, name: "Cookies", category: "Dessert" },
];

// Filter
const noop = () => {};
test("uses a prop of 'search' to display the search term in the input field", () => {
  render(<Filter search="testing" onSearchChange={noop} />);

  expect(screen.queryByPlaceholderText(/Search/).value).toBe("testing");
});

test("calls the onSearchChange callback prop when the input is changed", () => {
  const onChange = jest.fn();
  render(<Filter search="testing" onSearchChange={onChange} />);

  fireEvent.change(screen.queryByPlaceholderText(/Search/), {
    target: { value: "testing123" },
  });

  expect(onChange).toHaveBeenCalled();
});

test("the input field acts as a controlled input", () => {
  render(<ShoppingList items={testData} />);

  fireEvent.change(screen.queryByPlaceholderText(/Search/), {
    target: { value: "testing 123" },
  });

  expect(screen.queryByPlaceholderText(/Search/).value).toBe("testing 123");
});

// Shopping List
test("the shopping list displays all items when initially rendered", () => {
  render(<ShoppingList items={testData} />);
  
  testData.forEach(item => {
    expect(screen.getByText(item.name)).toBeInTheDocument();
  });
});

test("the shopping filters based on the search term to include full matches", () => {
  render(<ShoppingList items={testData} />);


  fireEvent.change(screen.queryByPlaceholderText(/Search/), {
    target: { value: "Yogurt" },
  });

  expect(screen.getByText("Yogurt")).toBeInTheDocument();
  expect(screen.queryByText("Lettuce")).not.toBeInTheDocument();

  fireEvent.change(screen.queryByPlaceholderText(/Search/), {
    target: { value: "Lettuce" },
  });

  expect(screen.getByText("Lettuce")).toBeInTheDocument();
  expect(screen.queryByText("Yogurt")).not.toBeInTheDocument();
});

test("the shopping filters based on the search term to include partial matches", () => {
  render(<ShoppingList items={testData} />);

  fireEvent.change(screen.queryByPlaceholderText(/Search/), {
    target: { value: "Cheese" },
  });

  expect(screen.getByText("Swiss Cheese")).toBeInTheDocument();
  expect(screen.getByText("String Cheese")).toBeInTheDocument();
  expect(screen.queryByText("Lettuce")).not.toBeInTheDocument();
  expect(screen.queryByText("Yogurt")).not.toBeInTheDocument();
});
