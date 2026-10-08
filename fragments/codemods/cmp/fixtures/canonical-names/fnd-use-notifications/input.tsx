// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { useNotifications } from 'aura-glass';

export function useX() {
  const { addNotification } = useNotifications();
  return addNotification;
}
