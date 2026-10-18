import { describe, expect, it } from "vitest";
import { toCreateGymPayload, type GymCreateRequest } from "./gyms.api";

const form: GymCreateRequest = {
  name: "  Iron Temple Ikeja ",
  description: "",
  email: " ikeja@irontemple.com ",
  phone: " +2348000000000 ",
  website: "",
  address: { street: "5 Allen Ave", city: "Ikeja", state: "Lagos", postalCode: "", country: "Nigeria" },
};

describe("toCreateGymPayload (frontend form → backend CreateGymRequest)", () => {
  it("uses the field names the API validates", () => {
    const payload = toCreateGymPayload(form);

    expect(payload).toMatchObject({
      name: "Iron Temple Ikeja",
      contactEmail: "ikeja@irontemple.com",
      contactPhone: "+2348000000000",
      address: "5 Allen Ave",
      city: "Ikeja",
      state: "Lagos",
      country: "Nigeria",
    });
    // the old shape the API rejects with "Contact email is required"
    expect(payload).not.toHaveProperty("email");
    expect(payload).not.toHaveProperty("phone");
  });

  it("drops blank optional fields instead of sending empty strings", () => {
    const payload = toCreateGymPayload(form);
    expect(payload.description).toBeUndefined();
    expect(payload.postalCode).toBeUndefined();
  });

  it("passes the currency and timezone so the new gym doesn't default to USD", () => {
    const payload = toCreateGymPayload({ ...form, currency: "NGN", timezone: "Africa/Lagos" });
    expect(payload.currency).toBe("NGN");
    expect(payload.timezone).toBe("Africa/Lagos");
  });
});
