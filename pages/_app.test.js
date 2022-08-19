import { render } from "react-dom";
import { describe, expect, test } from "vitest";
import { MyApp } from "./_app";

// test("MyApp", () => {
//   render(<MyApp />);
//   expect(document.querySelector("h1")).toHaveText("Have something playing?");
// });
describe("MyApp", () => {
  test("renders", () => {
    render(<MyApp />);
    expect(document.querySelector("h1")).toHaveText("Have something playing?");
  }).timeout(1000);
});
