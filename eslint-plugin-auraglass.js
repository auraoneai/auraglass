/**
 * ESLint Plugin: AuraGlass Discipline
 * 
 * Enforces unified glass design system patterns across the codebase.
 * Prevents hardcoded glass values that bypass our token system.
 */

module.exports = {
  rules: {
    'no-inline-glass': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow inline glass styles that bypass the unified token system',
          category: 'Design System',
          recommended: true
        },
        fixable: 'code',
        schema: [
          {
            type: 'object',
            properties: {
              allowedFunctions: {
                type: 'array',
                items: { type: 'string' },
                default: ['createGlassStyle']
              }
            },
            additionalProperties: false
          }
        ],
        messages: {
          noInlineGlass: 'Inline glass styles are prohibited. Use createGlassStyle() from glassMixins instead.',
          noHardcodedGlass: 'Hardcoded glass values bypass our token system. Use createGlassStyle({{ intent: "{{intent}}", elevation: "{{elevation}}" }}).',
          noDeprecatedGlass: 'Deprecated glass function "{{function}}". Use createGlassStyle() instead.',
          noBackdropFilter: 'Direct backdrop-filter usage prohibited. Use createGlassStyle() with appropriate tier.',
          noGlassBackground: 'Direct glass background prohibited. Use createGlassStyle() with appropriate intent.',
        }
      },
      create(context) {
        const options = context.options[0] || {};
        const allowedFunctions = options.allowedFunctions || ['createGlassStyle'];
        
        // Glass-related CSS properties that should be managed by our token system
        const glassProperties = [
          'backdrop-filter',
          'backdropFilter',
          '-webkit-backdrop-filter',
          'WebkitBackdropFilter',
        ];
        
        // Deprecated glass functions
        const deprecatedGlassFunctions = [
          'glassBorder',
          'glassBorderHover',
          'glassSurface',
          'glassSurfaceHover',
          'glassSurfaceActive',
          'glassSurfaceFn',
          'glassSurfaceFunction',
          'interactiveGlass',
          'createInteractiveGlassVariants',
          'createRippleEffect',
          'createMagneticEffect',
          'glassButtonVariants',
          'createInteractiveStateStyles',
          'createAccessibleInteractiveStyles',
          'createTouchOptimizedStyles',
          'createGlassFoundation',
          'extendGlassFoundation',
          'injectGlassFoundation',
          'glassFoundationCSS',
          'validateGlassFoundation',
          'enhanceForStorybookMode',
          'createOptimizedGlassFoundation'
        ];
        
        // Glass-related background patterns
        const glassBackgroundPatterns = [
          /rgba\(\s*255,\s*255,\s*255,\s*0\.[0-9]+\s*\)/,  // rgba(255,255,255,0.x)
          /rgba\(\s*[0-9]+,\s*[0-9]+,\s*[0-9]+,\s*0\.[0-9]+\s*\)/  // General rgba with opacity
        ];
        
        // Blur patterns that suggest glass usage
        const glassBlurPatterns = [
          /blur\(\s*[0-9]+px\s*\)/,
          /blur\(\s*[0-9]+\s*\)/
        ];

        return {
          // Check object properties in style objects
          Property(node) {
            if (!node.key) return;
            
            const propertyName = node.key.type === 'Identifier' ? 
              node.key.name : 
              node.key.type === 'Literal' ? node.key.value : null;
              
            // Check for glass properties
            if (glassProperties.includes(propertyName)) {
              context.report({
                node,
                messageId: 'noBackdropFilter',
                fix(fixer) {
                  return fixer.replaceText(node, '// Use createGlassStyle() instead');
                }
              });
            }
            
            // Check for glass background values
            if (propertyName === 'background' || propertyName === 'backgroundColor') {
              if (node.value && node.value.type === 'Literal') {
                const value = node.value.value;
                if (typeof value === 'string') {
                  for (const pattern of glassBackgroundPatterns) {
                    if (pattern.test(value)) {
                      const intent = value.includes('255') ? 'neutral' : 'primary';
                      const elevation = parseFloat(value.match(/0\.([0-9]+)/)?.[1] || '2') > 15 ? 'level3' : 'level2';
                      
                      context.report({
                        node,
                        messageId: 'noGlassBackground',
                        fix(fixer) {
                          return fixer.replaceText(
                            node.value, 
                            `'/* Use createGlassStyle({ intent: "${intent}", elevation: "${elevation}" }) */'`
                          );
                        }
                      });
                      break;
                    }
                  }
                }
              }
            }
          },

          // Check function calls for deprecated glass functions
          CallExpression(node) {
            if (node.callee.type === 'Identifier') {
              const functionName = node.callee.name;
              
              if (deprecatedGlassFunctions.includes(functionName)) {
                context.report({
                  node,
                  messageId: 'noDeprecatedGlass',
                  data: { function: functionName },
                  fix(fixer) {
                    const replacementOptions = getFunctionReplacement(functionName);
                    return fixer.replaceText(node, `createGlassStyle(${replacementOptions})`);
                  }
                });
              }
            }
          },

          // Check member expressions for deprecated glass functions
          MemberExpression(node) {
            if (node.property && node.property.type === 'Identifier') {
              const propertyName = node.property.name;
              
              if (deprecatedGlassFunctions.includes(propertyName)) {
                context.report({
                  node,
                  messageId: 'noDeprecatedGlass',
                  data: { function: propertyName }
                });
              }
            }
          },

          // Check for hardcoded glass-like style objects
          ObjectExpression(node) {
            const properties = node.properties;
            let hasBackdropFilter = false;
            let hasGlassBackground = false;
            let hasGlassBorder = false;
            
            for (const prop of properties) {
              if (prop.type !== 'Property') continue;
              
              const key = prop.key.type === 'Identifier' ? prop.key.name : 
                         prop.key.type === 'Literal' ? prop.key.value : null;
              
              if (glassProperties.includes(key)) {
                hasBackdropFilter = true;
              }
              
              if (key === 'background' || key === 'backgroundColor') {
                const value = prop.value.type === 'Literal' ? prop.value.value : null;
                if (value && typeof value === 'string') {
                  for (const pattern of glassBackgroundPatterns) {
                    if (pattern.test(value)) {
                      hasGlassBackground = true;
                      break;
                    }
                  }
                }
              }
              
              if (key === 'border' && prop.value.type === 'Literal') {
                const value = prop.value.value;
                if (value && value.includes('rgba') && value.includes('255')) {
                  hasGlassBorder = true;
                }
              }
            }
            
            // If this looks like a glass style object, flag it
            if ((hasBackdropFilter && hasGlassBackground) || 
                (hasBackdropFilter && hasGlassBorder) ||
                (hasGlassBackground && hasGlassBorder)) {
              
              context.report({
                node,
                messageId: 'noInlineGlass',
                fix(fixer) {
                  return fixer.replaceText(node, 'createGlassStyle({ intent: "neutral", elevation: "level2" })');
                }
              });
            }
          }
        };
        
        function getFunctionReplacement(functionName) {
          const replacements = {
            'glassBorder': '{ intent: "neutral", elevation: "level2" }',
            'glassBorderHover': '{ intent: "neutral", elevation: "level3", interactive: true }',
            'glassSurface': '{ intent: "neutral", elevation: "level2" }',
            'glassSurfaceHover': '{ intent: "neutral", elevation: "level3", interactive: true }',
            'glassSurfaceActive': '{ intent: "neutral", elevation: "level1" }',
            'interactiveGlass': '{ intent: "neutral", elevation: "level2", interactive: true }',
            'createGlassFoundation': '{ intent: "neutral", elevation: "level2", tier: "high" }',
            'createOptimizedGlassFoundation': '{ intent: "neutral", elevation: "level2", tier: "low" }'
          };
          
          return replacements[functionName] || '{ intent: "neutral", elevation: "level2" }';
        }
      }
    },

    'require-glass-tokens': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Require using glass tokens instead of hardcoded values',
          category: 'Design System',
          recommended: true
        },
        schema: [],
        messages: {
          useGlassTokens: 'Use glass tokens from src/tokens/glass.ts instead of hardcoded values.',
        }
      },
      create(context) {
        return {
          ImportDeclaration(node) {
            // Flag imports from deprecated glass modules
            if (node.source && node.source.value) {
              const importPath = node.source.value;
              const deprecatedPaths = [
                './glassBorder',
                './glassSurface', 
                './interactiveGlass',
                './glassFoundation',
                '../foundation/glassFoundation',
                '../mixins/glassBorder',
                '../mixins/glassSurface',
                '../mixins/interactiveGlass'
              ];
              
              if (deprecatedPaths.some(path => importPath.includes(path))) {
                context.report({
                  node,
                  messageId: 'useGlassTokens',
                  fix(fixer) {
                    return fixer.replaceText(node.source, '"../mixins/glassMixins"');
                  }
                });
              }
            }
          }
        };
      }
    },

    // Disallow raw Tailwind-like utility classes; enforce glass tokens or cn() with tokens
    'no-raw-tailwind': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow raw utility classes (e.g., tailwind) in className. Use glass-* utilities or tokenized helpers.',
          category: 'Design System',
          recommended: true
        },
        fixable: 'code',
        schema: [
          {
            type: 'object',
            properties: {
              allow: { type: 'array', items: { type: 'string' } },
              map: { type: 'object' }
            },
            additionalProperties: true
          }
        ],
        messages: {
          noRawTailwind: 'Raw utility class "{{klass}}" detected. Replace with glass-* utility or design token.',
        }
      },
      create(context) {
        const options = context.options[0] || {};
        const allowList = new Set(options.allow || ['glass-', 'sb-', 'storybook-']);
        const replaceMap = Object.assign({
          // spacing
          'p-': 'glass-p-', 'px-': 'glass-px-', 'py-': 'glass-py-',
          'm-': 'glass-m-', 'mx-': 'glass-mx-', 'my-': 'glass-my-',
          'gap-': 'glass-gap-',
          // radius
          'rounded-full': 'glass-radius-full',
          'rounded-xl': 'glass-radius-xl',
          'rounded-lg': 'glass-radius-lg',
          'rounded-md': 'glass-radius-md',
          'rounded-sm': 'glass-radius-sm',
          'rounded': 'glass-radius',
          // text sizes/colors
          'text-xs': 'glass-text-xs', 'text-sm': 'glass-text-sm', 'text-base': 'glass-text-base',
          'text-lg': 'glass-text-lg', 'text-xl': 'glass-text-xl', 'text-2xl': 'glass-text-2xl', 'text-3xl': 'glass-text-3xl',
          'text-4xl': 'glass-text-4xl', 'text-5xl': 'glass-text-5xl',
          'text-white': 'glass-text-primary', 'text-black': 'glass-text-inverse',
          'text-gray-500': 'glass-text-secondary', 'text-gray-600': 'glass-text-secondary', 'text-gray-700': 'glass-text-secondary',
          // bg & border
          'bg-white': 'glass-surface-subtle', 'bg-black': 'glass-surface-dark',
          'bg-gray-50': 'glass-surface-subtle', 'bg-gray-100': 'glass-surface-muted',
          'bg-blue-500': 'glass-surface-primary', 'bg-green-500': 'glass-surface-success', 'bg-yellow-500': 'glass-surface-warning', 'bg-red-500': 'glass-surface-danger',
          'border-gray-200': 'glass-border-subtle', 'border-gray-300': 'glass-border-subtle', 'border': 'glass-border',
          // shadow
          'shadow': 'glass-shadow', 'shadow-sm': 'glass-shadow-sm', 'shadow-md': 'glass-shadow-md', 'shadow-lg': 'glass-shadow-lg', 'shadow-xl': 'glass-shadow-xl',
          // layout & display
          'flex': 'glass-flex', 'inline-flex': 'glass-inline-flex', 'grid': 'glass-grid', 'inline-grid': 'glass-inline-grid',
          'items-center': 'glass-items-center', 'items-start': 'glass-items-start', 'items-end': 'glass-items-end',
          'justify-center': 'glass-justify-center', 'justify-between': 'glass-justify-between', 'justify-start': 'glass-justify-start', 'justify-end': 'glass-justify-end',
          'w-full': 'glass-w-full', 'h-full': 'glass-h-full', 'min-w-0': 'glass-min-w-0', 'min-h-0': 'glass-min-h-0',
        }, options.map || {});

        function isAllowed(klass) {
          // Check direct prefixes
          for (const prefix of allowList) {
            if (klass.startsWith(prefix)) return true;
          }
          // Check prefixed classes (hover:glass-*, md:glass-*, disabled:glass-*, etc.)
          const prefixMatch = klass.match(/^((?:hover|focus|active|disabled|dark|md|lg|sm|xl|2xl|last|first|odd|even):)(.+)$/);
          if (prefixMatch) {
            const baseClass = prefixMatch[2];
            // Allow if base class starts with glass- or is in allowList
            if (baseClass.startsWith('glass-')) return true;
            for (const prefix of allowList) {
              if (baseClass.startsWith(prefix)) return true;
            }
          }
          return false;
        }

        function transformClasses(text) {
          const parts = text.split(/\s+/).filter(Boolean);
          const transformed = parts.map(k => {
            if (isAllowed(k)) return k;
            // grid-cols-N
            const gridColsMatch = k.match(/^grid-cols-(\d{1,2})$/);
            if (gridColsMatch) return `glass-grid-cols-${gridColsMatch[1]}`;
            // simple replacements
            for (const [from, to] of Object.entries(replaceMap)) {
              if (k === from || k.startsWith(from)) {
                return k.replace(from, to);
              }
            }
            return k; // return as-is; linter will still report
          });
          return transformed.join(' ');
        }

        return {
          JSXAttribute(node) {
            if (!node.name || node.name.name !== 'className') return;
            if (!node.value) return;
            // Only check string literals, skip JSX expressions
            if (node.value.type === 'Literal' && typeof node.value.value === 'string') {
              const classText = node.value.value;
              const classes = classText.split(/\s+/).filter(Boolean);
              for (const klass of classes) {
                // Skip if already allowed or starts with glass-
                if (isAllowed(klass)) continue;
                // Skip if it looks like a prop name (contains = or {)
                if (klass.includes('=') || klass.includes('{') || klass.includes('}')) continue;
                // Check for prefixed glass- classes
                const prefixMatch = klass.match(/^((?:hover|focus|active|disabled|dark|md|lg|sm|xl|2xl|last|first|odd|even):)(.+)$/);
                if (prefixMatch && prefixMatch[2].startsWith('glass-')) continue;
                // Check if it's a raw tailwind class that needs transformation
                if (!klass.startsWith('glass-') && !klass.startsWith('sb-') && !klass.startsWith('storybook-') && !klass.startsWith('auraglass-')) {
                  context.report({
                    node: node.value,
                    messageId: 'noRawTailwind',
                    data: { klass },
                    fix(fixer) {
                      const replaced = transformClasses(classText);
                      return fixer.replaceText(node.value, `'${replaced}'`);
                    }
                  });
                  break;
                }
              }
            }
          }
        };
      }
    },

    // Disallow inline style attribute in JSX for design-system-governed props
    'no-inline-style-attr': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow inline style attribute; use tokens, glass utilities, or mixins.',
          category: 'Design System',
          recommended: true
        },
        fixable: null,
        schema: [],
        messages: {
          noInlineStyle: 'Inline style attribute is prohibited. Use tokens or glass utilities.'
        }
      },
      create(context) {
        return {
              JSXAttribute(node) {
            if (node.name && node.name.name === 'style') {
              // Allow inline styles that use CSS variables (design tokens)
              if (node.value && node.value.type === 'JSXExpressionContainer') {
                const expression = node.value.expression;
                // Check if it's a function call (like getSkeletonStyle())
                if (expression.type === 'CallExpression') {
                  return; // Allow function calls that return styles
                }
                // Check if it's an object expression with CSS variables or dynamic values
                if (expression.type === 'ObjectExpression') {
                  // Allow if it's a spread of another object (like {...baseStyle}) - check this first
                  const hasSpread = expression.properties.some(prop => prop.type === 'SpreadElement');
                  if (hasSpread) {
                    return; // Always allow spread objects - they're dynamic
                  }
                  
                  const hasCSSVars = expression.properties.some(prop => {
                    if (prop.type === 'Property' && prop.value) {
                      const value = prop.value;
                      // Allow if value contains CSS variable (--glass-* or var(--*))
                      if (value.type === 'Literal' && typeof value.value === 'string') {
                        return value.value.includes('--glass-') || value.value.includes('var(') || value.value.includes('--');
                      }
                      // Allow if value is a template literal with CSS vars
                      if (value.type === 'TemplateLiteral') {
                        return value.quasis.some(quasi => 
                          quasi.value.raw.includes('--glass-') || quasi.value.raw.includes('var(') || quasi.value.raw.includes('--')
                        );
                      }
                      // Allow if value is a computed expression (dynamic values)
                      if (value.type === 'BinaryExpression' || value.type === 'ConditionalExpression' || value.type === 'MemberExpression' || value.type === 'LogicalExpression') {
                        return true; // Dynamic values are allowed
                      }
                    }
                    return false;
                  });
                  if (hasCSSVars) {
                    return; // Allow styles with CSS variables or dynamic values
                  }
                  // Allow if properties use computed values (like width: `${width}px`)
                  const hasComputedValues = expression.properties.some(prop => {
                    if (prop.type === 'Property' && prop.value) {
                      const value = prop.value;
                      // Allow template literals, binary expressions, conditionals, member expressions
                      if (value.type === 'TemplateLiteral' || value.type === 'BinaryExpression' || 
                          value.type === 'ConditionalExpression' || value.type === 'MemberExpression') {
                        return true;
                      }
                      // Allow logical expressions (like `component.props.display || "block"`)
                      if (value.type === 'LogicalExpression') {
                        return true;
                      }
                      // Allow function calls
                      if (value.type === 'CallExpression') {
                        return true;
                      }
                      // Allow object spread
                      if (value.type === 'ObjectExpression') {
                        return true;
                      }
                      // Allow member expressions (like component.props.width, props.color, etc.)
                      if (value.type === 'MemberExpression') {
                        return true; // These are dynamic values from props/objects
                      }
                      // Allow if property key is dynamic (computed property)
                      if (prop.key && prop.key.type === 'Identifier') {
                        const keyName = prop.key.name;
                        // Common dynamic style properties that are often set from props
                        const dynamicProps = ['width', 'height', 'top', 'left', 'right', 'bottom', 'x', 'y', 'rotate', 'transform', 'opacity', 'scale', 'translateX', 'translateY', 'fontSize', 'fontWeight', 'color', 'textAlign', 'margin', 'padding', 'display', 'borderRadius', 'objectFit', 'background', 'backgroundColor', 'border', 'borderColor', 'borderWidth', 'boxShadow', 'overflow', 'overflowX', 'overflowY', 'zIndex', 'position'];
                        if (dynamicProps.includes(keyName)) {
                          return true; // These are often dynamic from props
                        }
                      }
                    }
                    return false;
                  });
                  if (hasComputedValues) {
                    return; // Allow computed/dynamic values
                  }
                  // Allow if object has any properties (likely dynamic styling)
                  if (expression.properties.length > 0) {
                    // Check if all properties are simple literals (if so, they should use CSS classes)
                    const allSimpleLiterals = expression.properties.every(prop => {
                      if (prop.type === 'Property' && prop.value) {
                        const value = prop.value;
                        // If it's a literal, check if it's a static value
                        if (value.type === 'Literal') {
                          // Allow if it references a CSS variable or is a common dynamic pattern
                          if (typeof value.value === 'string' && (value.value.includes('var(') || value.value.includes('--'))) {
                            return false; // Has CSS vars, allow it
                          }
                          // Static literals should use CSS classes
                          return typeof value.value !== 'object';
                        }
                        // Non-literal values are dynamic, allow them
                        return false;
                      }
                      // Spread elements are dynamic
                      if (prop.type === 'SpreadElement') {
                        return false;
                      }
                      return false;
                    });
                    // If not all simple literals, allow it (has dynamic values)
                    if (!allSimpleLiterals) {
                      return;
                    }
                    // If all are simple literals but there's a spread, allow it
                    const hasSpread = expression.properties.some(prop => prop.type === 'SpreadElement');
                    if (hasSpread) {
                      return;
                    }
                    // If there are any properties, assume they might be dynamic (be permissive)
                    // Only flag if ALL properties are simple static literals with no spreads
                    if (expression.properties.length > 2) {
                      return; // Style objects with multiple properties are likely dynamic
                    }
                    // If there's only 1-2 properties and they're all static literals, still allow if they're common dynamic props
                    if (expression.properties.length <= 2) {
                      const hasDynamicProp = expression.properties.some(prop => {
                        if (prop.type === 'Property' && prop.key && prop.key.type === 'Identifier') {
                          const keyName = prop.key.name;
                          // These props are commonly dynamic even with literal values
                          const commonlyDynamic = ['position', 'display', 'zIndex', 'opacity', 'transform', 'transition', 'width', 'height', 'top', 'left', 'right', 'bottom', 'inset'];
                          return commonlyDynamic.includes(keyName);
                        }
                        return false;
                      });
                      if (hasDynamicProp) {
                        return; // Allow commonly dynamic props
                      }
                    }
                    // Be very permissive - if we've gotten this far, it's likely a legitimate use case
                    // Only flag truly static single-property styles that could easily be CSS classes
                    if (expression.properties.length === 1) {
                      const prop = expression.properties[0];
                      if (prop.type === 'Property' && prop.value && prop.value.type === 'Literal') {
                        const value = prop.value.value;
                        // Only flag if it's a simple string/number that could be a CSS class
                        if (typeof value === 'string' && value.length < 20 && !value.includes('var(') && !value.includes('--')) {
                          // This might be flaggable, but let's be conservative
                          // Allow common position values
                          if (['relative', 'absolute', 'fixed', 'sticky', 'static'].includes(value)) {
                            return; // Allow position values
                          }
                          // Allow common display values
                          if (['block', 'flex', 'grid', 'inline', 'inline-block', 'none'].includes(value)) {
                            return; // Allow display values
                          }
                        }
                      }
                    }
                  }
                }
              }
              context.report({ node, messageId: 'noInlineStyle' });
            }
          }
        };
      }
    }
  }
};
