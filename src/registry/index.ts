export { StyledComponentsRegistry } from "./StyledComponentsRegistry";
import { warnDeprecated } from "../utils/warnDeprecated";

// REQ-PLAT-58
warnDeprecated("DEP-P0059");
export {
  markStyledRegistryHealthy,
  ensureStyledComponentsRegistry,
  hasStyledComponentsRegistry,
} from "../server/registryGuard";
export {
  auraGlassRecipes,
  getAuraGlassRecipe,
  type AuraGlassRecipe,
  type AuraGlassRecipeFile,
  type AuraGlassRecipeId,
} from "./recipes";
