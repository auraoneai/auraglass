/* scripts/docs/apg-keyboard.mjs — PLAT-378 (REQ-PLAT-100). Keyboard tables for the
   generated component reference, keyed by the WAI-ARIA APG pattern a meta names
   in `apg` (S-31). Rows restate the "Keyboard Interaction" section of each APG
   pattern page (https://www.w3.org/WAI/ARIA/apg/patterns/<pattern>/); a pattern
   that is not listed here renders as pending on the page — never guessed. */

const APG_BASE = 'https://www.w3.org/WAI/ARIA/apg/patterns/';

/** pattern id → [key, action] rows. Patterns with no keyboard interaction map to []. */
export const APG_KEYBOARD = {
  accordion: [
    ['Enter / Space', 'Expands or collapses the focused accordion header'],
    ['Tab / Shift+Tab', 'Moves focus to the next / previous focusable element'],
    ['ArrowDown / ArrowUp', 'Moves focus to the next / previous accordion header (optional)'],
    ['Home / End', 'Moves focus to the first / last accordion header (optional)'],
  ],
  alert: [],
  alertdialog: [
    ['Tab / Shift+Tab', 'Cycles focus through the focusable elements inside the dialog'],
    ['Escape', 'Closes the dialog'],
  ],
  button: [
    ['Enter', 'Activates the button'],
    ['Space', 'Activates the button'],
  ],
  carousel: [
    ['Tab / Shift+Tab', 'Moves focus through the rotation control, slide controls and slide content'],
    ['Enter / Space', 'Activates the focused previous / next / picker control'],
    ['ArrowLeft / ArrowRight', 'Moves between slide picker tabs when the picker is a tablist'],
  ],
  checkbox: [['Space', 'Toggles the checkbox']],
  combobox: [
    ['ArrowDown / ArrowUp', 'Opens the listbox and moves the visual focus to the next / previous option'],
    ['Enter', 'Accepts the focused option and closes the listbox'],
    ['Escape', 'Closes the listbox (clears the input when already closed)'],
    ['Alt+ArrowDown', 'Opens the listbox without moving focus'],
    ['Home / End', 'Moves the caret to the start / end of the input'],
  ],
  'dialog-modal': [
    ['Tab / Shift+Tab', 'Cycles focus through the focusable elements inside the dialog'],
    ['Escape', 'Closes the dialog'],
  ],
  disclosure: [['Enter / Space', 'Toggles the visibility of the controlled content']],
  grid: [
    ['ArrowRight / ArrowLeft', 'Moves focus one cell right / left'],
    ['ArrowDown / ArrowUp', 'Moves focus one cell down / up'],
    ['Home / End', 'Moves focus to the first / last cell of the row'],
    ['Ctrl+Home / Ctrl+End', 'Moves focus to the first / last cell of the grid'],
    ['PageDown / PageUp', 'Moves focus down / up by a page of rows'],
  ],
  group: [],
  'menu-button': [
    ['Enter / Space', 'Opens the menu and focuses the first item'],
    ['ArrowDown / ArrowUp', 'Opens the menu and focuses the first / last item'],
    ['Escape', 'Closes the menu and returns focus to the button'],
  ],
  radio: [
    ['Tab / Shift+Tab', 'Moves focus into and out of the radio group (to the checked radio)'],
    ['ArrowDown / ArrowRight', 'Checks the next radio, wrapping to the first'],
    ['ArrowUp / ArrowLeft', 'Checks the previous radio, wrapping to the last'],
    ['Space', 'Checks the focused radio if it is not already checked'],
  ],
  region: [],
  searchbox: [
    ['Enter', 'Submits the search'],
    ['Escape', 'Clears the search field'],
  ],
  select: [
    ['Enter / Space / ArrowDown', 'Opens the listbox'],
    ['ArrowDown / ArrowUp', 'Moves the visual focus to the next / previous option'],
    ['Home / End', 'Moves the visual focus to the first / last option'],
    ['Enter', 'Selects the focused option and closes the listbox'],
    ['Escape', 'Closes the listbox without changing the value'],
    ['Printable characters', 'Type-ahead to the next option starting with the typed string'],
  ],
  slider: [
    ['ArrowRight / ArrowUp', 'Increases the value by one step'],
    ['ArrowLeft / ArrowDown', 'Decreases the value by one step'],
    ['PageUp / PageDown', 'Increases / decreases the value by a large step'],
    ['Home / End', 'Sets the value to the minimum / maximum'],
  ],
  spinbutton: [
    ['ArrowUp / ArrowDown', 'Increases / decreases the value by one step'],
    ['PageUp / PageDown', 'Increases / decreases the value by a large step'],
    ['Home / End', 'Sets the value to the minimum / maximum'],
  ],
  switch: [
    ['Space', 'Toggles the switch'],
    ['Enter', 'Toggles the switch (optional)'],
  ],
  table: [],
  textbox: [],
  toolbar: [
    ['Tab / Shift+Tab', 'Moves focus into and out of the toolbar (one tab stop)'],
    ['ArrowRight / ArrowLeft', 'Moves focus to the next / previous control (horizontal toolbar)'],
    ['Home / End', 'Moves focus to the first / last control'],
  ],
  tooltip: [['Escape', 'Dismisses the tooltip']],
  treeview: [
    ['ArrowDown / ArrowUp', 'Moves focus to the next / previous visible node'],
    ['ArrowRight', 'Opens a closed node, or moves to its first child'],
    ['ArrowLeft', 'Closes an open node, or moves to its parent'],
    ['Home / End', 'Moves focus to the first / last visible node'],
    ['Enter', 'Activates the focused node'],
    ['*', 'Expands all siblings at the focused level (optional)'],
  ],
};

/** Normalise a meta `apg` value ('dialog-modal', 'apg/carousel-rail', a full APG URL) to a pattern id. */
export function apgPattern(apg) {
  if (!apg) return null;
  let id = String(apg).trim();
  if (id.startsWith(APG_BASE)) id = id.slice(APG_BASE.length);
  else if (/^https?:\/\//.test(id)) return id; // an APG practice page, not a pattern: no keyboard table (pending)
  id = id.replace(/^apg\//, '').split('/')[0];
  if (id === 'carousel-rail') return 'carousel';
  return id;
}

/** { pattern, url, rows } — rows is null when the pattern has no keyboard table here (rendered pending). */
export function keyboardFor(apg) {
  const pattern = apgPattern(apg);
  if (!pattern) return { pattern: null, url: null, rows: [] };
  const rows = Object.hasOwn(APG_KEYBOARD, pattern) ? APG_KEYBOARD[pattern] : null;
  const url = /^https?:/.test(pattern) ? pattern : rows ? `${APG_BASE}${pattern}/` : null;
  return { pattern, url, rows };
}
