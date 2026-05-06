#!/usr/bin/env python3
"""
Comprehensive fix for all 816 style audit issues.
Fixes:
1. Missing glass-focus on interactive elements
2. Missing glass-touch-target on interactive elements
3. backdrop-blur -> glass-backdrop-blur
4. blur-xl -> glass-blur-xl
"""

import re
import sys
from pathlib import Path
from typing import Set

def add_glass_classes_to_interactive(content: str, file_path: Path) -> str:
    """Add glass-focus and glass-touch-target to all interactive elements."""

    # Pattern to match button, a, and input elements and their className
    # We'll look for elements that don't already have both glass-focus and glass-touch-target

    def fix_button_element(match):
        """Fix a single button/a/input element."""
        full_match = match.group(0)
        element_type = match.group(1)
        attrs_before_class = match.group(2) if match.group(2) else ""
        class_attr = match.group(3) if match.group(3) else ""
        attrs_after_class = match.group(4) if match.group(4) else ""
        closing = match.group(5)

        # Parse existing classes
        existing_classes = set()
        if class_attr:
            # Extract class value - handle both double and single quotes
            if 'className="' in class_attr:
                class_match = re.search(r'className="([^"]*)"', class_attr)
            elif "className='" in class_attr:
                class_match = re.search(r"className='([^']*)'", class_attr)
            elif 'className={' in class_attr:
                # Skip dynamic classNames
                return full_match
            else:
                class_match = None

            if class_match:
                existing_classes = set(class_match.group(1).split())

        # Add missing classes
        needs_focus = 'glass-focus' not in existing_classes
        needs_touch = 'glass-touch-target' not in existing_classes
        needs_contrast = 'glass-contrast-guard' not in existing_classes

        if not (needs_focus or needs_touch or needs_contrast):
            return full_match

        # Add the missing classes
        if needs_focus:
            existing_classes.add('glass-focus')
        if needs_touch:
            existing_classes.add('glass-touch-target')
        if needs_contrast:
            existing_classes.add('glass-contrast-guard')

        # Rebuild className
        new_classes = ' '.join(sorted(existing_classes))

        if class_attr:
            # Replace existing className
            if 'className="' in class_attr:
                new_class_attr = f'className="{new_classes}"'
            elif "className='" in class_attr:
                new_class_attr = f"className='{new_classes}'"
            else:
                new_class_attr = class_attr
            result = f'<{element_type}{attrs_before_class} {new_class_attr}{attrs_after_class}{closing}'
        else:
            # Add new className attribute
            result = f'<{element_type}{attrs_before_class} className="{new_classes}"{attrs_after_class}{closing}'

        return result

    # Match button, a, or input elements
    # This regex captures opening tags with their attributes
    pattern = r'<(button|a|input)(\s+[^>]*?)?\s*(className=[^\s>]+)?([^>]*?)?(\s*/?>)'

    content = re.sub(pattern, fix_button_element, content)

    return content


def fix_blur_classes(content: str) -> str:
    """Replace backdrop-blur and blur-xl with glass- prefixed versions."""

    # Replace backdrop-blur with glass-backdrop-blur
    content = re.sub(r'\bbackdrop-blur\b', 'glass-backdrop-blur', content)

    # Replace blur-xl with glass-blur-xl
    content = re.sub(r'\bblur-xl\b', 'glass-blur-xl', content)

    return content


def main():
    src_dir = Path('/Users/gurbakshchahal/AuraGlass/src')

    # Process all .tsx files
    tsx_files = list(src_dir.rglob('*.tsx'))
    ts_files = list(src_dir.rglob('*.ts'))
    all_files = tsx_files + ts_files

    print(f"Processing {len(all_files)} TypeScript files...")

    fixed_count = 0
    for file_path in all_files:
        try:
            content = file_path.read_text()
            original_content = content

            # Apply all fixes
            content = add_glass_classes_to_interactive(content, file_path)
            content = fix_blur_classes(content)

            if content != original_content:
                file_path.write_text(content)
                fixed_count += 1
                print(f"✓ Fixed: {file_path.relative_to(src_dir.parent)}")
        except Exception as e:
            print(f"✗ Error processing {file_path}: {e}")

    print(f"\n✓ Fixed {fixed_count} files")
    return 0


if __name__ == '__main__':
    sys.exit(main())
