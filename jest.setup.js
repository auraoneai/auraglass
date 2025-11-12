// jest.setup.js
console.log('jest.setup.js is running');

// Canvas mock: route through shared __mocks__/canvas implementation for Chart.js/jsdom
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('./__mocks__/canvas');
} catch (e) {
  // If the shared canvas mock can't be loaded, tests may fail for Chart.js usage.
  // Intentionally no inline fallback to avoid partial/corrupt mocks.
}

// Mock scrollIntoView for elements
if (typeof Element !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Element.prototype as any).scrollIntoView = jest.fn();
}