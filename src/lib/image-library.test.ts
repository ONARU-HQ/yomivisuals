import { test, expect } from "bun:test";
import { imageProjectType, uniqueImages } from "./image-library";

test("project-type grouping does not infer a brand from a title", () => {
  const image = { title: "Wrong Brand — 01", category: "Commercial", project_type: "Fashion & Editorial" };
  expect(imageProjectType(image)).toBe("Fashion & Editorial");
});
test("duplicate image URLs have one library entry", () => {
  expect(uniqueImages([{ url: "a", id: 1 }, { url: "a", id: 2 }, { url: "b", id: 3 }]).map(i => i.id)).toEqual([1, 3]);
});