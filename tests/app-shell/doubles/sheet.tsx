/* Sheet double (W1 local): contract S-30 names the parts
   Root/Trigger/Content/Title/Description/Close — same shape as Dialog.
   Lives under tests/app-shell (lane-owned), not the contract doubles dir. */
import { Dialog } from './dialog';

export const Sheet = {
  Root: Dialog.Root,
  Trigger: Dialog.Trigger,
  Content: Dialog.Content,
  Title: Dialog.Title,
  Description: Dialog.Description,
  Close: Dialog.Close,
};
