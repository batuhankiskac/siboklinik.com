import { describe, expect, it } from "vitest";
import { resolveContentHref } from "../src/lib/home-links";

describe("resolveContentHref", () => {
  const ids = new Set(["siskinlik"]);

  it("var olan makale bağlantısını korur", () => {
    expect(resolveContentHref("/belirtiler/siskinlik", "/belirtiler", ids)).toBe("/belirtiler/siskinlik");
  });

  it("olmayan makaleyi liste sayfasına düşürür", () => {
    expect(resolveContentHref("/belirtiler/silindi", "/belirtiler", ids)).toBe("/belirtiler");
  });

  it("başka bağlantılara dokunmaz", () => {
    expect(resolveContentHref("/#iletisim", "/belirtiler", ids)).toBe("/#iletisim");
    expect(resolveContentHref(undefined, "/belirtiler", ids)).toBeUndefined();
  });
});
