// jest.setup.js
console.log('jest.setup.js is running');

// Mock scrollIntoView for elements
if (typeof Element !== 'undefined') {
  Element.prototype.scrollIntoView = jest.fn();
}