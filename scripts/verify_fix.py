import re
fpath = r'e:\internal_safe\cisp1\cisp\src\data\cyberBasic.ts'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Check basic-1 specifically
idx = content.find("id: 'basic-1'")
end = min(idx + 3000, len(content))
chunk = content[idx:end]
has_res = 'resources:' in chunk
has_code = 'codeExamples:' in chunk
has_lab = 'labEnvironment:' in chunk
has_tools = 'recommendedTools:' in chunk
has_quiz = 'quiz:' in chunk
has_notes = 'expertNotes:' in chunk
print(f'basic-1 check (first 3000 chars):')
print(f'  resources: {has_res}')
print(f'  codeExamples: {has_code}')
print(f'  labEnvironment: {has_lab}')
print(f'  recommendedTools: {has_tools}')
print(f'  quiz: {has_quiz}')
print(f'  expertNotes: {has_notes}')

# Check pen-10
fpath2 = r'e:\internal_safe\cisp1\cisp\src\data\cyberPenetration.ts'
with open(fpath2, 'r', encoding='utf-8') as f:
    content2 = f.read()
idx2 = content2.find("id: 'pen-10'")
end2 = min(idx2 + 3000, len(content2))
chunk2 = content2[idx2:end2]
has_res2 = 'resources:' in chunk2
print(f'\npen-10 check:')
print(f'  resources: {has_res2}')

idx14 = content2.find("id: 'pen-14'")
end14 = min(idx14 + 3000, len(content2))
chunk14 = content2[idx14:end14]
has_res14 = 'resources:' in chunk14
print(f'pen-14 check:')
print(f'  resources: {has_res14}')
