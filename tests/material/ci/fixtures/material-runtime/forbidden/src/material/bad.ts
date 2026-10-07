export const auto = () => {
  const io = new IntersectionObserver(() => {});
  requestAnimationFrame(() => {});
  document.querySelectorAll('[data-ag-tier]').forEach((el) => el.setAttribute('data-ag-tier', 'lightweight'));
  return io;
};
