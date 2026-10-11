import { test } from "node:test";
import { strict as assert } from "node:assert";
import { HOME_CONCEPTS, HERO_INTERVAL, conceptPhotos, photoLabel } from "./home-concepts";
import type { PortfolioImage } from "./portfolio";

test("five independent concept identities", () => assert.equal(new Set(HOME_CONCEPTS.map(c => c.id)).size, 5));
test("rotation is seven seconds", () => assert.equal(HERO_INTERVAL, 7000));
test("photography labels never use unverified brand titles", () => assert.equal(photoLabel({ category: "Fashion", project_type: "Fashion & Editorial", title: "Wrong brand" } as PortfolioImage), "Fashion & Editorial"));
test("previews exclude fallback and inactive photos and deduplicate", () => {
  const image = { active: true, original_filename: "original.jpg", url: "source", hero: false, quality_score: 80 } as PortfolioImage;
  assert.deepEqual(conceptPhotos([image, { ...image }, { ...image, url: "hidden", active: false }, { ...image, url: "fallback", original_filename: null }]).map(i => i.url), ["source"]);
});