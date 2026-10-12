// REQ-PLAT-41 fixture: a module that registers a document listener at top
// level and a window listener + interval timer from a named function.
document.addEventListener('click', () => {});
function startTracking() {
  window.addEventListener('scroll', () => {});
  const id = setInterval(() => {}, 1000);
  clearInterval(id);
}
startTracking();
export const registered = true;
