import { manifest } from "./manifest";

describe("PWA Manifest", () => {
  it("should have correct name and short_name", () => {
    const m = manifest();
    expect(m.name).toBe("Flavor Flow");
    expect(m.short_name).toBe("Flavor Flow");
  });

  it("should have icons", () => {
    const m = manifest();
    expect(m.icons).toBeDefined();
    expect(m.icons?.length).toBeGreaterThan(0);
  });

  it("should have correct display and start_url", () => {
    const m = manifest();
    expect(m.display).toBe("standalone");
    expect(m.start_url).toBe("/");
  });
});
