// REQ-PLAT-41 fixture: <html> attribute and inline style writes at import.
document.documentElement.setAttribute('data-theme', 'dark');
function applyVars() {
  document.documentElement.style.setProperty('--x', '1');
}
applyVars();
// attributes on other elements are not import effects
document.body.setAttribute('data-ok', '1');
export const applied = true;
