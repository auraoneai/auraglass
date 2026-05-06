#!/usr/bin/env python3
"""
Fix duplicate className attributes in JSX elements.
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
    classes1 = set(class1.split())
    classes2 = set(class2.split())

    # Merge and remove duplicates
    all_classes = classes1 | classes2

    # Join back into a single className attribute
    merged = ' '.join(sorted(all_classes))

    return f'className="{merged}"'

def fix_duplicate_classnames(content: str) -> str:
    """Fix duplicate className attributes in JSX."""

    # Pattern: className="..." className="..."
    pattern = r'className="([^"]*)" className="([^"]*)"'

    content = re.sub(pattern, merge_classnames, content)

    return content

def main():
    src_dir = Path('/Users/gurbakshchahal/AuraGlass/src')

    # Find files with duplicate className
    files_to_fix = [
        src_dir / 'components/collaboration/CollaborativeGlassWorkspace.tsx',
        src_dir / 'components/data-display/GlassNotificationCenter.tsx',
        src_dir / 'components/interactive/GlassPatternBuilder.tsx',
    ]

    fixed_count = 0
    for file_path in files_to_fix:
        if not file_path.exists():
            print(f"⚠ File not found: {file_path}")
            continue

        content = file_path.read_text()
        fixed_content = fix_duplicate_classnames(content)

        if content != fixed_content:
            file_path.write_text(fixed_content)
            fixed_count += 1
            print(f"✓ Fixed: {file_path.relative_to(src_dir.parent)}")

    print(f"\n✓ Fixed {fixed_count} files")
    return 0

if __name__ == '__main__':
    sys.exit(main())
