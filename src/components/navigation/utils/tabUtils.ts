import React from 'react';
export interface TabItem {
  id?: string;
  label: string;
  disabled?: boolean;
  width?: number;
}

export const calculateVisibleTabs = (
  tabs: TabItem[],
  containerWidth: number,
  tabWidth: number = 120
): { visibleTabs: TabItem[]; hiddenTabs: TabItem[] } => {
  const maxVisibleTabs = Math.floor(containerWidth / tabWidth);
  const visibleTabs = tabs.slice(0, maxVisibleTabs);
  const hiddenTabs = tabs.slice(maxVisibleTabs);

  return { visibleTabs, hiddenTabs };
};

export const calculateTotalBadgeCount = (tabs: TabItem[]): number => {
  return tabs.reduce((total, tab) => {
    // Assuming badge count might be stored somewhere, for now return 0
    return total;
  }, 0);
};

export const getNextEnabledTabIndex = (
  tabs: TabItem[],
  currentIndex: number,
  direction: 'next' | 'prev' = 'next'
): number => {
  let index = currentIndex;

  do {
    index = direction === 'next'
      ? (index + 1) % tabs.length
      : index === 0 ? tabs.length - 1 : index - 1;
  } while (tabs[index]?.disabled && index !== currentIndex);

  return index;
};

export const scrollTabIntoView = (
  tabElement: HTMLElement,
  containerElement: HTMLElement,
  behavior: 'smooth' | 'auto' = 'smooth'
): void => {
  const containerRect = containerElement.getBoundingClientRect();
  const tabRect = tabElement.getBoundingClientRect();

  if (tabRect.left < containerRect.left) {
    // Tab is to the left of the container
    containerElement.scrollBy({
      left: tabRect.left - containerRect.left - 16,
      behavior,
    });
  } else if (tabRect.right > containerRect.right) {
    // Tab is to the right of the container
    containerElement.scrollBy({
      left: tabRect.right - containerRect.right + 16,
      behavior,
    });
  }
};
