// REQ-PLAT-41 fixture: setTimeout(…, 0) is not an import effect; a delayed
// setTimeout is.
setTimeout(() => {}, 0);
setTimeout(() => {});
function scheduleFlush() {
  setTimeout(() => {}, 50);
}
scheduleFlush();
export const scheduled = true;
