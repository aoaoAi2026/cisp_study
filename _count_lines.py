import os

files = {
    'data': [
        'cyberAi.ts', 'cyberAiExtended.ts', 'cyberBasic.ts', 'cyberDefense.ts',
        'cyberPenetration.ts', 'cybersecurityData.ts', 'emergencyResponse.ts',
        'learningData.ts', 'pastPapers.ts', 'resourceData.ts', 'securityScripts.ts',
        'toolSites.ts'
    ],
    'pages': [
        'CodeLab.tsx', 'CodeRunner.tsx', 'CyberDailyLearning.tsx',
        'LabEnvironment.tsx', 'MockExam.tsx', 'CyberLearningMain.tsx'
    ]
}

print('=== src/data/ ===')
total = 0
for f in files['data']:
    path = f'src/data/{f}'
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8', errors='ignore') as fh:
            lines = len(fh.readlines())
        total += lines
        print(f'  {f:<40s} {lines:>8,} lines')
    else:
        print(f'  {f:<40s} (missing)')
print(f'  {"TOTAL":<40s} {total:>8,} lines')

print()
print('=== src/pages/ ===')
total = 0
for f in files['pages']:
    path = f'src/pages/{f}'
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8', errors='ignore') as fh:
            lines = len(fh.readlines())
        total += lines
        print(f'  {f:<40s} {lines:>8,} lines')
    else:
        print(f'  {f:<40s} (missing)')
print(f'  {"TOTAL":<40s} {total:>8,} lines')
