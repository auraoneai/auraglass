// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Toast } from 'aura-glass';

<Toast.Provider timeout={4000}>
  <Toast.Viewport position="top-center" />
  <App />
</Toast.Provider>
