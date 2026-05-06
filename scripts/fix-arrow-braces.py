#!/usr/bin/env python3
"""
Fix broken arrow function patterns where the opening brace is misplaced.
Pattern: ) =>\n  const foo = bar(); {
Should be: ) => {\n  const foo = bar();
"""

import re
import sys
from pathlib import Path

def fix_arrow_braces(content: str) -> str:
    """Fix broken arrow function opening brace patterns."""

    # Pattern: ) =>\n  some_statement; {
    # This handles cases where the arrow function's opening brace got moved to after a semicolon
    pattern = r'\) =>\n(\s+)([^\n]+); \{'

    def replacement(match):
        indent = match.group(1)
        statement = match.group(2)
        return f') => {{\n{indent}{statement};'

    content = re.sub(pattern, replacement, content)

    return content

def main():
    src_dir = Path('/Users/gurbakshchahal/AuraGlass/src')

    # Find all .tsx files
    tsx_files = list(src_dir.rglob('*.tsx'))

    print(f"Scanning {len(tsx_files)} .tsx files for broken arrow function patterns...")

    fixed_count = 0
    for file_path in tsx_files:
        content = file_path.read_text()
        fixed_content = fix_arrow_braces(content)

        if content != fixed_content:
            file_path.write_text(fixed_content)
            fixed_count += 1
            print(f"✓ Fixed: {file_path.relative_to(src_dir.parent)}")

    print(f"\n✓ Fixed {fixed_count} files")
    return 0

if __name__ == '__main__':
    sys.exit(main())
