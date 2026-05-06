#!/usr/bin/env python3
"""
Fix ALL duplicate className attributes in JSX elements across the entire src directory.
Pattern: className="..." className="..."
Should be: className="... ..." (merged with unique classes)
"""

import re
import sys
from pathlib import Path

def merge_classnames(match):
    """Merge duplicate className attributes, removing duplicate classes."""
    class1 = match.group(1)
    class2 = match.group(2)

    # Split both className values into individual classes
    classes1 = class1.split()
    classes2 = class2.split()

    # Combine both lists while preserving order from first, then adding new from second
    seen = set()
    merged_classes = []

    for cls in classes1:
        if cls not in seen:
            merged_classes.append(cls)
            seen.add(cls)

    for cls in classes2:
        if cls not in seen:
            merged_classes.append(cls)
            seen.add(cls)

    # Join back into a single className attribute
    merged = ' '.join(merged_classes)

    return f'className="{merged}"'

def fix_duplicate_classnames(content: str) -> str:
    """Fix duplicate className attributes in JSX."""

    # Pattern: className="..." className="..."
    # Need to handle this iteratively in case there are multiple duplicates
    while True:
        new_content = re.sub(r'className="([^"]*)" className="([^"]*)"', merge_classnames, content)
        if new_content == content:
            break
        content = new_content

    return content

def main():
    src_dir = Path('/Users/gurbakshchahal/AuraGlass/src')

    # Find all TSX files
    tsx_files = list(src_dir.rglob('*.tsx'))

    print(f"Scanning {len(tsx_files)} .tsx files for duplicate className attributes...")

    fixed_count = 0
    for file_path in tsx_files:
        content = file_path.read_text()

        # Check if file has duplicate className
        if 'className="' in content and re.search(r'className="[^"]*" className=', content):
            fixed_content = fix_duplicate_classnames(content)

            if content != fixed_content:
                file_path.write_text(fixed_content)
                fixed_count += 1
                print(f"✓ Fixed: {file_path.relative_to(src_dir.parent)}")

    print(f"\n✓ Fixed {fixed_count} files")
    return 0

if __name__ == '__main__':
    sys.exit(main())
