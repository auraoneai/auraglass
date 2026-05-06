#!/usr/bin/env python3
"""
Fix broken onClick patterns caused by regex transformations.
Pattern: onClick={(e) = className="..."> handler}
Should be: onClick={(e) => handler} with className as separate prop
"""

import re
import sys
from pathlib import Path

def fix_onclick_pattern(content: str) -> str:
    """Fix broken onClick patterns in TSX content."""

    # Pattern 1: onClick={(args) = className="..."> handler}
    # Extract the arrow function arguments and handler, discard the broken className
    pattern1 = r'onClick=\{(\([^)]*\))\s*=\s*className="[^"]*">\s*([^}]+)\}'
    replacement1 = r'onClick={\1 => \2}'
    content = re.sub(pattern1, replacement1, content)

    # Pattern 2: Same with single quotes
    pattern2 = r"onClick=\{(\([^)]*\))\s*=\s*className='[^']*'>\s*([^}]+)\}"
    replacement2 = r'onClick={\1 => \2}'
    content = re.sub(pattern2, replacement2, content)

    # Pattern 3: onClick={() = className="..."> handler} (no args)
    pattern3 = r'onClick=\{(\(\))\s*=\s*className="[^"]*">\s*([^}]+)\}'
    replacement3 = r'onClick={\1 => \2}'
    content = re.sub(pattern3, replacement3, content)

    # Pattern 4: Same with single quotes
    pattern4 = r"onClick=\{(\(\))\s*=\s*className='[^']*'>\s*([^}]+)\}"
    replacement4 = r'onClick={\1 => \2}'
    content = re.sub(pattern4, replacement4, content)

    return content

def main():
    src_dir = Path('/Users/gurbakshchahal/AuraGlass/src')

    # Find all files with broken patterns
    broken_files = []
    for tsx_file in src_dir.rglob('*.tsx'):
        content = tsx_file.read_text()
        if '= className=' in content and 'onClick' in content:
            # Check for the specific broken pattern
            if re.search(r'onClick=\{[^}]*=\s*className=', content):
                broken_files.append(tsx_file)

    print(f"Found {len(broken_files)} files with broken onClick patterns")

    # Fix each file
    fixed_count = 0
    for file_path in broken_files:
        content = file_path.read_text()
        fixed_content = fix_onclick_pattern(content)

        if content != fixed_content:
            file_path.write_text(fixed_content)
            fixed_count += 1
            print(f"✓ Fixed: {file_path.relative_to(src_dir.parent)}")

    print(f"\n✓ Fixed {fixed_count} files")
    return 0

if __name__ == '__main__':
    sys.exit(main())
