const noop = () => {};
window.addEventListener('scroll', noop);
document.addEventListener('resize', noop);
window.removeEventListener('scroll', noop);
export { noop };
