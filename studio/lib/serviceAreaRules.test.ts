import { describe, expect, it } from "vitest";
import { hideServicesOffered, validateServicesOffered } from "./serviceAreaRules";

describe("hideServicesOffered", () => {
  it("hides the picker when the area offers all services", () => {
    expect(hideServicesOffered({ document: { offersAllServices: true } })).toBe(true);
  });

  it("hides the picker for existing areas that predate the switch", () => {
    expect(hideServicesOffered({ document: {} })).toBe(true);
    expect(hideServicesOffered({ document: undefined })).toBe(true);
  });

  it("shows the picker once the switch is turned off", () => {
    expect(hideServicesOffered({ document: { offersAllServices: false } })).toBe(false);
  });
});

describe("validateServicesOffered", () => {
  const ref = { _ref: "service-1", _type: "reference" };

  it("requires nothing while the area offers all services", () => {
    expect(validateServicesOffered(undefined, { document: { offersAllServices: true } })).toBe(true);
    expect(validateServicesOffered([], { document: {} })).toBe(true);
  });

  it("requires at least one service when the switch is off", () => {
    expect(validateServicesOffered(undefined, { document: { offersAllServices: false } })).toMatch(/at least one service/i);
    expect(validateServicesOffered([], { document: { offersAllServices: false } })).toMatch(/at least one service/i);
  });

  it("accepts a picked subset when the switch is off", () => {
    expect(validateServicesOffered([ref], { document: { offersAllServices: false } })).toBe(true);
  });
});
