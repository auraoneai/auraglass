// REQ-PLAT-41 fixture: a module that registers a document listener and an
// interval timer at import time (two global side effects).
document.addEventListener('click', () => {});
const id = setInterval(() => {}, 1000);
clearInterval(id);
export const registered = true;
