import {
  calculateTotalBadgeCount,
  calculateVisibleTabs,
  getNextEnabledTabIndex,
  TabItem,
} from "./tabUtils";

describe("tabUtils", () => {
  describe("calculateTotalBadgeCount", () => {
    it("returns 0 for an empty list", () => {
      expect(calculateTotalBadgeCount([])).toBe(0);
    });

    it("returns 0 when no tabs have badges", () => {
      const tabs: TabItem[] = [{ label: "A" }, { label: "B" }];
      expect(calculateTotalBadgeCount(tabs)).toBe(0);
    });

    it("sums numeric badges", () => {
      const tabs: TabItem[] = [
        { label: "Inbox", badge: 3 },
        { label: "Alerts", badge: 5 },
        { label: "Empty" },
      ];
      expect(calculateTotalBadgeCount(tabs)).toBe(8);
    });

    it("parses numeric string badges", () => {
      const tabs: TabItem[] = [
        { label: "A", badge: "12" },
        { label: "B", badge: 8 },
      ];
      expect(calculateTotalBadgeCount(tabs)).toBe(20);
    });

    it("treats non-numeric string badges as 0", () => {
      const tabs: TabItem[] = [
        { label: "A", badge: "Live" },
        { label: "B", badge: 4 },
      ];
      expect(calculateTotalBadgeCount(tabs)).toBe(4);
    });
  });

  describe("calculateVisibleTabs", () => {
    it("splits tabs into visible and hidden based on container width", () => {
      const tabs: TabItem[] = [
        { label: "1" },
        { label: "2" },
        { label: "3" },
        { label: "4" },
      ];
      const { visibleTabs, hiddenTabs } = calculateVisibleTabs(tabs, 240, 120);
      expect(visibleTabs).toHaveLength(2);
      expect(hiddenTabs).toHaveLength(2);
    });
  });

  describe("getNextEnabledTabIndex", () => {
    it("skips disabled tabs going forward", () => {
      const tabs: TabItem[] = [
        { label: "0" },
        { label: "1", disabled: true },
        { label: "2" },
      ];
      expect(getNextEnabledTabIndex(tabs, 0, "next")).toBe(2);
    });

    it("wraps around going backward", () => {
      const tabs: TabItem[] = [{ label: "0" }, { label: "1" }];
      expect(getNextEnabledTabIndex(tabs, 0, "prev")).toBe(1);
    });
  });
});
