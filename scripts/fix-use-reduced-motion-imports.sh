#!/bin/bash
# Fix incorrect useReducedMotion imports from primitives to hooks

cd /Users/gurbakshchahal/AuraGlass

# Fix files that import useReducedMotion from primitives
for file in $(grep -rl "import.*useReducedMotion.*from.*primitives" src/); do
    echo "Fixing $file"

    # Case 1: import { Motion, useReducedMotion } from '../../primitives';
    # Should become two separate imports
    sed -i '' "s/import { Motion, useReducedMotion } from '..\/..\/primitives';/import { Motion } from '..\/..\/primitives';\nimport { useReducedMotion } from '..\/..\/hooks\/useReducedMotion';/g" "$file"

    # Case 2: import { OptimizedGlass, useReducedMotion } from '../../primitives';
    sed -i '' "s/import { OptimizedGlass, useReducedMotion } from '..\/..\/primitives';/import { OptimizedGlass } from '..\/..\/primitives';\nimport { useReducedMotion } from '..\/..\/hooks\/useReducedMotion';/g" "$file"

    # Case 3: import { Motion, useReducedMotion, useReducedMotion } from '../../primitives';
    # (duplicate imports - remove duplicate)
    sed -i '' "s/import { Motion, useReducedMotion, useReducedMotion } from '..\/..\/primitives';/import { Motion } from '..\/..\/primitives';\nimport { useReducedMotion } from '..\/..\/hooks\/useReducedMotion';/g" "$file"
done

echo "✓ Fixed all useReducedMotion imports"
