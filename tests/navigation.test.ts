import { describe, expect, it } from "vitest";
import { isActivePath } from "@/data/navigation";

describe("isActivePath", () => {
  it("ana sayfayı yalnızca tam eşleşmede etkin sayar", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/hizmetler", "/")).toBe(false);
  });

  it("bölüm sayfasını ve alt sayfalarını etkin sayar", () => {
    expect(isActivePath("/hizmetler", "/hizmetler")).toBe(true);
    expect(isActivePath("/hizmetler/diyabet", "/hizmetler")).toBe(true);
    expect(isActivePath("/hizmetler/a/b", "/hizmetler")).toBe(true);
  });

  it("benzer önekli yolları eşleştirmez", () => {
    expect(isActivePath("/hizmetlerx", "/hizmetler")).toBe(false);
    expect(isActivePath("/belirtiler", "/hizmetler")).toBe(false);
    expect(isActivePath("/belirtilerx", "/belirtiler")).toBe(false);
  });
});
