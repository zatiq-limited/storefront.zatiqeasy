#!/usr/bin/env python3
"""
Fix image paths in all Zatiq components
Converts: ../../assets/image/... → /assets/...
"""

import os
import re
from pathlib import Path

def fix_image_paths(file_path):
    """Fix image import paths in a TypeScript/TSX file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Pattern 1: import something from '../../assets/image/...'
    content = re.sub(
        r"import\s+(\w+)\s+from\s+['\"]\.\.\/\.\.\/assets\/image\/([^'\"]+)['\"];?",
        r"const \1 = '/assets/\2';",
        content
    )
    
    # Pattern 2: import something from '../../assets/...'  (without image folder)
    content = re.sub(
        r"import\s+(\w+)\s+from\s+['\"]\.\.\/\.\.\/assets\/([^'\"]+)['\"];?",
        r"const \1 = '/assets/\2';",
        content
    )
    
    # Pattern 3: Fix any malformed paths like '/assets/... with missing quote
    content = re.sub(
        r"from\s+'/assets/([^'\"]+)\"",
        r"from '/assets/\1'",
        content
    )
    content = re.sub(
        r'from\s+"/assets/([^\'\"]+)\'',
        r'from "/assets/\1"',
        content
    )
    
    # Pattern 4: Direct string references
    content = re.sub(
        r"['\"]\.\.\/\.\.\/assets\/image\/([^'\"]+)['\"]",
        r"'/assets/\1'",
        content
    )
    
    # Pattern 5: Fix already half-fixed imports
    content = re.sub(
        r"import\s+(\w+)\s+from\s+'/assets/([^'\"]+)['\"];?",
        r"const \1 = '/assets/\2';",
        content
    )
    
    content = re.sub(
        r'import\s+(\w+)\s+from\s+"/assets/([^\'\"]+)[\'"];?',
        r'const \1 = "/assets/\2";',
        content
    )
    
    # Only write if changed
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    """Process all component files"""
    base_path = Path("src/components/zatiq")
    
    if not base_path.exists():
        print(f"❌ Path not found: {base_path}")
        return
    
    print("🔧 Fixing image paths in components...")
    print()
    
    fixed_count = 0
    total_count = 0
    
    for tsx_file in base_path.rglob("*.tsx"):
        total_count += 1
        if fix_image_paths(tsx_file):
            fixed_count += 1
            print(f"✅ Fixed: {tsx_file.relative_to('src/components/zatiq')}")
    
    print()
    print(f"📊 Summary:")
    print(f"   Total files: {total_count}")
    print(f"   Fixed files: {fixed_count}")
    print(f"   Unchanged: {total_count - fixed_count}")
    print()
    print("✨ Done! Restart dev server to see changes.")

if __name__ == "__main__":
    main()
