import os

src_dir = os.path.join(os.path.dirname(__file__), 'frontend', 'src')

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            if file == 'config.js': continue
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if 'http://localhost:8000' in content:
                # determine import path
                rel_dir = os.path.relpath(src_dir, root)
                if rel_dir == '.':
                    import_path = './config'
                else:
                    import_path = os.path.join(rel_dir, 'config').replace('\\', '/')
                
                # add import if not there
                if 'API_BASE_URL' not in content:
                    lines = content.split('\n')
                    # Find first empty line or insert at top
                    insert_idx = 0
                    for i, line in enumerate(lines):
                        if line.startswith('import '):
                            insert_idx = i + 1
                    lines.insert(insert_idx, f"import {{ API_BASE_URL }} from '{import_path}';")
                    content = '\n'.join(lines)
                
                # Replace url formats
                # 'http://localhost:8000/api/...' -> `${API_BASE_URL}/api/...`
                # Careful with string literals vs template literals
                content = content.replace("'http://localhost:8000", "`${API_BASE_URL}")
                content = content.replace("http://localhost:8000", "${API_BASE_URL}")
                
                # We need to make sure the quotes match.
                # If it was 'http://localhost:8000/api/', it becomes `${API_BASE_URL}/api/'
                # We should replace `'${API_BASE_URL}` with `${API_BASE_URL}` inside backticks.
                # A safer approach since JS uses ticks for templates:
                content = content.replace("'`${API_BASE_URL}", "`${API_BASE_URL}")
                
                # Actually, let's just do an exact string replace.
                # Find all occurrences of 'http://localhost:8000... ' and change to backticks
                import re
                content = re.sub(r"'http://localhost:8000([^']*)'", r"`${API_BASE_URL}\1`", content)
                content = re.sub(r'"http://localhost:8000([^"]*)"', r"`${API_BASE_URL}\1`", content)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {filepath}")
