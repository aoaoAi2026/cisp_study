# Find and report all lines with potential quote issues
lines = open('gen_31_50.py','r',encoding='utf-8').readlines()
for i, line in enumerate(lines, 1):
    s = line.rstrip()
    # Check for lines that start with single quote and contain PHP-like patterns
    if s.lstrip().startswith("'") or s.lstrip().startswith('"'):
        if any(x in s for x in ["'_GET'", "'_POST'", "'_SERVER'", "'_REQUEST'", 
                                 "system(", "exec(", "passthru(", "shell_exec",
                                 "->prepare", "$_GET", "$_POST"]):
            print(f"Line {i}: {s[:120]}")
