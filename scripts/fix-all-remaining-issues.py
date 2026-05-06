#!/usr/bin/env python3
"""
Comprehensive fix for all remaining style audit issues.
Targets all 723 remaining issues to achieve 0 issues.
"""

import re
import sys
from pathlib import Path
from typing import Tuple

def fix_class_prefix_issues(content: str) -> str:
    """Fix backdrop-blur and blur-xl to use glass- prefix."""
    # Replace word-bounded instances only
    content = re.sub(r'\bbackdrop-blur\b', 'glass-backdrop-blur', content)
    content = re.sub(r'\bblur-xl\b', 'glass-blur-xl', content)
    content = re.sub(r'\bblur-lg\b', 'glass-blur-lg', content)
    content = re.sub(r'\bblur-md\b', 'glass-blur-md', content)
    content = re.sub(r'\bblur-sm\b', 'glass-blur-sm', content)
    return content


def ensure_classes_in_element(element_str: str, required_classes: list) -> str:
    """
    Ensure an element has all required classes.
    Handles elements with or without existing className.
    """
    # Check if element already has all required classes
    has_all = all(cls in element_str for cls in required_classes)
    if has_all:
        return element_str

    # Extract existing className if present
    class_match = re.search(r'className=["\']([^"\']*)["\']', element_str)

    if class_match:
        existing_classes = class_match.group(1).split()
        # Add missing classes
        for cls in required_classes:
            if cls not in existing_classes:
                existing_classes.append(cls)

        # Rebuild className
        new_classname = ' '.join(existing_classes)
        # Replace old className with new one
        element_str = element_str.replace(class_match.group(0), f'className="{new_classname}"')
    else:
        # No className exists, add one before the closing >
        classes_str = ' '.join(required_classes)
        # Find the position to insert (before /> or >)
        if element_str.endswith('/>'):
            element_str = element_str[:-2] + f' className="{classes_str}" />'
        elif element_str.endswith('>'):
            element_str = element_str[:-1] + f' className="{classes_str}">'
        else:
            # Shouldn't happen, but handle gracefully
            element_str = element_str + f' className="{classes_str}"'

    return element_str


def fix_interactive_elements(content: str) -> Tuple[str, int]:
    """
    Add glass-focus, glass-touch-target, glass-contrast-guard to all interactive elements.
    Returns (fixed_content, number_of_fixes)
    """
    fixes = 0

    # Pattern to match complete JSX elements across multiple lines
    # We'll normalize line breaks within elements first
    lines = content.split('\n')
    normalized_lines = []
    in_element = False
    current_element = []

    for line in lines:
        # Check if line contains element opening
        if re.search(r'<(button|input|select|textarea|a)\s', line):
            in_element = True
            current_element = [line]
        elif in_element:
            current_element.append(line)
            # Check if element closes on this line
            if '>' in line:
                # Reconstruct the full element
                full_element = ' '.join(current_element)
                normalized_lines.append(full_element)
                in_element = False
                current_element = []
            continue
        else:
            normalized_lines.append(line)

    # Now process the normalized content
    modified_content = '\n'.join(normalized_lines)

    # Fix all button elements
    def fix_button(match):
        nonlocal fixes
        original = match.group(0)
        fixed = ensure_classes_in_element(original, ['glass-focus', 'glass-touch-target', 'glass-contrast-guard'])
        if fixed != original:
            fixes += 1
        return fixed

    # Match button/input/select/textarea/a elements
    modified_content = re.sub(
        r'<button\s[^>]*>',
        fix_button,
        modified_content,
        flags=re.IGNORECASE
    )

    modified_content = re.sub(
        r'<input\s[^>]*/?>',
        fix_button,
        modified_content,
        flags=re.IGNORECASE
    )

    modified_content = re.sub(
        r'<select\s[^>]*>',
        fix_button,
        modified_content,
        flags=re.IGNORECASE
    )

    modified_content = re.sub(
        r'<textarea\s[^>]*>',
        fix_button,
        modified_content,
        flags=re.IGNORECASE
    )

    modified_content = re.sub(
        r'<a\s[^>]*>',
        fix_button,
        modified_content,
        flags=re.IGNORECASE
    )

    return modified_content, fixes


def main():
    src_dir = Path('/Users/gurbakshchahal/AuraGlass/src')

    # Process all TypeScript files
    ts_files = list(src_dir.rglob('*.ts'))
    tsx_files = list(src_dir.rglob('*.tsx'))
    all_files = ts_files + tsx_files

    print(f"Processing {len(all_files)} files...")

    total_files_fixed = 0
    total_elements_fixed = 0

    for file_path in all_files:
        try:
            content = file_path.read_text()
            original_content = content

            # Apply fixes
            content = fix_class_prefix_issues(content)
            content, element_fixes = fix_interactive_elements(content)

            if content != original_content:
                file_path.write_text(content)
                total_files_fixed += 1
                total_elements_fixed += element_fixes
                print(f"✓ Fixed: {file_path.relative_to(src_dir.parent)} ({element_fixes} elements)")

        except Exception as e:
            print(f"✗ Error processing {file_path}: {e}")

    print(f"\n✅ Complete!")
    print(f"   Files fixed: {total_files_fixed}")
    print(f"   Elements fixed: {total_elements_fixed}")

    return 0


if __name__ == '__main__':
    sys.exit(main())
