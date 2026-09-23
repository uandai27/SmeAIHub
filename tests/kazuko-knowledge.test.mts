import assert from "node:assert/strict";
import { test } from "node:test";

import {
  enforceKazukoPolicy,
  type ConciergeDecision,
} from "../lib/server/kazuko-concierge.ts";
import {
  KAZUKO_KNOWLEDGE_VERSION,
  KAZUKO_RUNTIME_KNOWLEDGE,
  kazukoKnowledge,
} from "../lib/server/kazuko-knowledge.ts";

function restaurantDecision(
  overrides: Partial<ConciergeDecision> = {},
): ConciergeDecision {
  return {
    reply: "Supported answer.",
    intent: "restaurant_question",
    needs_human: false,
    knowledge_refs: ["menu"],
    allergen_item: null,
    reservation: {
      guest_name: null,
      contact_number: null,
      requested_date: null,
      requested_time: null,
      party_size: null,
      special_request: null,
    },
    missing_reservation_fields: [],
    ...overrides,
  };
}

test("knowledge module has the approved V4 version, address, and landmarks", () => {
  assert.equal(KAZUKO_KNOWLEDGE_VERSION, "kazuko-kb-v4-2026-09-20");
  assert.match(kazukoKnowledge.location.address, /2 Constellation Street/i);
  assert.match(kazukoKnowledge.location.address, /Makati Avenue/i);
  assert.deepEqual(kazukoKnowledge.location.landmarks, [
    "Opposite City Garden Hotel",
    "Opposite UnionBank on Makati Avenue",
  ]);
});

test("public channels use the approved customer-facing references", () => {
  assert.deepEqual(kazukoKnowledge.publicChannels, {
    whatsapp: "https://wa.me/639611277777",
    facebook: "https://facebook.com/kazukoramenbaph",
    instagram: "https://instagram.com/kazukoramenba",
    tiktok: "https://tiktok.com/@kazukoramenba",
    website: "https://kazukoramenba.com",
  });
});

test("knowledge states 24-hour operation and availability-based parking", () => {
  assert.equal(kazukoKnowledge.location.operatingHours, "Open 24 hours");
  assert.match(kazukoKnowledge.location.parking, /based on availability/i);
  assert.match(kazukoKnowledge.location.parking, /no dedicated, guaranteed, or reserved/i);
});

test("Tonkotsu Shoyu has its current price and printed recommendation tags", () => {
  const tonkotsu = kazukoKnowledge.menu.find(
    ({ name }) => name === "Tonkotsu Shoyu",
  );
  assert.ok(tonkotsu);
  assert.equal(tonkotsu.pricePhp, 539);
  assert.deepEqual(tonkotsu.tags, [
    "Chef's Recommendation",
    "Best-Seller",
  ]);
});

test("only the two printed vegetarian options are presented as vegetarian", () => {
  const vegetarianItems = kazukoKnowledge.menu
    .filter(({ tags }) => tags?.includes("Vegetarian"))
    .map(({ name }) => name);
  assert.deepEqual(vegetarianItems, ["Edamame", "Garden Salad"]);
  assert.deepEqual(kazukoKnowledge.menuGuidance.vegetarianItems, [
    "Edamame",
    "Garden Salad",
  ]);
});

test("Tantanmen is explicitly treated as containing peanuts", () => {
  const tantanmen = kazukoKnowledge.menu.find(
    ({ name }) => name === "Tantanmen",
  );
  assert.ok(tantanmen);
  assert.ok(tantanmen.tags?.includes("Contains Peanuts"));
  assert.match(kazukoKnowledge.allergenGuide.responsePolicy, /Tantanmen as containing peanuts/i);
});

test("allergen knowledge includes the printed cross-contact disclaimer", () => {
  assert.match(kazukoKnowledge.allergenGuide.crossContact, /cross-contact/i);
  assert.match(kazukoKnowledge.allergenGuide.crossContact, /nuts, seafood, wheat, and dairy/i);
  assert.match(kazukoKnowledge.allergenGuide.crossContact, /cannot guarantee a 100% allergen-free environment/i);
});

test("pricing wording says VAT is included and the service charge is additional", () => {
  assert.match(kazukoKnowledge.pricingNotice, /inclusive of 12% VAT/i);
  assert.match(kazukoKnowledge.pricingNotice, /subject to 10% service charge/i);
});

test("grounded restaurant facts may be answered without a handoff", () => {
  const result = enforceKazukoPolicy(
    restaurantDecision({
      reply: "We are open 24 hours.",
      knowledge_refs: ["hours"],
    }),
  );
  assert.equal(result.needs_human, false);
  assert.equal(result.reply, "We are open 24 hours.");
});

test("unknown restaurant facts require a human handoff", () => {
  const result = enforceKazukoPolicy(
    restaurantDecision({
      reply: "I think so.",
      knowledge_refs: [],
    }),
  );
  assert.equal(result.needs_human, true);
  assert.match(result.reply, /team member will confirm/i);
});

test("reservation completion cannot become a confirmation", () => {
  const result = enforceKazukoPolicy({
    ...restaurantDecision(),
    reply: "Your reservation is confirmed.",
    intent: "reservation_request",
    knowledge_refs: [],
    reservation: {
      guest_name: "Guest",
      contact_number: "+639000000000",
      requested_date: "2026-10-01",
      requested_time: "7:00 PM",
      party_size: "2",
      special_request: "none",
    },
  });
  assert.equal(result.needs_human, true);
  assert.doesNotMatch(result.reply, /reservation is confirmed/i);
  assert.match(result.reply, /team member will confirm/i);
});

test("printed allergen answers are rebuilt from sanitized menu facts", () => {
  const result = enforceKazukoPolicy(
    restaurantDecision({
      reply: "This dish is completely safe.",
      knowledge_refs: ["menu", "allergens"],
      allergen_item: "Tantanmen",
    }),
  );
  assert.equal(result.needs_human, false);
  assert.match(result.reply, /Tantanmen/i);
  assert.match(result.reply, /Contains Peanuts/i);
  assert.match(result.reply, /cross-contact is possible/i);
  assert.match(result.reply, /cannot guarantee allergen-free/i);
  assert.doesNotMatch(result.reply, /completely safe/i);
});

test("allergy safety judgments are always handed to staff", () => {
  const result = enforceKazukoPolicy(
    restaurantDecision({
      reply: "Yes, you can eat it.",
      knowledge_refs: ["menu", "allergens"],
      allergen_item: "Tantanmen",
    }),
    "en",
    "I am allergic to peanuts. Is Tantanmen safe for me?",
  );
  assert.equal(result.needs_human, true);
  assert.equal(result.allergen_item, null);
  assert.match(result.reply, /team member will confirm/i);
});

test("runtime knowledge excludes secrets, private contacts, and internal review content", () => {
  assert.doesNotMatch(KAZUKO_RUNTIME_KNOWLEDGE, /password|credential|login/i);
  assert.doesNotMatch(KAZUKO_RUNTIME_KNOWLEDGE, /Shawn Chan/i);
  assert.doesNotMatch(KAZUKO_RUNTIME_KNOWLEDGE, /9\.5\s*\/\s*10|2\s*\/\s*10/i);
  assert.doesNotMatch(KAZUKO_RUNTIME_KNOWLEDGE, /reservation responsiveness|test reservation inquiry/i);
});
